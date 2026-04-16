import { OasysPage, Element } from 'classes'

export class CmsStub extends OasysPage {

    name = 'CmsStub'
    title = 'Training - CMS Stub'
    menu: Menu = { type: 'Main', level1: 'Training', level2: 'CMS Stub' }

    close = new Element.Button(this.page, 'Close')
    surname = new Element.Textbox(this.page, '#P900_SURNAME')
    pnc = new Element.Textbox(this.page, '#P900_PNC')
    probationCrn = new Element.Textbox(this.page, '#P900_CMS_PROB_NUMBER')
    nomisId = new Element.Textbox(this.page, '#P900_NOMIS_ID')
    createStub = new Element.Button(this.page, 'Create Stub')
    search = new Element.Button(this.page, 'Search')
    reset = new Element.Button(this.page, 'Reset')
    surnameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Surname')
    forenameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Forename')
    dateOfBirthColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Date Of Birth')
    pncColumn = new Element.Column(this.page, Element.ColumnType.Column, 'PNC')
    probationCrnColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Case Reference Number')
    prisonNumberColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Prison Number')
    nomisIdColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Nomis Id')
    deleteColumn = new Element.Column(this.page, Element.ColumnType.ButtonColumn, '')
}
