import { OasysPage, Element } from 'classes'

export class SaraWipTask extends OasysPage {

    name = 'SaraWipTask'
    title = 'Task Description'

    printTask = new Element.Button(this.page, 'Print task')
    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    taskDescription = new Element.Textbox(this.page, '#P1_HDR_TASK_DESCRIPTION')
    surname = new Element.Textbox(this.page, '#P1_OFF_1_FAMILY_NAME')
    statusIcons = new Element.IconContainer('#P1_OFF_1_ICON')
    forename = new Element.Textbox(this.page, '#P1_OFF_1_FORENAME_1')
    dateOfBirth = new Element.Textbox<OasysDate>('#P1_OFF_1_DATE_OF_BIRTH')
    pnc = new Element.Textbox(this.page, '#P1_OFF_1_PNC')
    physicalLocation = new Element.Textbox(this.page, '#P1_OFF_1_PHYSICAL_LOCATION_AREA')
    openOffenderDetails = new Element.Button(this.page, '#P1_OFF_1_BT_OFFENDER_DETAIL')
    assessor = new Element.Textbox(this.page, '#P1_RES_ASSESSOR_NAME')
    openSARA = new Element.Button(this.page, '#P1_SAR_BT_OPEN_SARA')
    dateRaised = new Element.Textbox<OasysDate>('#P1_FTR_DATE_TASK_CREATED')
    reassignToLau = new Element.Select(this.page, '#P1_REA_REASSIGN_LDU')
    reassignToTeam = new Element.Select(this.page, '#P1_REA_REASSIGN_TEAM')
    reassignToUser = new Element.Lov('#P1_REA_REASSIGN_TASK_fieldset')
}
