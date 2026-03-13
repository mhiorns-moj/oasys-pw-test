import * as SanElement from 'classes/san/sanElements'
import { BaseSanEditPage } from '../baseSanEditPage'

export class Accommodation1 extends BaseSanEditPage {

    name = 'Accommodation1'
    title = 'Accommodation - Strengths and Needs'

    currentAccommodation = new SanElement.Radiogroup<'settled' | 'temporary' | 'noAccommodation'>('#current_accommodation', ['settled', 'temporary', 'noAccommodation'])
    noAccommodationType = new SanElement.Radiogroup<'awaitingAssessment' | 'campsite' | 'hostel' | 'homeless' | 'roughSleeping' | 'shelter'>('#type_of_no_accommodation', ['awaitingAssessment', 'campsite', 'hostel', 'homeless', 'roughSleeping', 'shelter'])
    settledAccommodationType = new SanElement.Radiogroup<'homeowner' | 'friends' | 'privateRenting' | 'socialRent' | 'healthcare' | 'supported'>('#type_of_settled_accommodation', ['homeowner', 'friends', 'privateRenting', 'socialRent', 'healthcare', 'supported'])
    temporaryAccommodationType = new SanElement.Radiogroup<'approvedPremises' | 'cas2' | 'cas3' | 'immigration' | 'shortTerm'>('#type_of_temporary_accommodation', ['approvedPremises', 'cas2', 'cas3', 'immigration', 'shortTerm'])
}
