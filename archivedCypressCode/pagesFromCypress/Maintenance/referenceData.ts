import { OasysPage, Element } from 'classes'

export class ReferenceData extends OasysPage {

    name = 'ReferenceData'
    title = 'Core Reference Data Maintenance'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Reference Data' }

    referenceCategory = new Element.Select(this.page, '#P7_REF_CATEGORY')
    codeColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Code')
    close = new Element.Button(this.page, 'Close')
}
