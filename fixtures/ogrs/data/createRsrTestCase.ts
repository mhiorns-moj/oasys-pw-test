import { OgrsInputParams } from 'fixtures/ogrs/types'
import { OgrsRsr } from './dbClasses'
import { addCalculatedInputParameters } from './common'

export function createRsrInputParams(rsr: OgrsRsr): OgrsInputParams {

    const p: OgrsInputParams = {
        ASSESSMENT_DATE: oasysDateTime.testStartDate,
        STATIC_CALC: 'N',
        DOB: oasysDateTime.stringToDate(rsr.dob),
        GENDER: lookupValue(rsr.gender, utils.genderNumberLookup),
        OFFENCE_CODE: rsr.offence,
        TOTAL_SANCTIONS_COUNT: rsr.s1_32_total_sanctions,
        TOTAL_VIOLENT_SANCTIONS: rsr.s1_40_violent_sanctions,
        CONTACT_ADULT_SANCTIONS: rsr.s1_34_contact_adult_score,
        CONTACT_CHILD_SANCTIONS: rsr.s1_45_dc_child_score,
        INDECENT_IMAGE_SANCTIONS: rsr.s1_46_iic_child_score,
        PARAPHILIA_SANCTIONS: rsr.s1_37_non_contact_score,
        STRANGER_VICTIM: rsr.s1_44_dc_stranger_victim,
        AGE_AT_FIRST_SANCTION: rsr.s1_8_age_at_first_sanction,
        LAST_SANCTION_DATE: oasysDateTime.stringToDate(rsr.s1_29_date_current_conviction),
        DATE_RECENT_SEXUAL_OFFENCE: oasysDateTime.stringToDate(rsr.s1_33_date_recent_sex_offence),
        CURR_SEX_OFF_MOTIVATION: rsr.s1_41_current_sexual_mot,
        MOST_RECENT_OFFENCE: oasysDateTime.stringToDate(rsr.s1_43_last_offence_date),
        COMMUNITY_DATE: oasysDateTime.stringToDate(rsr.s1_38_community_date),
        ONE_POINT_THIRTY: lookupValue(rsr.s1_30_sexual_element, utils.yesNoToYNLookup),
        TWO_POINT_TWO: getNumericAnswer(rsr.s2_2_weapon),
        THREE_POINT_FOUR: getNumericAnswer(rsr.s3_q4_suitable_accom),
        FOUR_POINT_TWO: getNumericAnswer(rsr.s4_q2_unemployed),
        SIX_POINT_FOUR: getNumericAnswer(rsr.s6_q4_partner_relationship),
        SIX_POINT_SEVEN: da(rsr),
        SIX_POINT_EIGHT: getNumericAnswer(rsr.s6_q8_cur_rel_status),
        SEVEN_POINT_TWO: getNumericAnswer(rsr.s7_q2_reg_activities),
        DAILY_DRUG_USER: 'N',
        AMPHETAMINES: 'N',
        BENZODIAZIPINES: 'N',
        CANNABIS: 'N',
        CRACK_COCAINE: 'N',
        ECSTASY: 'N',
        HALLUCINOGENS: 'N',
        HEROIN: 'N',
        KETAMINE: 'N',
        METHADONE: 'N',
        MISUSED_PRESCRIBED: 'N',
        OTHER_DRUGS: 'N',
        OTHER_OPIATE: 'N',
        POWDER_COCAINE: 'N',
        SOLVENTS: 'N',
        SPICE: 'N',
        STEROIDS: 'N',
        EIGHT_POINT_EIGHT: 0,
        NINE_POINT_ONE: getNumericAnswer(rsr.s9_q1_alcohol),
        NINE_POINT_TWO: getNumericAnswer(rsr.s9_q2_binge_drink),
        ELEVEN_POINT_TWO: getNumericAnswer(rsr.s11_q2_impulsivity),
        ELEVEN_POINT_FOUR: getNumericAnswer(rsr.s11_q4_temper_control),
        TWELVE_POINT_ONE: 0,
        OGRS4G_ALGO_VERSION: 1,
        OGRS4V_ALGO_VERSION: 1,
        OGP2_ALGO_VERSION: 1,
        OVP2_ALGO_VERSION: 1,
        OSP_ALGO_VERSION: 6,
        SNSV_ALGO_VERSION: 1,
        AGGRAVATED_BURGLARY: getNumericAnswer(rsr.r1_2_past_aggr_burglary),
        ARSON: getNumericAnswer(rsr.r1_2_past_arson),
        CRIMINAL_DAMAGE_LIFE: getNumericAnswer(rsr.r1_2_past_cd_life),
        FIREARMS: getNumericAnswer(rsr.r1_2_past_firearm),
        GBH: getNumericAnswer(rsr.r1_2_past_wounding_gbh),
        HOMICIDE: getNumericAnswer(rsr.r1_2_past_murder),
        KIDNAP: getNumericAnswer(rsr.r1_2_past_kidnapping),
        ROBBERY: getNumericAnswer(rsr.r1_2_past_robbery),
        WEAPONS_NOT_FIREARMS: getNumericAnswer(rsr.r1_2_past_weapon),
        CUSTODY_IND: rsr.prison_ind == 'C' ? 'Y' : 'N',
    }

    addCalculatedInputParameters(p)
    return p
}

function getNumericAnswer(value: string): number {

    return !value ? null : value == 'YES' ? 1 : value == 'NO' || value == 'NA' ? 0 : value == 'M' ? null : Number.parseInt(value)
}

function da(rsr: OgrsRsr): number {

    const q67 = getNumericAnswer(rsr.s6_q7_dom_abuse)
    return q67 == 1 ? getNumericAnswer(rsr.s6_q7_perpetrator_partner) : q67
}

function lookupValue(value: string, lookup: { [key: string]: string }): string {

    const result = lookup[value]
    return result == undefined ? value : result
}
