import { OasysPage, Element } from 'classes'

export class OffenderSearch extends OasysPage {

    name = 'OffenderSearch'
    title = 'Offender Search'
    menu: Menu = { type: 'Main', level1: 'Search' }

    close = new Element.Button(this.page, 'Close')
    surname = new Element.Textbox(this.page, '#P900_SURNAME')
    forename = new Element.Textbox(this.page, '#P900_FORENAME')
    surnameSoundsLike = new Element.Select(this.page, '#P900_SOUNDSLIKE')
    dateOfBirth = new Element.Textbox<OasysDate>(this.page, '#P900_DOB')
    pnc = new Element.Textbox(this.page, '#P900_PNC')
    provider = new Element.Select(this.page, '#P900_CT_AREA_EST')
    cro = new Element.Textbox(this.page, '#P900_CRO')
    probationCrn = new Element.Textbox(this.page, '#P900_CMS_PROB_NUMBER')
    prisonNomisNumber = new Element.Textbox(this.page, '#P900_CMS_PRIS_NUMBER')
    prisonLidsNumber = new Element.Textbox(this.page, '#P900_PRISON_NUMBER')
    searchCms = new Element.Select(this.page, '#P900_SEARCH_CMS')
    resultsPerPage = new Element.Select(this.page, '#P900_RESULTS_PER_PAGE')
    search = new Element.Button(this.page, 'Search')
    reset = new Element.Button(this.page, 'Reset')
    createOffender = new Element.Button(this.page, 'Create Offender')
    statusColumn = new Element.Column(this.page, Element.ColumnType.ImageColumn, 'Â ')
    surnameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Surname')
    forenameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Forename')
    dateOfBirthColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Date Of Birth')
    pncColumn = new Element.Column(this.page, Element.ColumnType.Column, 'PNC')
    probCaseRefColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Prob Case Ref')
    probationCrnColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Case Reference Number')
    prisonNomisNumberColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Prison NOMIS Number')
    controllingOwnerColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Controlling Owner')
}
