import { OasysPage, Element } from 'classes'

export class CmsSearchResults extends OasysPage {

    name = 'CmsSearchResults'
    title = 'CMS Search Results'

    close = new Element.Button(this.page, 'Close')
    probationCrnColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Case Reference Number')
    cmsEventNumberColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Event Number')
    surnameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Surname')
    forename1Column = new Element.Column(this.page, Element.ColumnType.Column, 'Forename 1')
    genderColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Gender')
    dateOfBirthColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Date Of Birth')
    sentenceDateColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Sentence Date')
    sentenceColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Sentence')
}
