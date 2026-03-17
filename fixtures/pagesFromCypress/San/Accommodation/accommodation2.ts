import * as SanElement from 'classes/san/sanElements'
import { BaseSanEditPage } from '../baseSanEditPage'

export class Accommodation2 extends BaseSanEditPage {

    name = 'Accommodation2'
    title = 'Accommodation - Strengths and Needs'

    livingWith = new SanElement.CheckboxGroup<'family' | 'friends' | 'partner' | 'child' | 'other' | 'unknown' | 'alone'>('#living_with', ['family', 'friends', 'partner', 'child', 'other', 'unknown', '-', 'alone'])
    locationSuitable = new SanElement.Radiogroup<'yes' | 'no'>('#suitable_housing_location', ['yes', 'no'])
    accommodationSuitable = new SanElement.Radiogroup<'yes' | 'yesWithConcerns' | 'no'>('#suitable_housing', ['yes', 'yesWithConcerns', 'no'])
    wantChanges = new SanElement.Radiogroup<SanWantChanges>('#accommodation_changes', ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable'])

}
/*
futurePlanned = new SanElement.Radiogroup('#suitable_housing_planned', ['yes', 'no'])
futureType = new SanElement.Radiogroup('#future_accommodation_type', ['awaitingAssessment', 'awatingPlacement', 'buyHouse', 'friends', 'privateRent', 'socialRent', 'healthcare', 'supported', 'other')


accommodationStrengths: {
    type: 'radio',
        id: '#accommodation_practitioner_analysis_strengths_or_protective_factors',
            options: ['yes', 'no'],
    },
accommodationStrengthsYesDetails: {
    type: 'textbox', id: '#accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details'
},
accommodationStrengthsNoDetails: {
    type: 'textbox', id: '#accommodation_practitioner_analysis_strengths_or_protective_factors_no_details'
},
accommodationRiskSeriousHarm: {
    type: 'radio',
        id: '#accommodation_practitioner_analysis_risk_of_serious_harm',
            options: ['yes', 'no'],
    },
accommodationRiskSeriousHarmYesDetails: {
    type: 'textbox', id: '#accommodation_practitioner_analysis_risk_of_serious_harm_yes_details'
},
accommodationRiskSeriousHarmNoDetails: {
    type: 'textbox', id: '#accommodation_practitioner_analysis_risk_of_serious_harm_no_details'
},
accommodationRiskReoffending: {
    type: 'radio',
        id: '#accommodation_practitioner_analysis_risk_of_reoffending',
            options: ['yes', 'no'],
    },
accommodationRiskReoffendingYesDetails: {
    type: 'textbox', id: '#accommodation_practitioner_analysis_risk_of_reoffending_yes_details'
},
accommodationRiskReoffendingNoDetails: {
    type: 'textbox', id: '#accommodation_practitioner_analysis_risk_of_reoffending_no_details'
},

*/