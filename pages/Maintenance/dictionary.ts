import { OasysPage, Element } from 'classes'

export class Dictionary extends OasysPage {

    name = 'Dictionary'
    title = 'Dictionary'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Dictionary' }

    close = new Element.Button(this.page, 'Close')
    searchWord = new Element.Textbox(this.page, '#P7_SEARCH_WORD')
    search = new Element.Button(this.page, 'Search')
    addWord = new Element.Textbox(this.page, '#P7_ADD_WORD')
    addWordButton = new Element.Button(this.page, 'Add Word')
    wordColumn = new Element.Column(this.page, Element.ColumnType.Column, '')
}
