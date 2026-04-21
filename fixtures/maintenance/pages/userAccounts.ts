import { OasysPage, Element } from 'classes'

export class UserAccounts extends OasysPage {

    name = 'UserAccounts'
    title = 'User Search'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'User Accounts' }

    close = new Element.Button(this.page, 'Close')
    userSearch = new Element.Link(this.page, 'User Search')
    userName = new Element.Textbox(this.page, '#P7_USER_NAME')
    surname = new Element.Textbox(this.page, '#P7_FAMILY_NAME')
    forename1 = new Element.Textbox(this.page, '#P7_FORENAME_1')
    resultsPerPage = new Element.Select(this.page, '#P7_RESULTS_PER_PAGE')
    createAccount = new Element.Button(this.page, 'Create Account')
    search = new Element.Button(this.page, 'Search')
    surnameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Surname')
    userNameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'User Name')
    forename1Column = new Element.Column(this.page, Element.ColumnType.Column, 'Forename 1')
    forename2Column = new Element.Column(this.page, Element.ColumnType.Column, 'Forename 2')
    userStatusColumn = new Element.Column(this.page, Element.ColumnType.Column, 'User Status')
}
