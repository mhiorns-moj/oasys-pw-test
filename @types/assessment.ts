/**
 * Assessment types
 * @module Assessment types
 */

declare type AssessmentLayer = 'Basic (Layer 1)' | 'Full (Layer 3)'

declare type PurposeOfAssessment =
    'PSR Addendum' |
    'PSR - SDR' |
    'Deferred Sentence Report' |
    'Risk of Harm Assessment' |
    'RSR and Risk Assessment Only' |
    'Start of Community Order' |
    'Start Licence' |
    'Start of Suspended Sentence Order' |
    'Start custody' |
    'Start licence - YOI' |
    'Transfer in from YOT' |
    'Transfer in from non England / Wales Court' |
    'Fast Review' |
    'Review' |
    'Risk Review' |
    'HDC' |
    'Hostel Assessment' |
    'Parole' |
    'Pre release' |
    'Recall' |
    'ROTL' |
    'Significant Change' |
    'SSO Activated' |
    'Transfer Out' |
    'End of licence' |
    'Termination of Community Supervision' |
    'Non-statutory' |
    'Other' |
    'Re-categorisation to Open Conditions' |
    'Pre-handover' |
    'Impact Cohort Assessment'

declare type YesNoAnswer = 'Yes' | 'No' | ''
declare type YesNoDKAnswer = 'Yes' | 'No' | `Don't Know` | ''
declare type YesNoDkAnswer = 'Yes' | 'No' | `Don't know` | ''
declare type YesNoMissingAnswer = 'Yes' | 'No' | 'Missing' | ''
declare type ProblemsAnswer = '0-No problems' | '1-Some problems' | '2-Significant problems' | ''
declare type ProblemsMissingAnswer = '0-No problems' | '1-Some problems' | '2-Significant problems' | 'Missing' | ''
declare type OasysDate = string | { days?: number, months?: number, years?: number }
declare type Q6_8Answer = 'In a relationship, living together' | 'In a relationship, not living together' | 'Not in a relationship'
declare type DrugsUsage = 'Daily' | 'Weekly' | 'Monthly' | 'Occasional'

declare type CreateAssessmentDetails = {

    purposeOfAssessment: PurposeOfAssessment
    otherPleaseSpecify?: string
    assessmentLayer?: AssessmentLayer
    sentencePlanType?: SpSelectionType
    includeCourtReportTemplate?: string
    includeSanSections?: YesNoAnswer
    selectTeam?: string
    selectAssessor?: string
}

declare type Layer = 'Layer 1' | 'Layer 1V2' | 'Layer 3' | 'Layer 3V2'
declare type RiskLevel = 'Low' | 'Medium' | 'High' | 'Very High' | ''
declare type FrameworkRole = 'Legacy - Unapproved PSO & unapproved PQiP' | 'Legacy - Approved PSO, approved PQiP, NQO or unapproved PO' | 'Legacy - Approved PO' | 'Legacy - SPO' | 'Legacy - Head of PDU' |
    'Unapproved Prison POM & unapproved PQiP' | 'Approved Prison POM, approved PQiP, NQO or unapproved Probation POM' | 'Approved Probation POM' | 'HOMDs'

declare type MenuStatus = { container: boolean, level1: string, level2: string, complete: boolean }

declare type ColumnValues = { name: string, values: string[] }

declare type AssessmentSigning = 'ASS_DEL_RESTORE' |
    'ASSMT_DEL_COUNTERSIGNING' |
    'ASSMT_DEL_REJECTION' |
    'ASSMT_DEL_SIGNING' |
    'AWAITING_SBC' |
    'BCS_DEL_COUNTERSIGNING' |
    'BCS_DEL_RESTORE' |
    'BCS_DEL_SIGNING' |
    'COUNTERSIGNING' |
    'LOCKED_INCOMPLETE' |
    'OFF_DEL_REJECTION' |
    'OFF_DEL_RESTORE' |
    'OFF_DEL_SIGNING' |
    'PART_1_LOCKED_INCOMPLETE' |
    'PART_1_SIGNED' |
    'PART_2_LOCKED_INCOMPLETE' |
    'PART_2_SIGNED' |
    'PSR_ABANDON' |
    'PSR_APPEND' |
    'PSR_COUNTERSIGNING' |
    'PSR_REJECTION' |
    'PSR_REMOVAL' |
    'PSR_ROLLBACK' |
    'PSR_SIGNING' |
    'REJECTION' |
    'ROLLBACK' |
    'SARA_DEL_COUNTERSIGNING' |
    'SARA_DEL_REJECTION' |
    'SARA_DEL_RESTORE' |
    'SARA_DEL_SIGNING' |
    'SARA_LOCKED_INCOMPLETE' |
    'SARA_ROLLBACK' |
    'SARA_SIGNING' |
    'SIGNING' |
    'TRF_GRANT_COUNTERSIGNING' |
    'TRF_GRANT_REJECTION' |
    'TRF_GRANT_SIGNING' |
    'TRF_REQ_COUNTERSIGNING' |
    'TRF_REQ_REJECTION'

declare type PopulateAssessmentParams = {

    layer?: Layer
    maxStrings?: boolean,
    provider?: Provider,
    sentencePlan?: SpType,
    r1_30PrePopulated?: boolean,
    r1_41PrePopulated?: boolean,
    populate6_11?: 'Yes' | 'No',
}

declare type SigningPage = 'basic' | 'isp' | 'rsp' | 'spService' | 'rmp' | 'riskScreening'