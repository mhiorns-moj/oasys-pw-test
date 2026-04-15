import { Temporal } from '@js-temporal/polyfill'
import { OgrsAssessment } from '../../../cypress/support/ogrs/getTestData/dbClasses'
import { addCalculatedInputParameters, da, dailyDrugUser, getDrugsUsage, getDrugUsed, q141, q22, q4_2Lookup, q88, yesNo1_0Lookup } from 'lib/ogrs/common'
import { lookupString, lookupInteger, yesNoToYNLookup, genderNumberLookup } from 'lib/utils'
import { TestCaseParameters } from './types'

export function createAssessmentTestCase(assessment: OgrsAssessment, offences: {}, versions: {},
    dateParam: string | Temporal.PlainDate = null): TestCaseParameters {

    const after6_30 = oasysDateTime.checkIfAfterRelease('6.30', assessment.initiationDate)
    const after6_35 = oasysDateTime.checkIfAfterRelease('6.35', assessment.initiationDate)

    const drugs = getDrugsUsage(assessment.qaData)
    const q81 = lookupString('8.1', assessment.qaData)

    let staticCalc = 'N'
    if (assessment.type == 'LAYER_1' && assessment.version == 2) {  // RoSHA - set static flag according to 1.39 (offender interview)
        if (lookupString('1.39', assessment.qaData) != 'YES') {
            staticCalc = 'Y'
        }
    }

    let assessmentDate = oasysDateTime.testStartDate
    if (dateParam != null) {
        assessmentDate = typeof dateParam == 'string' ? oasysDateTime.stringToDate(dateParam) : dateParam
    }

    const result = {

        ASSESSMENT_DATE: assessmentDate,
        STATIC_CALC: staticCalc,
        DOB: assessment.dob,
        GENDER: lookupString(assessment.gender, genderNumberLookup),
        OFFENCE_CODE: assessment.offence,
        TOTAL_SANCTIONS_COUNT: lookupInteger('1.32', assessment.qaData),
        TOTAL_VIOLENT_SANCTIONS: lookupInteger('1.40', assessment.qaData),
        CONTACT_ADULT_SANCTIONS: lookupInteger('1.34', assessment.qaData),
        CONTACT_CHILD_SANCTIONS: lookupInteger('1.45', assessment.qaData),
        INDECENT_IMAGE_SANCTIONS: lookupInteger('1.46', assessment.qaData),
        PARAPHILIA_SANCTIONS: lookupInteger('1.37', assessment.qaData),
        STRANGER_VICTIM: lookupString('1.44', assessment.qaData, yesNoToYNLookup),
        AGE_AT_FIRST_SANCTION: lookupInteger('1.8', assessment.qaData),
        LAST_SANCTION_DATE: oasysDateTime.stringToDate(lookupString('1.29', assessment.qaData)),
        DATE_RECENT_SEXUAL_OFFENCE: oasysDateTime.stringToDate(lookupString('1.33', assessment.qaData)),
        CURR_SEX_OFF_MOTIVATION: q141(lookupString('1.30', assessment.qaData), lookupString('1.41', assessment.qaData), assessment.offence, offences),
        MOST_RECENT_OFFENCE: oasysDateTime.stringToDate(lookupString('1.43', assessment.qaData)),
        COMMUNITY_DATE: oasysDateTime.stringToDate(lookupString('1.38', assessment.qaData)),
        ONE_POINT_THIRTY: lookupString('1.30', assessment.qaData, yesNoToYNLookup),
        TWO_POINT_TWO: q22(lookupString('2.2_V2_WEAPON', assessment.qaData), lookupString('2.2', assessment.qaData), after6_35),
        THREE_POINT_FOUR: lookupInteger('3.4', assessment.qaData),
        FOUR_POINT_TWO: lookupInteger('4.2', assessment.qaData, q4_2Lookup),
        SIX_POINT_FOUR: lookupInteger('6.4', assessment.qaData),
        SIX_POINT_SEVEN: da(assessment.qaData, after6_30),
        SIX_POINT_EIGHT: lookupInteger('6.8', assessment.qaData),
        SEVEN_POINT_TWO: lookupInteger('7.2', assessment.qaData),
        DAILY_DRUG_USER: dailyDrugUser(q81, drugs),
        AMPHETAMINES: getDrugUsed('AMPHETAMINES', drugs),
        BENZODIAZIPINES: getDrugUsed('BENZODIAZIPINES', drugs),
        CANNABIS: getDrugUsed('CANNABIS', drugs),
        CRACK_COCAINE: getDrugUsed('CRACK_COCAINE', drugs),
        ECSTASY: getDrugUsed('ECSTASY', drugs),
        HALLUCINOGENS: getDrugUsed('HALLUCINOGENS', drugs),
        HEROIN: getDrugUsed('HEROIN', drugs),
        KETAMINE: getDrugUsed('KETAMINE', drugs),
        METHADONE: getDrugUsed('METHADONE', drugs),
        MISUSED_PRESCRIBED: getDrugUsed('MISUSED_PRESCRIBED', drugs),
        OTHER_DRUGS: getDrugUsed('OTHER_DRUGS', drugs),
        OTHER_OPIATE: getDrugUsed('OTHER_OPIATE', drugs),
        POWDER_COCAINE: getDrugUsed('POWDER_COCAINE', drugs),
        SOLVENTS: getDrugUsed('SOLVENTS', drugs),
        SPICE: getDrugUsed('SPICE', drugs),
        STEROIDS: getDrugUsed('STEROIDS', drugs),
        EIGHT_POINT_EIGHT: q88(q81, lookupInteger('8.8', assessment.qaData)),
        NINE_POINT_ONE: lookupInteger('9.1', assessment.qaData),
        NINE_POINT_TWO: lookupInteger('9.2', assessment.qaData),
        ELEVEN_POINT_TWO: lookupInteger('11.2', assessment.qaData),
        ELEVEN_POINT_FOUR: lookupInteger('11.4', assessment.qaData),
        TWELVE_POINT_ONE: lookupInteger('12.1', assessment.qaData),
        OGRS4G_ALGO_VERSION: 1,
        OGRS4V_ALGO_VERSION: 1,
        OGP2_ALGO_VERSION: 1,
        OVP2_ALGO_VERSION: 1,
        OSP_ALGO_VERSION: 6,
        SNSV_ALGO_VERSION: 1,
        AGGRAVATED_BURGLARY: lookupInteger('R1.2.6.2_V2', assessment.qaData, yesNo1_0Lookup),
        ARSON: lookupInteger('R1.2.7.2_V2', assessment.qaData, yesNo1_0Lookup),
        CRIMINAL_DAMAGE_LIFE: lookupInteger('R1.2.8.2_V2', assessment.qaData, yesNo1_0Lookup),
        FIREARMS: lookupInteger('R1.2.10.2_V2', assessment.qaData, yesNo1_0Lookup),
        GBH: lookupInteger('R1.2.2.2_V2', assessment.qaData, yesNo1_0Lookup),
        HOMICIDE: lookupInteger('R1.2.1.2_V2', assessment.qaData, yesNo1_0Lookup),
        KIDNAP: lookupInteger('R1.2.9.2_V2', assessment.qaData, yesNo1_0Lookup),
        ROBBERY: lookupInteger('R1.2.12.2_V2', assessment.qaData, yesNo1_0Lookup),
        WEAPONS_NOT_FIREARMS: lookupInteger('R1.2.13.2_V2', assessment.qaData, yesNo1_0Lookup),
        CUSTODY_IND: assessment.prisonInd == 'C' ? 'Y' : 'N',
    }

    addCalculatedInputParameters(result, offences)
    return result

}
