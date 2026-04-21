import { Temporal } from '@js-temporal/polyfill'

export class RescoringOffenderWithAssessment {

    offenderPk: number
    assessment: RescoringAssessment

    dbElapsedTime: number

    constructor(assessmentData: string[]) {
        this.assessment = new RescoringAssessment(assessmentData)
    }

    addOffenderPk() {


    }

    offenderPkQuery(): string {
        return `select g.offender_pk from eor.oasys_assessment_group g, eor.oasys_set s
                where s.oasys_set_pk = ${this.assessment.pk}
                and g.oasys_assessment_group_pk = s.oasys_assessment_group_pk`
    }

    getOldPredictors(): string {

        const predictorValues: string[] = []
        predictorValues.push(this.assessment.rsrRisk)
        predictorValues.push(this.assessment.rsrStaticOrDynamic)
        predictorValues.push(this.assessment.rsrPercentageScore?.toString())
        predictorValues.push(this.assessment.ospDirectContactScoreLevel)
        predictorValues.push(this.assessment.ospDirectContactPercentageScore?.toString())
        predictorValues.push(this.assessment.ospIndirectImagesChildrenScoreLevel)
        predictorValues.push(this.assessment.ospIndirectImagesChildrenPercentageScore?.toString())
        predictorValues.push(this.assessment.ogrs3RiskRecon)
        // predictorValues.push(this.assessment.ogrs32Year?.toString())
        predictorValues.push(this.assessment.ogpRisk)
        // predictorValues.push(this.assessment.ogp2Year?.toString())
        predictorValues.push(this.assessment.ovpRisk)
        // predictorValues.push(this.assessment.ovp2Year?.toString())
        return predictorValues.join()
    }
}

export class RescoringAssessment {

    appVersion: string

    pk: number
    probationCrn: string
    nomisId: string
    type: string
    version: number
    status: string
    purpose: string
    purposeOther: string
    initiationDate: Temporal.PlainDateTime
    completedDate: string
    gender: string
    prisonInd: string
    dob: string
    roshLevel: string
    ogrs31Year: number
    ogrs32Year: number
    ogrs3RiskRecon: string
    ogpStWesc: number
    ogpDyWesc: number
    ogpTotWesc: number
    ogp1Year: number
    ogp2Year: number
    ogpRisk: string
    ovpStWesc: number
    ovpDyWesc: number
    ovpTotWesc: number
    ovp1Year: number
    ovp2Year: number
    ovpRisk: string
    ovpPrevWesc: number
    ovpNonVioWesc: number
    ovpAgeWesc: number
    ovpVioWesc: number
    ovpSexWesc: number
    rsrStaticOrDynamic: string
    rsrPercentageScore: number
    rsrRisk: string
    ospImagePercentageScore: number
    ospContactPercentageScore: number
    ospImageScoreLevel: string
    ospContactScoreLevel: string
    ospIndirectImagesChildrenScoreLevel: string
    ospIndirectImagesChildrenPercentageScore: number
    ospDirectContactScoreLevel: string
    ospDirectContactPercentageScore: number

    offence: string
    qaData: string[][]
    textData: string[][]

    constructor(assessmentData: string[]) {

        let i = 0

        this.pk = getDbInt(assessmentData[i++])
        this.probationCrn = assessmentData[i++]
        this.nomisId = assessmentData[i++]
        this.type = assessmentData[i++]
        this.version = getDbInt(assessmentData[i++])
        this.status = assessmentData[i++]
        this.purpose = assessmentData[i++]
        this.purposeOther = assessmentData[i++]
        this.initiationDate = oasysDateTime.stringToTimestamp(assessmentData[i++])
        this.completedDate = assessmentData[i++]
        this.gender = assessmentData[i++]
        this.prisonInd = assessmentData[i++]
        this.dob = assessmentData[i++]
        this.roshLevel = assessmentData[i++]
        this.ogrs31Year = getDbInt(assessmentData[i++])
        this.ogrs32Year = getDbInt(assessmentData[i++])
        this.ogrs3RiskRecon = assessmentData[i++]
        this.ogpStWesc = getDbInt(assessmentData[i++])
        this.ogpDyWesc = getDbInt(assessmentData[i++])
        this.ogpTotWesc = getDbInt(assessmentData[i++])
        this.ogp1Year = getDbInt(assessmentData[i++])
        this.ogp2Year = getDbInt(assessmentData[i++])
        this.ogpRisk = assessmentData[i++]
        this.ovpStWesc = getDbInt(assessmentData[i++])
        this.ovpDyWesc = getDbInt(assessmentData[i++])
        this.ovpTotWesc = getDbInt(assessmentData[i++])
        this.ovp1Year = getDbInt(assessmentData[i++])
        this.ovp2Year = getDbInt(assessmentData[i++])
        this.ovpRisk = assessmentData[i++]
        this.ovpPrevWesc = getDbInt(assessmentData[i++])
        this.ovpNonVioWesc = getDbInt(assessmentData[i++])
        this.ovpAgeWesc = getDbInt(assessmentData[i++])
        this.ovpVioWesc = getDbInt(assessmentData[i++])
        this.ovpSexWesc = getDbInt(assessmentData[i++])
        this.rsrStaticOrDynamic = assessmentData[i++]
        this.rsrPercentageScore = getDbFloat(assessmentData[i++])
        this.rsrRisk = assessmentData[i++]
        this.ospImagePercentageScore = getDbFloat(assessmentData[i++])
        this.ospContactPercentageScore = getDbFloat(assessmentData[i++])
        this.ospImageScoreLevel = assessmentData[i++]
        this.ospContactScoreLevel = assessmentData[i++]
        this.ospIndirectImagesChildrenScoreLevel = assessmentData[i++]
        this.ospIndirectImagesChildrenPercentageScore = getDbFloat(assessmentData[i++])
        this.ospDirectContactScoreLevel = assessmentData[i++]
        this.ospDirectContactPercentageScore = getDbFloat(assessmentData[i++])
    }

    static query(crnSource: Provider, crn: string, includeLayer1: boolean): string {

        const typeWhere = includeLayer1 ? `s.assessment_type_elm in ('LAYER_1', 'LAYER_3')` : `s.assessment_type_elm = 'LAYER_3'`

        return `select s.oasys_set_pk, s.cms_prob_number, s.cms_pris_number, 
                    s.assessment_type_elm, s.version_number, s.assessment_status_elm, s.purpose_assessment_elm, s.purpose_assmt_other_ftxt,
                    to_char(s.initiation_date, '${oasysDateTime.oracleTimestampFormat}'), 
                    to_char(s.date_completed, '${oasysDateTime.dateFormat}'), 
                    s.gender_elm, s.prison_ind, to_char(s.date_of_birth, '${oasysDateTime.dateFormat}'),
                    s.rosh_level_elm, 
                    s.ogrs3_1year, s.ogrs3_2year, s.ogrs3_risk_recon_elm, 
                    s.ogp_st_wesc, s.ogp_dy_wesc, s.ogp_tot_wesc, s.ogp_1year, s.ogp_2year, s.ogp_risk_recon_elm, 
                    s.ovp_st_wesc, s.ovp_dy_wesc, s.ovp_tot_wesc, s.ovp_1year, s.ovp_2year, s.ovp_risk_recon_elm, 
                    s.ovp_prev_wesc, s.ovp_non_vio_wesc, s.ovp_age_wesc, s.ovp_vio_wesc, s.ovp_sex_wesc, 
                    s.rsr_static_or_dynamic, s.rsr_percentage_score, s.rsr_risk_recon_elm, 
                    s.osp_i_percentage_score, s.osp_c_percentage_score, s.osp_i_risk_recon_elm, s.osp_c_risk_recon_elm, 
                    s.osp_iic_risk_recon_elm, s.osp_iic_percentage_score, s.osp_dc_risk_recon_elm, s.osp_dc_percentage_score     
                    from eor.oasys_set s
                    where ${crnSource == 'prob' ? 's.cms_prob_number' : 's.cms_pris_number'} = '${crn}'
                    and s.assessment_status_elm = 'COMPLETE' 
                    and s.deleted_date is null
                    and ${typeWhere} 
                    order by s.initiation_date desc fetch first 1 rows only`
    }

    static offenceQuery(assessmentPk: number): string {

        return `select p.offence_group_code || p.sub_code 
                    from eor.offence_block o, eor.ct_offence_pivot p
                    where o.oasys_set_pk = ${assessmentPk} and o.offence_block_type_elm = 'CURRENT'
                    and p.offence_block_pk = o.offence_block_pk and p.additional_offence_ind = 'N'`
    }

    static qaQuery(assessmentPk: number): string {

        return `select q.ref_section_code, q.ref_question_code, a.ref_answer_code
                    from eor.oasys_set st
                    left outer join eor.oasys_section s
                    on s.oasys_set_pk = st.oasys_set_pk
                    left outer join eor.oasys_question q
                    on q.oasys_section_pk = s.oasys_section_pk
                    left outer join eor.oasys_answer a
                    on a.oasys_question_pk = q.oasys_question_pk
                    where st.oasys_set_pk = ${assessmentPk}
                    and s.ref_section_code in ('1','2','3','4','6','7','8','9','11','12','ROSH','RSR')
                    and q.currently_hidden_ind = 'N'`
    }

    static textAnswerQuery(assessmentPk: number): string {

        return `select q.ref_section_code, q.ref_question_code, q.free_format_answer, q.additional_note
                    from eor.oasys_set st
                    left outer join eor.oasys_section s
                    on s.oasys_set_pk = st.oasys_set_pk
                    left outer join eor.oasys_question q
                    on q.oasys_section_pk = s.oasys_section_pk
                    where st.oasys_set_pk = ${assessmentPk}
                    and s.ref_section_code = '1'
                    and q.currently_hidden_ind = 'N'`
    }
}


function getDbInt(dbValue: string): number {
    return Number.isNaN(Number.parseInt(dbValue)) ? null : Number.parseInt(dbValue)
}

function getDbFloat(dbValue: string): number {
    return Number.isNaN(Number.parseFloat(dbValue)) ? null : Number.parseFloat(dbValue)
}