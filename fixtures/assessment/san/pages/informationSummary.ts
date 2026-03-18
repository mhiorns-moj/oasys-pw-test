import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'

export class InformationSummary extends BaseSanEditPage {

    name = 'InformationSummary'
    title = 'Information summary - Strengths and Needs'

    change = new Element.Link(this.page, '.govuk-link:visible:contains("Change")[0]')
    analysis = new Element.Link(this.page, 'Practitioner analysis')
}
