import { OasysPage, Element } from 'classes'

export class ManageAutotext extends OasysPage {

    name = 'ManageAutotext'
    title = 'Manage Auto Text'

    close = new Element.Button(this.page, 'Close')
    autotextType = new Element.Select(this.page, '#P3_AUTOTEXT_TYPE')
    sectionColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Section')
    add = new Element.Button(this.page, 'Add')
}
