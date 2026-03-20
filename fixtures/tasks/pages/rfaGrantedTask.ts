import { OasysPage, Element } from 'classes'

export class RfaGrantedTask extends OasysPage {

    name = 'RfaGrantedTask'
    title = 'Task Description'

    printTask = new Element.Button(this.page, 'Print Task')
    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    taskDescription = new Element.Textbox(this.page, '#P1_HDR_TASK_DESCRIPTION')
    surname = new Element.Textbox(this.page, '#P1_OFF_1_FAMILY_NAME')
    forename = new Element.Textbox(this.page, '#P1_OFF_1_FORENAME_1')
    dateOfBirth = new Element.Textbox<OasysDate>(this.page, '#P1_OFF_1_DATE_OF_BIRTH', true)
    pnc = new Element.Textbox(this.page, '#P1_OFF_1_PNC')
    physicalLocation = new Element.Textbox(this.page, '#P1_OFF_1_PHYSICAL_LOCATION_AREA')
    openOffenderDetails = new Element.Button(this.page, '#P1_OFF_1_BT_OFFENDER_DETAIL')
    rfaExpiry = new Element.Textbox(this.page, '#P1_EXPIRY_PERIOD')
    dateRaised = new Element.Textbox<OasysDate>(this.page, '#P1_FTR_DATE_TASK_CREATED', true)
}
