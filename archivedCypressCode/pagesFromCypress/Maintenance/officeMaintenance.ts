import { OasysPage, Element } from 'classes'

export class OfficeMaintenance extends OasysPage {

    name = 'OfficeMaintenance'
    title = 'Office Maintenance'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Office Details' }

    close = new Element.Button(this.page, 'Close')
    newOffice = new Element.Button(this.page, 'New Office')
    officeNameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Office Name')
    activeColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Active')
}
