import * as dbClasses from 'fixtures/api/data/dbClasses'

export class SanCrimNeedScore {

    accomSanScore: number
    empAndEduSanScore: number
    persRelAndCommSanScore: number
    lifeAndAssocSanScore: number
    drugUseSanScore: number
    alcoUseSanScore: number
    thinkBehavAndAttiSanScore: number

    constructor(dbAssessment: dbClasses.DbAssessment) {
        this.accomSanScore = dbAssessment.sections.find((s) => s.sectionCode == '3')?.sanCrimNeedScore
        this.empAndEduSanScore = dbAssessment.sections.find((s) => s.sectionCode == '4')?.sanCrimNeedScore
        this.persRelAndCommSanScore = dbAssessment.sections.find((s) => s.sectionCode == '6')?.sanCrimNeedScore
        this.lifeAndAssocSanScore = dbAssessment.sections.find((s) => s.sectionCode == '7')?.sanCrimNeedScore
        this.drugUseSanScore = dbAssessment.sections.find((s) => s.sectionCode == '8')?.sanCrimNeedScore
        this.alcoUseSanScore = dbAssessment.sections.find((s) => s.sectionCode == '9')?.sanCrimNeedScore
        this.thinkBehavAndAttiSanScore = dbAssessment.sections.find((s) => s.sectionCode == 'SAN')?.sanCrimNeedScore
    }
}

/**
 * Base class for all API endpoints, defining the response data that is common to all.
 * 
 * This module also includes some common utility functions.
 */
export class EndpointResponse {

    source = 'OASys'
    inputs: { [key: string]: any } = {}
    crn: string
    limitedAccessOffender: boolean
    probNumber: string
    'crn-deprecated': string = '** DEPRECATION WARNING ** migrate to probNumber / prisNumber'
    pnc: string
    forename: string
    familyName: string
    gender: number
    custodyInd: string

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        Object.keys(parameters).forEach((key) => {
            if (key != 'endpoint') {
                this.inputs[key] = parameters[key as keyof EndpointParams]
            }
        })
        this.crn = offenderData.probationCrn
        this.probNumber = this.crn
        this.limitedAccessOffender = offenderData.limitedAccessOffender
        this.pnc = offenderData.pnc
        this.forename = offenderData.forename1
        this.familyName = offenderData.surname
        this.gender = offenderData.gender
        this.custodyInd = offenderData.custodyInd
    }

}

export function getSuperStatus(status: string) {

    switch (status) {
        case 'OPEN': return 'WIP'
        case 'COMPLETE': return 'COMPLETE'
        case 'SIGNED': return 'SIGNLOCK'
        case 'LOCKED_INCOMPLETE': return 'PARTCOMP'
        case 'AWAITING_PSR': return 'WIP/SIGNLOCK'
        case 'AWAITING_SBC': return 'WIP/SIGNLOCK'
        default: return status
    }
}

export function riskLabel(risk: string): string {

    switch (risk) {
        case 'L': return 'Low'
        case 'M': return 'Medium'
        case 'H': return 'High'
        case 'V': return 'Very High'
        case 'NA': return 'Not Applicable'
    }
    return risk
}

export function getSectionScore(dbAssessment: dbClasses.DbAssessment, sectionCode: string): number {

    if (dbAssessment.assessmentType != 'LAYER3' || dbAssessment.assessmentVersion != 1) {
        return null
    }
    const section = dbAssessment.sections.filter((s) => s.sectionCode == sectionCode)
    return section.length == 0 ? null : section[0].otherWeightedScore
}

export function fixDp(value: number): number {

    if (value == undefined || value == null) return value
    return Number(value.toFixed(2))
}
