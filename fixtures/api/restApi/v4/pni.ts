import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from '../dbClasses'
import * as env from '../restApiUrls'
import { OasysDateTime } from 'oasys'
import { QaData } from '../../data/qaData'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const relevantAssessments = offenderData.assessments.filter(pniFilter)
    if (relevantAssessments.length == 0) {
        return env.restErrorResults.noAssessments
    } else {
        const result = new PniEndpointResponse(offenderData, parameters)

        const assessment = relevantAssessments[relevantAssessments.length - 1]
        result.addAssessment(assessment)
        delete result.timeline

        const saraDateLimit = OasysDateTime.stringToDate(assessment.completedDate).subtract({ weeks: 6 }).toString()

        const saraAssessments = offenderData.assessments.filter(  // Pass all SARAs for this offender that are complete or locked in 6 weeks up to the main assessment date
            (ass) => ass.assessmentType == 'SARA'
                && ['COMPLETE', 'LOCKED_INCOMPLETE'].includes(ass.status)
                && ass.completedDate.substring(0, 10) >= saraDateLimit && ass.completedDate <= assessment.completedDate
        )

        result.pniCalc.push(new PniCalc(
            offenderData,
            assessment as dbClasses.DbAssessment,
            saraAssessments as dbClasses.DbAssessment[],
            parameters.additionalParameter == 'Y'
        ))
        return result
    }
}

export function pniFilter(dbAssessment: dbClasses.DbAssessmentOrRsr): boolean {

    return dbAssessment.assessmentType == 'LAYER3' && dbAssessment.status == 'COMPLETE' && (dbAssessment as dbClasses.DbAssessment).pOAssessment != '620'
}

export class PniEndpointResponse extends v4Common.V4EndpointResponse {

    assessments: PniAssessment[] = []
    pniCalc: PniCalc[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, PniAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class PniAssessment extends v4Common.V4AssessmentCommon {

    everCommittedSexualOffence: string
    openSexualOffendingQuestions: string
    sexualPreOccupation: string
    offenceRelatedSexualInterests: string
    emotionalCongruence: string
    proCriminalAttitudes: string
    hostileOrientation: string
    relCloseFamily: string
    prevCloseRelationships: string
    easilyInfluenced: string
    aggressiveControllingBehavour: string
    impulsivity: string
    temperControl: string
    problemSolvingSkills: string
    difficultiesCoping: string

    ogpOvp: OgpOvp
    ldcData: LdcData
    rsrOspData: RsrOspData

    addDetails(dbAssessment: dbClasses.DbAssessment) {

        delete this.assessor

        this.everCommittedSexualOffence = dbAssessment.qaData.getString('1.30')
        this.openSexualOffendingQuestions = dbAssessment.qaData.getString('6.11')
        this.sexualPreOccupation = dbAssessment.qaData.getString('11.11')
        this.offenceRelatedSexualInterests = dbAssessment.qaData.getString('11.12')
        this.emotionalCongruence = dbAssessment.qaData.getString('6.12')
        this.proCriminalAttitudes = dbAssessment.qaData.getString('12.1')
        this.hostileOrientation = dbAssessment.qaData.getString('12.9')
        this.relCloseFamily = dbAssessment.qaData.getString('6.1')
        this.prevCloseRelationships = dbAssessment.qaData.getString('6.6')
        this.easilyInfluenced = dbAssessment.qaData.getString('7.3')
        this.aggressiveControllingBehavour = dbAssessment.qaData.getString('11.3')
        this.impulsivity = dbAssessment.qaData.getString('11.2')
        this.temperControl = dbAssessment.qaData.getString('11.4')
        this.problemSolvingSkills = dbAssessment.qaData.getString('11.6')
        this.difficultiesCoping = dbAssessment.qaData.getString('10.1')

        this.ogpOvp = new OgpOvp(dbAssessment.riskDetails)
        this.ldcData = new LdcData(dbAssessment)
        this.rsrOspData = new RsrOspData(dbAssessment)
    }
}

class PniCalc {

    offenderPk: number
    pniCalculation: string
    missingFields: string[]
    riskLevel: string
    sexDomainLevel: string
    sexDomainScore: number
    thinkingDomainLevel: string
    thinkingDomainScore: number
    relationshipDomainLevel: string
    relationshipDomainScore: number
    selfManagementDomainLevel: string
    selfManagementDomainScore: number
    totalDomainScore: number
    overallNeedLevel: string
    saraRiskLevelToPartner: number
    saraRiskLevelToOther: number

    constructor(offenderData: dbClasses.DbOffenderWithAssessments,
        dbAssessment: dbClasses.DbAssessment,
        saraAssessments: dbClasses.DbAssessment[],
        community: boolean) {

        /*
            2.3 means physical violence against partner = YES
            6.7 means DA perp against partner = YES (allow for pre and post 6.30 versions)

            1. Age at initiation date <18 - both 1
            2. Completed SARA associated with the assessment - both as answered in SARA
            3. SARA prompted but declined (OASYS_SET.NO_SARA_DATE is not null).  If not 6.7 and not 2.3, both 1
            4. Associated SARA is locked incomplete and (6.7 or 2.3), then check SARA answers.  If both answered, or one is 2 or 3, then pass both as answered.
                    Otherwise: find any earlier non-deleted SARA in 6 weeks prior to completion date.
                                If any found, apply rules as above, stop if answers found.
                                Otherwise - both 1
            5. Otherwise, both 1.
        */

        const age = OasysDateTime.dateDiffString(dbAssessment.dateOfBirth, dbAssessment.initiationDate, 'year')

        // Rule 1
        if (age < 18) {
            this.saraRiskLevelToPartner = 1
            this.saraRiskLevelToOther = 1
        } else {
            const associatedSaras = offenderData.assessments.filter((ass) =>
                ass.assessmentType == 'SARA' &&
                (ass as dbClasses.DbAssessment).parentAssessmentPk == dbAssessment.assessmentPk
            )
            const associatedSara = associatedSaras.length > 0 ? associatedSaras[0] as dbClasses.DbAssessment : null

            const associatedSaraRiskToPartner = associatedSara?.qaData.getRiskAsNumber('SR76.1.1')
            const associatedSaraRiskToOther = associatedSara?.qaData.getRiskAsNumber('SR77.1.1')

            // Rule 2
            if (associatedSara?.status == 'COMPLETE') {
                this.saraRiskLevelToPartner = associatedSaraRiskToPartner
                this.saraRiskLevelToOther = associatedSaraRiskToOther

            } else {
                const q2_3 = dbAssessment.qaData.getStringArray('2.3')?.includes('Physical violence towards partner')
                const after6_30 = OasysDateTime.checkIfAfterReleaseNode('6.30', dbAssessment.initiationDate)
                const q6_7 = da(dbAssessment.qaData, after6_30)

                // Rule 3
                if (associatedSara == null && dbAssessment.noSaraDate != null && !q2_3 && !q6_7) {

                    this.saraRiskLevelToPartner = 1
                    this.saraRiskLevelToOther = 1

                    // Rule 4
                } else if (associatedSara?.status == 'LOCKED_INCOMPLETE' || dbAssessment.noSaraDate != null) {  // SARA was part complete or rejected
                    if ((associatedSaraRiskToPartner != null && associatedSaraRiskToOther != null) || associatedSaraRiskToPartner > 1 || associatedSaraRiskToOther > 1) {
                        this.saraRiskLevelToPartner = associatedSaraRiskToPartner
                        this.saraRiskLevelToOther = associatedSaraRiskToOther
                    } else {
                        for (let i = saraAssessments.length - 1; i >= 0; i--) {  // Step backwards through the other SARAs, use the values and drop out if applicable
                            if (saraAssessments[i].parentAssessmentPk != dbAssessment.assessmentPk) {
                                const riskToPartner = saraAssessments[i].qaData.getRiskAsNumber('SR76.1.1')
                                const riskToOther = saraAssessments[i].qaData.getRiskAsNumber('SR77.1.1')
                                if ((riskToPartner != null && riskToOther != null) || riskToPartner > 1 || riskToOther > 1) {
                                    this.saraRiskLevelToPartner = riskToPartner
                                    this.saraRiskLevelToOther = riskToOther
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
        // Rule 5
        if (this.saraRiskLevelToPartner == null) {
            this.saraRiskLevelToPartner = 1
        }
        if (this.saraRiskLevelToOther == null) {
            this.saraRiskLevelToOther = 1
        }

        const pniCalcResult = pniCalc(dbAssessment, community, this.saraRiskLevelToPartner, this.saraRiskLevelToOther)

        this.offenderPk = offenderData.offenderPk
        this.pniCalculation = pniCalcResult.pniCalculation
        this.missingFields = pniCalcResult.missingFields
        this.riskLevel = pniCalcResult.riskLevel
        this.sexDomainLevel = pniCalcResult.sexDomainLevel
        this.sexDomainScore = pniCalcResult.sexDomainScore
        this.thinkingDomainLevel = pniCalcResult.thinkingDomainLevel
        this.thinkingDomainScore = pniCalcResult.thinkingDomainScore
        this.relationshipDomainLevel = pniCalcResult.relationshipDomainLevel
        this.relationshipDomainScore = pniCalcResult.relationshipDomainScore
        this.selfManagementDomainLevel = pniCalcResult.selfManagementDomainLevel
        this.selfManagementDomainScore = pniCalcResult.selfManagementDomainScore
        this.totalDomainScore = pniCalcResult.totalDomainScore
        this.overallNeedLevel = pniCalcResult.overallNeedLevel

    }
}

function da(qaData: QaData, after6_30: boolean): boolean {

    if (after6_30) {
        const q67 = qaData.getString('6.7da')
        if (q67 != 'Yes') {
            return false
        } else {
            return qaData.getString('6.7.2.1da') == 'Yes'
        }
    } else {
        const q67 = qaData.getString('6.7')
        if (q67 != 'Yes') {
            return false
        } else {
            return qaData.getString('6.7.1')?.includes('Perpetrator') ?? false
        }
    }
}

class OgpOvp {

    ogrs3RiskRecon: string
    ovpRisk: string

    constructor(dbRiskDetails: dbClasses.DbRiskDetails) {

        this.ogrs3RiskRecon = common.riskLabel(dbRiskDetails.ogrs3RiskRecon)
        this.ovpRisk = common.riskLabel(dbRiskDetails.ovpRisk)
    }
}

class LdcData {

    ldc: number
    ldcSubTotal: number
    ldcMsg: string = null

    constructor(dbAssessment: dbClasses.DbAssessment) {

        this.ldc = dbAssessment.learningToolScore
        this.ldcSubTotal = dbAssessment.ldcSubTotal
        if (dbAssessment.ldcFuncProc == null) {
            this.ldcMsg = 'Learning Screening Tool not switched on'
        } else if (dbAssessment.ldcFuncProc == 'Y' && dbAssessment.learningToolScore == null) {
            this.ldcMsg = 'Insufficient data to calculate'
        }
    }
}

class RsrOspData {

    ospCdcScoreLevel: string
    ospIiicScoreLevel: string
    rsrPercentageScore: number
    rsrAlgorithmVersion: number
    offenderAge: number

    constructor(dbAssessment: dbClasses.DbAssessment) {

        this.ospCdcScoreLevel = common.riskLabel(dbAssessment.riskDetails.ospDcRisk) ?? common.riskLabel(dbAssessment.riskDetails.ospCRisk)  // For pre-6.49 assessments
        this.ospIiicScoreLevel = common.riskLabel(dbAssessment.riskDetails.ospIicRisk) ?? common.riskLabel(dbAssessment.riskDetails.ospIRisk)  // For pre-6.49 assessments
        this.rsrPercentageScore = common.fixDp(dbAssessment.riskDetails.rsrPercentageScore)
        this.rsrAlgorithmVersion = dbAssessment.riskDetails.rsrAlgorithmVersion
        this.offenderAge = OasysDateTime.dateDiffString(dbAssessment.dateOfBirth, dbAssessment.initiationDate, 'year')
    }
}

function pniCalc(dbAssessment: dbClasses.DbAssessment, community: boolean, saraRiskPartner: number, saraRiskOther: number): PniCalcResult {

    const result: PniCalcResult = {
        sexDomainLevel: null,
        sexDomainScore: 0,
        thinkingDomainLevel: null,
        thinkingDomainScore: 0,
        relationshipDomainLevel: null,
        relationshipDomainScore: 0,
        selfManagementDomainLevel: null,
        selfManagementDomainScore: 0,
        totalDomainScore: 0,
        overallNeedLevel: null,
        riskLevel: 'O',
        pniCalculation: 'O',
        missingFields: [],
        partResult: null,
    }

    // First just calculate domains scores rather than look for trump conditions
    // The domain levels have to be repoorted

    // Calculate the SEX DOMAIN SCORE
    const s1_30 = dbAssessment.qaData.getString('1.30')          // Sexual motivation
    let s6_11 = dbAssessment.qaData.getString('6.11') ?? 'No'    // Open Sex Questions, default to No
    const s11_11 = dbAssessment.qaData.getOasysScore('11.11')    // Sexual pre-occupation
    const s11_12 = dbAssessment.qaData.getOasysScore('11.12')    // Offence related sexual interest
    const s6_12 = dbAssessment.qaData.getOasysScore('6.12')      // Emotional congruence with children

    let sexDomainScore = 0
    let sexDomainProject = 0

    if (s1_30 == null && s6_11 == 'No') {
        sexDomainProject = 6                                // Project the max if it had been answered.  6 to project highest domain score(of 2)
        result.missingFields.push('1.30 Have they ever committed a sexual or sexually motivated offence?') // 1.9 added && removed below

    } else if (s1_30 == 'Yes' || s6_11 == 'Yes') {          // We can continue to look at the sex domain scores
        if (s11_12 == null) {                               // Offence related sexual interest has not been answered
            sexDomainProject = 6
            result.missingFields.push('11.12 Offence Related Sexual Interests')
        } else if (s11_12 == 2) {
            sexDomainScore = 6                              // 6 DUE TO TRUMP
            sexDomainProject = 6
        } else {
            sexDomainScore += s11_12
            sexDomainProject += s11_12
        }

        if (s11_11 == null) {
            sexDomainProject += 2                           // Project the max as not answered
            result.missingFields.push('11.11 Sexual Pre-Occupation')
        } else {
            sexDomainScore += s11_11
            sexDomainProject += s11_11
        }

        if (s6_12 == null) {
            sexDomainProject += 2                           // Project the max as not answered
            result.missingFields.push('6.12 Emotional Congruence with Children/ Feeling Closer to Children than Adults')
        } else {
            sexDomainScore += s6_12
            sexDomainProject += s6_12
        }
    }

    result.sexDomainScore = sexDomainScore < 2 ? 0 : sexDomainScore < 4 ? 1 : 2
    result.sexDomainLevel = result.sexDomainScore == 0 ? 'L' : result.sexDomainScore == 1 ? 'M' : 'H'
    sexDomainProject = sexDomainProject < 2 ? 0 : sexDomainProject < 4 ? 1 : 2

    // THINKING DOMAIN
    const s12_1 = dbAssessment.qaData.getOasysScore('12.1')      // Pro-criminal attitudes
    const s12_9 = dbAssessment.qaData.getOasysScore('12.9')      // Hostile orientation
    let thinkingDomainScore = 0
    let thinkingDomainProject = 0

    if (s12_1 == null) {
        thinkingDomainProject = 4   // Project trump condition
        result.missingFields.push('12.1 Pro-criminal attitudes')
    } else if (s12_1 == 2) {
        thinkingDomainScore = 4     // Trump Condition
        thinkingDomainProject = 4
    } else {
        thinkingDomainScore = s12_1
        thinkingDomainProject = s12_1
    }

    if (s12_1 != 2) {               // There is no trump
        if (s12_9 == null) {
            thinkingDomainProject = thinkingDomainProject + 2
            result.missingFields.push('12.9 Hostile orientation')
        } else {
            thinkingDomainScore = thinkingDomainScore + s12_9
            thinkingDomainProject = thinkingDomainProject + s12_9
        }
    }

    result.thinkingDomainScore = thinkingDomainScore < 1 ? 0 : thinkingDomainScore < 3 ? 1 : 2
    result.thinkingDomainLevel = result.thinkingDomainScore == 0 ? 'L' : result.thinkingDomainScore == 1 ? 'M' : 'H'
    thinkingDomainProject = thinkingDomainProject < 1 ? 0 : thinkingDomainProject < 3 ? 1 : 2

    // RELATIONSHIPS DOMAIN
    const s6_1 = dbAssessment.qaData.getOasysScore('6.1')         // Current relationship with close family member 0, 1, 2, M
    const s6_6 = dbAssessment.qaData.getOasysScore('6.6')         // Previous experience of close relationships 0, 1, 2, M
    const s7_3 = dbAssessment.qaData.getOasysScore('7.3')         // Easily influenced by criminal associates 0, 1, 2, M
    const s11_3 = dbAssessment.qaData.getOasysScore('11.3')      // Aggressive controlling behaviour

    let relationshipsDomainScore = 0
    let relationshipDomainScoreProject = 0

    if (s6_1 == null) {
        relationshipDomainScoreProject = 2
        result.missingFields.push('6.1 Current relationship with close family member')
    } else {
        relationshipsDomainScore = s6_1
        relationshipDomainScoreProject = s6_1
    }

    if (s6_6 == null) {
        relationshipDomainScoreProject = relationshipDomainScoreProject + 2
        result.missingFields.push('6.6 Previous experience of close relationships')
    } else {
        relationshipsDomainScore = relationshipsDomainScore + s6_6
        relationshipDomainScoreProject = relationshipDomainScoreProject + s6_6
    }

    if (s7_3 == null) {
        relationshipDomainScoreProject = relationshipDomainScoreProject + 2
        result.missingFields.push('7.3 Easily influenced by criminal associates')
    } else {
        relationshipsDomainScore = relationshipsDomainScore + s7_3
        relationshipDomainScoreProject = relationshipDomainScoreProject + s7_3
    }

    if (s11_3 == null) {
        relationshipDomainScoreProject = relationshipDomainScoreProject + 2
        result.missingFields.push('11.3 Aggressive controlling behaviour')
    } else {
        relationshipsDomainScore = relationshipsDomainScore + s11_3
        relationshipDomainScoreProject = relationshipDomainScoreProject + s11_3
    }

    result.relationshipDomainScore = relationshipsDomainScore < 2 ? 0 : relationshipsDomainScore < 5 ? 1 : 2
    result.relationshipDomainLevel = result.relationshipDomainScore == 0 ? 'L' : result.relationshipDomainScore == 1 ? 'M' : 'H'
    relationshipDomainScoreProject = relationshipDomainScoreProject < 2 ? 0 : relationshipDomainScoreProject < 5 ? 1 : 2

    // SELF MANAGEMENT DOMAIN
    const s11_2 = dbAssessment.qaData.getOasysScore('11.2')      // Impulsivity
    const s11_4 = dbAssessment.qaData.getOasysScore('11.4')      // Temper Control
    const s11_6 = dbAssessment.qaData.getOasysScore('11.6')      // Problem solving skills
    const s10_1 = dbAssessment.qaData.getOasysScore('10.1')      // Difficulties coping

    let selfManagementDomainScore = 0
    let selfManagementDomainScoreProject = 0

    if (s11_2 == null) {
        selfManagementDomainScoreProject = 2
        result.missingFields.push('11.2 Impulsivity')
    } else {
        selfManagementDomainScore = s11_2
        selfManagementDomainScoreProject = s11_2
    }

    if (s11_4 == null) {
        selfManagementDomainScoreProject = selfManagementDomainScoreProject + 2
        result.missingFields.push('11.4 Temper Control')
    } else {
        selfManagementDomainScore = selfManagementDomainScore + s11_4
        selfManagementDomainScoreProject = selfManagementDomainScoreProject + s11_4
    }

    if (s11_6 == null) {
        selfManagementDomainScoreProject = selfManagementDomainScoreProject + 2
        result.missingFields.push('11.6 Problem solving skills')
    } else {
        selfManagementDomainScore = selfManagementDomainScore + s11_6
        selfManagementDomainScoreProject = selfManagementDomainScoreProject + s11_6
    }

    if (s10_1 == null) {
        selfManagementDomainScoreProject = selfManagementDomainScoreProject + 2
        result.missingFields.push('10.1 Difficulties coping')
    } else {
        selfManagementDomainScore = selfManagementDomainScore + s10_1
        selfManagementDomainScoreProject = selfManagementDomainScoreProject + s10_1
    }

    result.selfManagementDomainScore = selfManagementDomainScore < 2 ? 0 : selfManagementDomainScore < 5 ? 1 : 2
    result.selfManagementDomainLevel = result.selfManagementDomainScore == 0 ? 'L' : result.selfManagementDomainScore == 1 ? 'M' : 'H'
    selfManagementDomainScoreProject = selfManagementDomainScoreProject < 2 ? 0 : selfManagementDomainScoreProject < 5 ? 1 : 2

    // PART_RESULT  =  SELF_MANAGEMENT_DOMAIN_SCORE
    result.totalDomainScore = result.sexDomainScore + result.thinkingDomainScore + result.relationshipDomainScore + result.selfManagementDomainScore
    const totalDomainScoreProject = sexDomainProject + thinkingDomainProject + relationshipDomainScoreProject + selfManagementDomainScoreProject
    result.overallNeedLevel = result.totalDomainScore < 3 ? 'L' : result.totalDomainScore < 6 ? 'M' : 'H'
    const overallNeedLevelProject = totalDomainScoreProject < 3 ? 'L' : totalDomainScoreProject < 6 ? 'M' : 'H'

    // RISKS
    const ogrs3RiskRecon = dbAssessment.riskDetails.ogrs3RiskRecon
    const ovpRisk = dbAssessment.riskDetails.ovpRisk

    const after649 = OasysDateTime.checkIfAfterReleaseNode('6.49', dbAssessment.initiationDate)
    const ospCdc = after649 ? dbAssessment.riskDetails.ospDcRisk : dbAssessment.riskDetails.ospCRisk
    const ospIiic = after649 ? dbAssessment.riskDetails.ospIicRisk : dbAssessment.riskDetails.ospIRisk
    const rsrPercentageScore = dbAssessment.riskDetails.rsrPercentageScore

    const rsrRiskLevel: 'L' | 'M' | 'H' = rsrPercentageScore == null ? null
        : rsrPercentageScore >= 3 ? 'H'
            : rsrPercentageScore >= 1 ? 'M'
                : 'L'

    let riskLevelProject = 'O'

    if (ogrs3RiskRecon == null) {
        riskLevelProject = 'H'
        result.missingFields.push('OGRS')
    }
    if (ovpRisk == null) {
        riskLevelProject = 'H'
        result.missingFields.push('OVP')
    }
    if (ospCdc == null) {
        riskLevelProject = 'H'
        result.missingFields.push('OSP-DC')
    }
    if (ospIiic == null) {
        riskLevelProject = 'H'
        result.missingFields.push('OSP-IIC')
    }
    if (ospCdc == 'NA' && ospIiic == 'NA' && rsrRiskLevel == null) {
        riskLevelProject = 'H'
        result.missingFields.push('RSR')
    }

    let saraTrump = false
    if (saraRiskPartner == null) {
        riskLevelProject = 'H'
        saraTrump = true
        result.missingFields.push('SARA risk to partner')
    }
    if (saraRiskOther == null) {
        riskLevelProject = 'H'
        saraTrump = true
        result.missingFields.push('SARA risk to other')
    }

    // Now calculate the risk domain
    if (['H', 'V'].includes(ogrs3RiskRecon) || ['H', 'V'].includes(ovpRisk) || ['H', 'V'].includes(ospCdc) || ospIiic == 'H' ||
        (ospCdc == 'NA' && ospIiic == 'NA' && rsrRiskLevel == 'H') || saraRiskPartner == 3 || saraRiskOther == 3) {
        result.riskLevel = 'H'
        riskLevelProject = 'H'
    } else if (ogrs3RiskRecon == 'M' || ovpRisk == 'M' || ospCdc == 'M' || ospIiic == 'M' || (ospCdc == 'NA' && ospIiic == 'NA' && rsrRiskLevel == 'M') || saraRiskPartner == 2 || saraRiskOther == 2) {
        result.riskLevel = 'M'
    } else {
        result.riskLevel = 'L'
    }

    if (riskLevelProject == 'O') {              // All the risk fields were present so projection not set
        riskLevelProject = result.riskLevel     // Assign projection same as reality
    }

    // Now use Risk Level with Overall Need Level to produce a PNI Calculation
    // Medium or low need with High OGRS + High OVP or High SARA has already been dealt with

    let interimResult = 'A'
    if (result.riskLevel == 'H' && result.overallNeedLevel == 'H') {
        interimResult = 'H'
    } else if (result.overallNeedLevel == 'M' && result.riskLevel == 'H') {
        interimResult = 'M'
    } else if (result.overallNeedLevel == 'H' && result.riskLevel == 'M') {
        interimResult = 'M'
    } else if (result.overallNeedLevel == 'M' && result.riskLevel == 'M') {
        interimResult = 'M'
    } else if (saraRiskPartner > 1 || saraRiskOther > 1) {
        interimResult = 'M'
    }

    let interimResultProject = 'A'
    if (riskLevelProject == 'H' && overallNeedLevelProject == 'H') {
        interimResultProject = 'H'
    } else if (overallNeedLevelProject == 'M' && riskLevelProject == 'H') {
        interimResultProject = 'M'
    } else if (overallNeedLevelProject == 'H' && riskLevelProject == 'M') {
        interimResultProject = 'M'
    } else if (overallNeedLevelProject == 'M' && riskLevelProject == 'M') {
        interimResultProject = 'M'
    } else if (saraRiskPartner > 1 || saraRiskOther > 1) {
        interimResultProject = 'M'
    }

    // Step 3 Output a PNI calculation
    // Check for trumps
    // High OGRS with High OVP or High SARA as this returns High Intensity && it is job done

    let calcComplete = false

    if (['H', 'V'].includes(ogrs3RiskRecon) && (['H', 'V'].includes(ovpRisk) || saraRiskPartner == 3 || saraRiskOther == 3)) {  // They are High OGRS
        result.pniCalculation = community ? 'M' : 'H'
        calcComplete = true
    }

    // High or Medium SARA in community returns moderate intensity && it is job done
    if (!calcComplete && community && (saraRiskPartner > 1 || saraRiskOther > 1)) {
        result.pniCalculation = 'M'
        calcComplete = true
    }

    if (!calcComplete && !community && interimResult == 'H') {
        result.pniCalculation = 'H'
        calcComplete = true
    }
    if (!calcComplete && community && ['M', 'H'].includes(interimResult)) {// Community with Medium or High
        result.pniCalculation = 'M' // Possibly downgrade the result
        calcComplete = true
    }
    if (!calcComplete) {
        // projection is 'A' the missing fields won't increase it
        if (interimResultProject == 'A' && saraRiskPartner != null && saraRiskOther != null) {
            result.pniCalculation = 'A'
            calcComplete = true
        }
    }

    let omission = false

    if (!calcComplete) {    // Not found a PNI
        if (saraTrump && ['A', 'L'].includes(interimResult)) {  // Low interim score but NULL SARA so missing
            omission = true
        } else if (result.overallNeedLevel != overallNeedLevelProject || result.riskLevel != riskLevelProject) {// There is a difference
            omission = true
        }
        // SARA mising && community case with alternative pathway
        if (community && interimResult == 'A' && (saraRiskPartner == null || saraRiskOther == null)) {
            omission = true
        }
    }

    if (omission) {
        result.pniCalculation = 'O'
    } else {
        result.missingFields = null
    }

    if (!calcComplete && !omission) {
        result.pniCalculation = interimResult
    }

    return result
}

type PniCalcResult = {
    sexDomainLevel: string,
    sexDomainScore: number,
    thinkingDomainLevel: string,
    thinkingDomainScore: number,
    relationshipDomainLevel: string,
    relationshipDomainScore: number,
    selfManagementDomainLevel: string,
    selfManagementDomainScore: number,
    totalDomainScore: number,
    overallNeedLevel: string,
    riskLevel: string,
    pniCalculation: string,
    missingFields: string[],
    partResult: string,
}