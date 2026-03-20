import { OasysPage, Element } from 'classes'

export class PsrCountersignatureTask extends OasysPage {

    name = 'PsrCountersignatureTask'
    title = 'Task Description'

    printTask = new Element.Button(this.page, 'Print task')
    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    taskDescription = new Element.Textbox(this.page, '#P1_HDR_TASK_DESCRIPTION')
    surname = new Element.Textbox(this.page, '#P1_OFF_1_FAMILY_NAME')
    forename = new Element.Textbox(this.page, '#P1_OFF_1_FORENAME_1')
    dateOfBirth = new Element.Textbox<OasysDate>(this.page, '#P1_OFF_1_DATE_OF_BIRTH', true)
    pnc = new Element.Textbox(this.page, '#P1_OFF_1_PNC')
    physicalLocation = new Element.Textbox(this.page, '#P1_OFF_1_PHYSICAL_LOCATION_AREA')
    openOffenderDetails = new Element.Button(this.page, '#P1_OFF_1_BT_OFFENDER_DETAIL')
    pSRAssessorName = new Element.Textbox(this.page, '#P1_RES_PSR_ASSESSOR_NAME')
    openAssessment = new Element.Button(this.page, '#P1_ASS_BT_OPEN_ASSESMENT')
    dateRaised = new Element.Textbox<OasysDate>(this.page, '#P1_FTR_DATE_TASK_CREATED', true)
    dateDue = new Element.Textbox<OasysDate>(this.page, '#P1_FTR_DATE_TASK_REQUIRED', true)
    reassignToLau = new Element.Select(this.page, '#P1_REA_REASSIGN_LDU')
    reassignToTeam = new Element.Select(this.page, '#P1_REA_REASSIGN_TEAM')
    reassignToUser = new Element.Lov(this.page, '#P1_REA_REASSIGN_TASK_LABEL')
}
