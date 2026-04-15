import { Page } from '@playwright/test'
import { PractitionerAnalysis } from './practitionerAnalysis'
import { Element } from 'classes'

export class DrugsPractitionerAnalysis extends PractitionerAnalysis {

    motivatedToStop = new Element.Radiogroup<'noMotivation' | 'someMotivation' | 'motivated' | 'unknown'>(this.page, '#drugs_practitioner_analysis_motivated_to_stop', ['noMotivation', 'someMotivation', 'motivated', 'unknown'])

    constructor(page: Page) {
        super(page, 'Drug use')
    }
}
