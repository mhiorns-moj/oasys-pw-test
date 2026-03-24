import { OasysPage, Element } from 'classes'

export class CreateAssessment extends OasysPage {

    name = 'CreateAssessment'
    title = 'Create Assessment'

    purposeOfAssessment = new Element.Select<PurposeOfAssessment>(this.page, '#P10_PURPOSE_ASSESSMENT_ELM')
    otherPleaseSpecify = new Element.Textbox(this.page, '#P10_PURPOSE_OF_ASSESS_OTHER')
    assessmentLayer = new Element.Select<AssessmentLayer>(this.page, '#P10_ASSESSMENT_TYPE_ELM')
    sentencePlanType = new Element.Select<'Initial' | 'Review' | 'PSR Outline' | 'Basic' | '-- Select Type --'>(this.page, '#P10_SSP_TYPE_ELM')
    includeCourtReportTemplate = new Element.Select<YesNoAnswer>(this.page, '#P10_COURT_RPT_TEMPLATE')
    selectTeam = new Element.Select(this.page, '#P10_TEAM_UK')
    selectAssessor = new Element.Lov(this.page, '#P10_ASSESSOR_USER_CODE_LABEL')
    includeSanSections = new Element.Select<YesNoAnswer>(this.page, '#P10_INCLUDE_SAN')
    create = new Element.Button(this.page, 'Create')
    cancel = new Element.Button(this.page, 'Cancel')
}
