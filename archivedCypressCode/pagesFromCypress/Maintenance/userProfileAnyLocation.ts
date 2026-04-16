import { OasysPage, Element } from 'classes'

export class UserProfileAnyLocation extends OasysPage {

    name = 'UserProfileAnyLocation'
    title = 'User Search'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'User Profile (Any Location)' }

    close = new Element.Button(this.page, 'Close')
    userName = new Element.Textbox(this.page, '#P7_USER_NAME')
    surname = new Element.Textbox(this.page, '#P7_FAMILY_NAME')
    forename1 = new Element.Textbox(this.page, '#P7_FORENAME_1')
    resultsPerPage = new Element.Select(this.page, '#P7_RESULTS_PER_PAGE')
    search = new Element.Button(this.page, 'Search')
    reset = new Element.Button(this.page, 'Reset')
    userNameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'User Name')
    surnameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Surname')
    forename1Column = new Element.Column(this.page, Element.ColumnType.Column, 'Forename 1')
    forename2Column = new Element.Column(this.page, Element.ColumnType.Column, 'Forename 2')
    userStatusColumn = new Element.Column(this.page, Element.ColumnType.Column, 'User Status')
}
