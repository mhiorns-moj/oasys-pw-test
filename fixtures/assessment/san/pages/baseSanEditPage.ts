import { OasysPage, Element } from 'classes'
import * as lib from 'lib'

export class BaseSanEditPage extends OasysPage {

    name = 'BaseSanEditPage'
    idPrefix = ''

    saveAndContinue = new Element.Button(this.page, 'YES')
    previous = new Element.Link(this.page, '.govuk-back-link')
}
