import { OasysPage, Element } from 'classes'

export class RequestTransfer extends OasysPage {

    name = 'RequestTransfer'
    title = 'Request Transfer'

    submit = new Element.Button(this.page, 'Submit')
    cancel = new Element.Button(this.page, 'Cancel')
    offenderSurname = new Element.Textbox(this.page, '#P10_FAMILY_NAME')
    probationOwner = new Element.Textbox(this.page, '#P10_OWNING_PROBATION_AREA')
    pnc = new Element.Textbox(this.page, '#P10_PNC')
    forenames = new Element.Textbox(this.page, '#P10_FORENAMES')
    prisonOwner = new Element.Textbox(this.page, '#P10_OWNING_PRISON_AREA')
    probationCrn = new Element.Textbox(this.page, '#P10_PROBATION_CRN')
    dateOfBirth = new Element.Textbox<OasysDate>(this.page, '#P10_DATE_OF_BIRTH')
    omFlag = new Element.Textbox(this.page, '#P10_OFFENDER_MANAGED')
    offenderManagerTeam = new Element.Select(this.page, '#P10_OFF_MGR_TEAM')
    offenderManager = new Element.Lov(this.page, '#P10_OFF_MGR_USER_LABEL')
    selectAdditionalTeams = new Element.Shuttle(this.page, '#shuttleTRF010_ADD_TEAMS')
    requestorComments = new Element.Textbox(this.page, '#P10_REQUESTOR_COMMENTS')
}
