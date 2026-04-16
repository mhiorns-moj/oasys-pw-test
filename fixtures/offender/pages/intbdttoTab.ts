import { OasysPage, Element } from 'classes'

export class IntbdttoTab extends OasysPage {

    name = 'IntbdttoTab'

    enterIntbdtto = new Element.Button(this.page, 'Enter INTBDTTO')
    statusColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Status')
    dateColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Date')
    nameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Name')
    notesColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Notes')
}
