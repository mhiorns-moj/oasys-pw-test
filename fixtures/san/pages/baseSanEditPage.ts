import { OasysPage, Element } from 'classes'

export class BaseSanEditPage extends OasysPage {

    name = 'BaseSanEditPage'
    idPrefix = ''

    saveAndContinue = new Element.Button(this.page, `button[value='YES']`)
    previous = new Element.Link(this.page, '.govuk-back-link')
}
