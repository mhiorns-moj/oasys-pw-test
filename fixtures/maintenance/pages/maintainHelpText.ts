import { OasysPage, Element } from 'classes'

export class MaintainHelpText extends OasysPage {

    name = 'MaintainHelpText'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Help Text' }

    close = new Element.Button(this.page, 'Close')
    helpItemsColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Help Items')
    globalColumn = new Element.Column(this.page, Element.ColumnType.ImageColumn, 'Global')
    localColumn = new Element.Column(this.page, Element.ColumnType.ImageColumn, 'Local')
}
