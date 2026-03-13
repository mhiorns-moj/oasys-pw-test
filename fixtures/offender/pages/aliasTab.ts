import { OasysPage, Element } from 'classes'

export class AliasTab extends OasysPage {

    name = 'AliasTab'

    surnameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Surname')
    forename1Column = new Element.Column(this.page, Element.ColumnType.Column, 'Forename 1')
    forename2Column = new Element.Column(this.page, Element.ColumnType.Column, 'Forename 2')
    dateOfBirthColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Date Of Birth')
    addNewAlias = new Element.Button(this.page, 'Add New Alias')
}
