import { OasysPage, Element } from 'classes'

export class AccreditedProgramme extends OasysPage {

    name = 'AccreditedProgramme'
    menu: Menu = { type: 'Subform', level1: 'New Programme' }

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    programmeAttended = new Element.Select(this.page, '#P4_ACC_PROG_ELM')
    completed = new Element.Select(this.page, '#P4_COMPLETED_IND')
    objectivesAchieved = new Element.Select(this.page, '#P4_PROGRAMME_STATUS_ELM')
    reportAvailable = new Element.Select(this.page, '#P4_REPORT_AVAILABLE_IND')
    delete = new Element.Button(this.page, 'Delete')
    addAnother = new Element.Button(this.page, 'Add Another Accredited Programme')
}
