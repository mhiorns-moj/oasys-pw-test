import { OasysPage, Element } from 'classes'

export class MergeTask extends OasysPage {

    name = 'MergeTask'
    title = 'Task Description'

    markAsComplete = new Element.Button(this.page, 'Mark as Complete')
    printTask = new Element.Button(this.page, 'Print task')
    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    taskDescription = new Element.Textbox(this.page, '#P1_HDR_TASK_DESCRIPTION')
    offender1Information = new Element.Textbox(this.page, '#P1_OFF_HDR_1_INFORMATION')
    offender1Surname = new Element.Textbox(this.page, '#P1_OFF_1_FAMILY_NAME')
    offender1Forename = new Element.Textbox(this.page, '#P1_OFF_1_FORENAME_1')
    offender1DateOfBirth = new Element.Textbox<OasysDate>('#P1_OFF_1_DATE_OF_BIRTH')
    offender1Pnc = new Element.Textbox(this.page, '#P1_OFF_1_PNC')
    offender1PhysicalLocation = new Element.Textbox(this.page, '#P1_OFF_1_PHYSICAL_LOCATION_AREA')
    offender1OpenOffenderDetails = new Element.Button(this.page, '#P1_OFF_1_BT_OFFENDER_DETAIL')
    offender2Information = new Element.Textbox(this.page, '#P1_OFF_HDR_2_INFORMATION')
    offender2Surname = new Element.Textbox(this.page, '#P1_OFF_2_FAMILY_NAME')
    offender2Forename = new Element.Textbox(this.page, '#P1_OFF_2_FORENAME_1')
    offender2DateOfBirth = new Element.Textbox<OasysDate>('#P1_OFF_2_DATE_OF_BIRTH')
    offender2Pnc = new Element.Textbox(this.page, '#P1_OFF_2_PNC')
    offender2PhysicalLocation = new Element.Textbox(this.page, '#P1_OFF_2_PHYSICAL_LOCATION_AREA')
    offender2OpenOffenderDetails = new Element.Button(this.page, '#P1_OFF_2_BT_OFFENDER_DETAIL')
    dateRaised = new Element.Textbox<OasysDate>('#P1_FTR_DATE_TASK_CREATED')
    dateDue = new Element.Textbox<OasysDate>('#P1_FTR_DATE_TASK_REQUIRED')
    reassignToLau = new Element.Select(this.page, '#P1_REA_REASSIGN_LDU')
    reassignToTeam = new Element.Select(this.page, '#P1_REA_REASSIGN_TEAM')
    reassignToUser = new Element.Select(this.page, '#P1_REA_REASSIGN_TASK_LABEL')
    changePnc = new Element.Button(this.page, '#P1_MBT_CHANGE_PNC')
    denyMerge = new Element.Button(this.page, '#P1_MBT_DENY')
    grantButRetainOwnership = new Element.Button(this.page, '#P1_MBT_GRANT_RETAIN')
    grantButRelinquishOwnership = new Element.Button(this.page, '#P1_MBT_GRANT_RELINQUISH')
}
