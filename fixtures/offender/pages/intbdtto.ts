import { OasysPage, Element } from 'classes'

export class Intbdtto extends OasysPage {

    name = 'Intbdtto'
    title = 'Information not to be disclosed to the Offender'

    print = new Element.Button(this.page, 'Print')
    delete = new Element.Button(this.page, 'Delete')
    confirmDelete = new Element.Button(this.page, 'Confirm Delete')
    markAsSuperseded = new Element.Button(this.page, 'Mark As Superseded')
    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    userDetails = new Element.Text(this.page, '#P50_NDS_NAME_DISPLAY')
    informationNotesEntry = new Element.Textbox(this.page, '#P50_INFO_WITHHELD_OFFDR')
    informationNotesDisplay = new Element.Text(this.page, '#P50_INFO_WITHHELD_OFFDR_DISPLAY')
    supersededNotesEntry = new Element.Textbox(this.page, '#P50_OBSOLETED_REASON')
    supersededNotesDisplay = new Element.Text(this.page, '#P50_OBSOLETED_REASON_DISPLAY')
    supersededUserDetails = new Element.Text(this.page, '#P50_NDS_SUPERSEDE_NAME_DISPLAY')
    deletionReason = new Element.Textbox(this.page, '#P50_DELETION_REASON')
}
