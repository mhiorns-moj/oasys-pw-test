import { PractitionerAnalysis } from '../practitionerAnalysis'
import * as SanElement from 'classes/san/sanElements'

export class DrugsPractitionerAnalysis extends PractitionerAnalysis {

    motivatedToStop = new SanElement.Radiogroup<'noMotivation' | 'someMotivation' | 'motivated' | 'unknown'>('#drugs_practitioner_analysis_motivated_to_stop', ['noMotivation', 'someMotivation', 'motivated', 'unknown'])

    constructor() {
        super('Drug use')
    }
}
