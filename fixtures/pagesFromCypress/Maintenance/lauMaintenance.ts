import { OasysPage, Element } from 'classes'

export class LauMaintenance extends OasysPage {

    name = 'LAUMaintenance'
    title = 'LAU Maintenance'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'LAU Details' }

    close = new Element.Button(this.page, 'Close')
    newLau = new Element.Button(this.page, 'New LAU')
    launameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Office Name')
    activeColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Active')
}
