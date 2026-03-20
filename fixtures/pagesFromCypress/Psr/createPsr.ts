import { OasysPage, Element } from 'classes'

export class CreatePsr extends OasysPage {

    name = 'CreatePSR'
    menu: Menu = { type: 'Floating', level1: 'Pre-Sentence Report' }

    dateReportRequested = new Element.Textbox<OasysDate>('#P100_DATE_REPORT_REQUESTED')
    dateReportRequired = new Element.Textbox<OasysDate>('#P100_DATE_REPORT_REQUIRED')
    sentenceDate = new Element.Textbox<OasysDate>('#P100_SENTENCE_DATE')
    proximity = new Element.Select(this.page, '#P100_COURT_PROXIMITY')
    courtName = new Element.Lov(this.page, '#P100_PSR_COURT_LABEL')
    courtType = new Element.Textbox(this.page, '#P100_COURT_TYPE')
    actualCourtName = new Element.Textbox(this.page, '#P100_ACT_COURT_NAME')
    authorType = new Element.Select(this.page, '#P100_COURT_REPORT_AUTHOR_ELM')
    authorsTeam = new Element.Select(this.page, '#P100_TEAM_UK')
    author = new Element.Lov(this.page, '#P100_OASYS_USER_CODE_LABEL')
    offenderTitle = new Element.Select(this.page, '#P100_OFFENDER_TITLE')
    offenderName = new Element.Select(this.page, '#P100_OFFENDER_NAME')
    create = new Element.Button(this.page, 'Create')
}
