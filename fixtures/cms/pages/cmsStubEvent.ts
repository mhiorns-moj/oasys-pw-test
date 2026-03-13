import { OasysPage, Element } from 'classes'

export class CmsStubEvent extends OasysPage {

    name = 'CMSStubEvent'
    title = 'Training - CMS Stub'

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    sentenceType = new Element.Select(this.page, '#P200_SENTENCE_CODE')
    sentenceDate = new Element.Textbox<OasysDate>(this.page, '#P200_SENTENCE_DATE')
    sentenceMonths = new Element.Textbox(this.page, '#P200_SENTENCE_LENGTH')
    sentenceHours = new Element.Textbox(this.page, '#P200_COMBINED_LENGTH')
    releaseType = new Element.Select(this.page, '#P200_RELEASE_TYPE_ELM')
    releaseDate = new Element.Textbox<OasysDate>(this.page, '#P200_RELEASE_DATE')
    court = new Element.Select(this.page, '#P200_COURT_CODE')
    courtType = new Element.Textbox(this.page, '#P200_COURT_TYPE_DESC')
    licenceCondition = new Element.Textbox(this.page, '#P200_LICENCE')
    offences = new Element.Link(this.page, 'Offences')
    sentenceDetail = new Element.Link(this.page, 'Sentence Detail')
    createSentenceDetail = new Element.Button(this.page, 'Create')
    sentenceDetailCategoryColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Category')
    sentenceDetailTypeColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Sentence Detail Type')
    sentenceDetailDisplayOrderColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Display Order')
    sentenceDetailDeleteColumn = new Element.Column(this.page, Element.ColumnType.ButtonColumn, '')
    createOffence = new Element.Button(this.page, 'Create')
    offenceColumn = new Element.Column(this.page, Element.ColumnType.Column, '')
    offenceDescriptionColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Offence Group')
    subcodeColumn = new Element.Column(this.page, Element.ColumnType.Column, '')
    subcodeDescriptionColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Sub Offence')
    additionalOffenceColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Additional Offence')
    deleteColumn = new Element.Column(this.page, Element.ColumnType.ButtonColumn, 'Delete')

}
