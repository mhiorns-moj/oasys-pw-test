import * as SanElement from 'classes/san/sanElements'
import { BaseSanEditPage } from '../baseSanEditPage'

export class Drugs4 extends BaseSanEditPage {

    name = 'Drugs4'
    title = 'Drug usage - Strengths and Needs'

    whyStarted = new SanElement.CheckboxGroup<'cultural' | 'curiosity' | 'performance' | 'escapism' | 'stress' | 'peerPressure' | 'recreation' | 'selfMedication' | 'other'>('#drugs_reasons_for_use', ['cultural', 'curiosity', 'performance', 'escapism', 'stress', 'peerPressure', 'recreation', 'selfMedication', 'other'])
    impactDrugs = new SanElement.CheckboxGroup<'behavioural' | 'community' | 'finances' | 'offending' | 'health' | 'relationships' | 'other'>('#drugs_affected_their_life', ['behavioural', 'community', 'finances', 'offending', 'health', 'relationships', 'other'])
    wantChanges = new SanElement.Radiogroup<SanWantChanges>('#drug_use_changes', ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable'])
}
