import { OasysPage, Element } from 'classes'

export class MaintainAutotext extends OasysPage {

    name = 'MaintainAutotext'
    title = 'Maintain Auto Text'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Auto Text' }

    close = new Element.Button(this.page, 'Close')
    autotextSelect = new Element.Select(this.page, '#P2_MENU_ITEM')
    sectionColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Section')
    itemColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Item')
    globalColumn = new Element.Column(this.page, Element.ColumnType.ImageColumn, 'Global')
    personalColumn = new Element.Column(this.page, Element.ColumnType.ImageColumn, 'Personal')
}
