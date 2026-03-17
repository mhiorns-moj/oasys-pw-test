import * as SanElement from 'classes/san/sanElements'
import { BaseSanEditPage } from './baseSanEditPage'

export class InformationSummary extends BaseSanEditPage {

    name = 'InformationSummary'
    title = 'Information summary - Strengths and Needs'

    change = new SanElement.Link('.govuk-link:visible:contains("Change")[0]')
    analysis = new SanElement.Link('Practitioner analysis')
}
