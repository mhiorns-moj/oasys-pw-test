import { Temporal } from '@js-temporal/polyfill'

export class OgrsRsr {

    pk: number
    status: string
    dob: string
    gender: string
    offence: string
    s1_32_total_sanctions: number
    s1_40_violent_sanctions: number
    s1_34_contact_adult_score: number
    s1_45_dc_child_score: number
    s1_46_iic_child_score: number
    s1_37_non_contact_score: number
    s1_44_dc_stranger_victim: string
    s1_8_age_at_first_sanction: number
    s1_29_date_current_conviction: string
    s1_33_date_recent_sex_offence: string
    s1_41_current_sexual_mot: string
    s1_43_last_offence_date: string
    s1_38_community_date: string
    s1_30_sexual_element: string
    s2_2_weapon: string
    s3_q4_suitable_accom: string
    s4_q2_unemployed: string
    s6_q4_partner_relationship: string
    s6_q7_dom_abuse: string
    s6_q7_perpetrator_partner: string
    s6_q8_cur_rel_status: string
    s7_q2_reg_activities: string
    s8_q1_drugs_misused: string
    amphetamines_curr_use: string
    benzodiazipines_curr_use: string
    cannabis_curr_use: string
    crack_cocaine_curr_use: string
    ecstasy_curr_use: string
    hallucinogens_curr_use: string
    heroin_curr_use: string
    ketamine_curr_use: string
    methadone_curr_use: string
    misused_prescribed_curr_use: string
    other_curr_use: string
    other_opiate_curr_use: string
    cocaine_hydrochloride_curr_use: string
    solvents_curr_use: string
    spice_curr_use: string
    steriods_curr_use: string
    s8_q8_motiv_drug_misuse: string
    s9_q1_alcohol: string
    s9_q2_binge_drink: string
    s11_q2_impulsivity: string
    s11_q4_temper_control: string
    s12_q1_pro_criminal: string
    r1_2_past_aggr_burglary: string
    r1_2_past_arson: string
    r1_2_past_cd_life: string
    r1_2_past_firearm: string
    r1_2_past_wounding_gbh: string
    r1_2_past_murder: string
    r1_2_past_kidnapping: string
    r1_2_past_robbery: string
    r1_2_past_weapon: string
    prison_ind: string

    constructor(rsrData: string[]) {

        let i = 0
        this.pk = Number.parseInt(rsrData[i++])
        this.status = rsrData[i++]
        this.dob = rsrData[i++]
        this.gender = rsrData[i++]
        this.offence = rsrData[i++]
        this.s1_32_total_sanctions = Number.parseInt(rsrData[i++]) || null
        this.s1_40_violent_sanctions = Number.parseInt(rsrData[i++]) || null
        this.s1_34_contact_adult_score = Number.parseInt(rsrData[i++]) || null
        this.s1_45_dc_child_score = Number.parseInt(rsrData[i++]) || null
        this.s1_46_iic_child_score = Number.parseInt(rsrData[i++]) || null
        this.s1_37_non_contact_score = Number.parseInt(rsrData[i++]) || null
        this.s1_44_dc_stranger_victim = rsrData[i++]
        this.s1_8_age_at_first_sanction = Number.parseInt(rsrData[i++]) || null
        this.s1_29_date_current_conviction = rsrData[i++]
        this.s1_33_date_recent_sex_offence = rsrData[i++]
        this.s1_41_current_sexual_mot = rsrData[i++]
        this.s1_43_last_offence_date = rsrData[i++]
        this.s1_38_community_date = rsrData[i++]
        this.s1_30_sexual_element = rsrData[i++]
        this.s2_2_weapon = rsrData[i++]
        this.s3_q4_suitable_accom = rsrData[i++]
        this.s4_q2_unemployed = rsrData[i++]
        this.s6_q4_partner_relationship = rsrData[i++]
        this.s6_q7_dom_abuse = rsrData[i++]
        this.s6_q7_perpetrator_partner = rsrData[i++]
        // this.s6_q8_cur_rel_status = rsrData[i++]
        // this.s7_q2_reg_activities = rsrData[i++]
        // this.s8_q1_drugs_misused = rsrData[i++]
        // this.amphetamines_curr_use = rsrData[i++]
        // this.benzodiazipines_curr_use = rsrData[i++]
        // this.cannabis_curr_use = rsrData[i++]
        // this.crack_cocaine_curr_use = rsrData[i++]
        // this.ecstasy_curr_use = rsrData[i++]
        // this.hallucinogens_curr_use = rsrData[i++]
        // this.heroin_curr_use = rsrData[i++]
        // this.ketamine_curr_use = rsrData[i++]
        // this.methadone_curr_use = rsrData[i++]
        // this.misused_prescribed_curr_use = rsrData[i++]
        // this.other_curr_use = rsrData[i++]
        // this.other_opiate_curr_use = rsrData[i++]
        // this.cocaine_hydrochloride_curr_use = rsrData[i++]
        // this.solvents_curr_use = rsrData[i++]
        // this.spice_curr_use = rsrData[i++]
        // this.steriods_curr_use = rsrData[i++]
        // this.s8_q8_motiv_drug_misuse = rsrData[i++]
        this.s9_q1_alcohol = rsrData[i++]
        this.s9_q2_binge_drink = rsrData[i++]
        this.s11_q2_impulsivity = rsrData[i++]
        this.s11_q4_temper_control = rsrData[i++]
        this.s12_q1_pro_criminal = rsrData[i++]
        this.r1_2_past_aggr_burglary = rsrData[i++]
        this.r1_2_past_arson = rsrData[i++]
        this.r1_2_past_cd_life = rsrData[i++]
        this.r1_2_past_firearm = rsrData[i++]
        this.r1_2_past_wounding_gbh = rsrData[i++]
        this.r1_2_past_murder = rsrData[i++]
        this.r1_2_past_kidnapping = rsrData[i++]
        this.r1_2_past_robbery = rsrData[i++]
        this.r1_2_past_weapon = rsrData[i++]
        this.prison_ind = rsrData[i++]
    }

    static query(rows: number, whereClause: string): string {
        // TODO add drugs details.  Use query builder from API code?

        return `select offender_rsr_scores_pk, rsr_status,
                    to_char(date_of_birth, '${oasysDateTime.dateFormat}'), gender_elm, offence_code || offence_subcode,
                    s1_32_total_sanctions, s1_40_violent_sanctions, 
                    s1_34_contact_adult_score, s1_45_dc_child_score, s1_46_iic_child_score, s1_37_non_contact_score,

                    s1_44_dc_stranger_victim, s1_8_age_at_first_sanction, to_char(s1_29_date_current_conviction, '${oasysDateTime.dateFormat}'), 
                    to_char(s1_33_date_recent_sex_offence, '${oasysDateTime.dateFormat}'), s1_41_current_sexual_mot, 
                    to_char(s1_43_last_offence_date, '${oasysDateTime.dateFormat}'), to_char(s1_38_community_date, '${oasysDateTime.dateFormat}'), s1_30_sexual_element, 
                    s2_2_weapon, s3_q4_suitable_accom, s4_q2_unemployed, s6_q4_partner_relationship, 
                    s6_q7_dom_abuse, s6_q7_perpetrator_partner,  
                    s9_q1_alcohol, s9_q2_binge_drink, s11_q2_impulsivity, s11_q4_temper_control, 
                    s12_q1_pro_criminal, r1_2_past_aggr_burglary, r1_2_past_arson, r1_2_past_cd_life, r1_2_past_firearm, 
                    r1_2_past_wounding_gbh, r1_2_past_murder, r1_2_past_kidnapping, r1_2_past_robbery, r1_2_past_weapon, prison_ind
                    
                    from eor.offender_rsr_scores
                    where ${whereClause}
                    order by initiation_date desc fetch first ${rows} rows only`
    }
}

export class OgrsAssessment {

    pk: number
    type: string
    version: number
    status: string
    initiationDate: Temporal.PlainDateTime
    signedDate: Temporal.PlainDate
    dob: Temporal.PlainDate
    gender: string
    prisonInd: string

    ogrs4gYr2: number
    ogrs4gBand: string
    ogrs4gCalculated: string
    ogrs4vYr2: number
    ogrs4vBand: string
    ogrs4vCalculated: string
    ogp2Yr2: number
    ogp2Band: string
    ogp2Calculated: string
    ovp2Yr2: number
    ovp2Band: string
    ovp2Calculated: string
    snsvStaticYr2: number
    snsvStaticYr2Band: string
    snsvStaticCalculated: string
    snsvDynamicYr2: number
    snsvDynamicYr2Band: string
    snsvDynamicCalculated: string

    offence: string
    qaData: { [key: string]: any }

    constructor(assessmentData: string[]) {

        let i = 0
        this.pk = utils.stringToInt(assessmentData[i++])
        this.type = assessmentData[i++]
        this.version = utils.stringToInt(assessmentData[i++])
        this.status = assessmentData[i++]
        this.initiationDate = oasysDateTime.stringToTimestamp(assessmentData[i++])
        this.signedDate = oasysDateTime.stringToDate(assessmentData[i++])
        this.dob = oasysDateTime.stringToDate(assessmentData[i++])
        this.gender = assessmentData[i++]
        this.prisonInd = assessmentData[i++]

        this.ogrs4gYr2 = utils.stringToFloat(assessmentData[i++])
        this.ogrs4gBand = assessmentData[i++]
        this.ogrs4gCalculated = assessmentData[i++]
        this.ogrs4vYr2 = utils.stringToFloat(assessmentData[i++])
        this.ogrs4vBand = assessmentData[i++]
        this.ogrs4vCalculated = assessmentData[i++]
        this.ogp2Yr2 = utils.stringToFloat(assessmentData[i++])
        this.ogp2Band = assessmentData[i++]
        this.ogp2Calculated = assessmentData[i++]
        this.ovp2Yr2 = utils.stringToFloat(assessmentData[i++])
        this.ovp2Band = assessmentData[i++]
        this.ovp2Calculated = assessmentData[i++]
        this.snsvStaticYr2 = utils.stringToFloat(assessmentData[i++])
        this.snsvStaticYr2Band = assessmentData[i++]
        this.snsvStaticCalculated = assessmentData[i++]
        this.snsvDynamicYr2 = utils.stringToFloat(assessmentData[i++])
        this.snsvDynamicYr2Band = assessmentData[i++]
        this.snsvDynamicCalculated = assessmentData[i++]
    }

    static query(rows: number, whereClause: string): string {

        return `select oasys_set_pk, assessment_type_elm, version_number, assessment_status_elm, 
                        to_char(initiation_date, '${oasysDateTime.oracleTimestampFormat}'), to_char(assessor_signed_date, '${oasysDateTime.dateFormat}'),
                        to_char(date_of_birth, '${oasysDateTime.dateFormat}'), gender_elm, prison_ind,
                        ogrs4g_percentage_2yr, ogrs4g_band_risk_recon_elm, ogrs4g_calculated, 
                        ogrs4v_percentage_2yr, ogrs4v_band_risk_recon_elm, ogrs4v_calculated, 
                        ogp2_percentage_2yr, ogp2_band_risk_recon_elm, ogp2_calculated, 
                        ovp2_percentage_2yr, ovp2_band_risk_recon_elm, ovp2_calculated, 
                        snsv_percentage_2yr_static, snsv_stat_band_risk_recon_elm, snsv_calculated_static, 
                        snsv_percentage_2yr_dynamic, snsv_dyn_band_risk_recon_elm, snsv_calculated_dynamic
                    from eor.oasys_set 
                    where ${whereClause}
                    order by create_date desc fetch first ${rows} rows only`
    }

    static offenceQuery(assessmentPk: number | string): string {

        return `select p.offence_group_code || p.sub_code 
                    from eor.offence_block o, eor.ct_offence_pivot p
                    where o.oasys_set_pk = ${assessmentPk} and o.offence_block_type_elm = 'CURRENT'
                    and p.offence_block_pk = o.offence_block_pk and p.additional_offence_ind = 'N'`
    }

    static qaQuery(assessmentPk: number | string): string {

        return `SELECT REF_QUESTION_CODE, ANSWER
                    FROM
                    (
                    SELECT OQ.REF_QUESTION_CODE, DECODE(OQ.FREE_FORMAT_ANSWER,null,OA.REF_ANSWER_CODE,OQ.FREE_FORMAT_ANSWER) ANSWER
                    FROM EOR.OASYS_SET OS
                    LEFT OUTER JOIN EOR.OASYS_SECTION OSEC
                    ON OSEC.OASYS_SET_PK = OS.OASYS_SET_PK
                    LEFT OUTER JOIN EOR.OASYS_QUESTION OQ
                    ON OQ.OASYS_SECTION_PK = OSEC.OASYS_SECTION_PK
                    LEFT OUTER JOIN EOR.OASYS_ANSWER OA
                    ON OA.OASYS_QUESTION_PK = OQ.OASYS_QUESTION_PK
                    WHERE OS.OASYS_SET_PK = ${assessmentPk}
                    AND OQ.CURRENTLY_HIDDEN_IND = 'N'
                    AND OQ.REF_QUESTION_CODE IN ('1.39','1.32','1.40','1.34','1.45','1.46','1.37','1.44','1.8','1.29','1.33','1.38','1.41','1.43','1.30',
                                                '2.2_V2_WEAPON', '2.2',
                                                '3.4',
                                                '4.2',
                                                '6.4','6.7da','6.7.2.1da','6.7','6.7.1','6.8',
                                                '7.2',
                                                '8.1','8.2.8.1','8.2.7.1','8.2.11.1','8.2.4.1','8.2.10.1','8.2.9.1','8.2.1.1','8.2.16.1','8.2.2.1',
                                                '8.2.6.1','8.2.3.1','8.2.5.1','8.2.12.1','8.2.15.1','8.2.13.1','8.2.14.1',
                                                '8.8',
                                                '9.1','9.2',
                                                '11.2','11.4',
                                                '12.1',
                                                'R1.2.6.2_V2','R1.2.7.2_V2','R1.2.8.2_V2','R1.2.10.2_V2','R1.2.2.2_V2','R1.2.1.2_V2','R1.2.9.2_V2',
                                                'R1.2.12.2_V2','R1.2.13.2_V2' )
                    ) `
    }
}
