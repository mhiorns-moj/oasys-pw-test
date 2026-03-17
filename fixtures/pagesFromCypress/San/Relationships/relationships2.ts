import * as SanElement from 'classes/san/sanElements'
import { BaseSanEditPage } from '../baseSanEditPage'

export class Relationships2 extends BaseSanEditPage {

    name = 'Relationships2'
    title = 'Personal relationships and community - Strengths and Needs'

    importantPeople = new SanElement.CheckboxGroup<'partner' | 'ownChildren' | 'otherChildren' | 'family' | 'friends' | 'other'>('#personal_relationships_community_important_people', ['partner', 'ownChildren', 'otherChildren', 'family', 'friends', 'other'])
// importantOtherDetails: {
//     type: 'textbox', id: '#personal_relationships_community_important_people_other_details'
// },
}


// happyWithStatus: {
//     type: 'radio',
//     id: '#personal_relationships_community_current_relationship',
//     options: ['happy', 'someConcerns', 'unhappy'],
// },
// history: {
//     type: 'radio',
//     id: '#personal_relationships_community_intimate_relationship',
//     options: ['stable', 'mixed', 'unstable'],
// },
// manageParenting: {
//     type: 'radio',
//     id: '#personal_relationships_community_parental_responsibilities',
//     options: ['yes', 'sometimes', 'no', 'unknown'],
// },
// currentFamilyRelationship: {
//     type: 'radio',
//     id: '#personal_relationships_community_family_relationship',
//     options: ['stable', 'mixed', 'unstable', 'unknown'],
// },
// childhoodExperience: {
//     type: 'radio',
//     id: '#personal_relationships_community_childhood',
//     options: ['positive', 'mixed', 'negative'],
// },
// behaviouralProblems: {
//     type: 'radio',
//     id: '#personal_relationships_community_childhood_behaviour',
//     options: ['yes', 'no'],
// },
// wantChangesRelationships: {
//     type: 'radio',
//     id: '#personal_relationships_community_changes',
//     options: ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable'],
// },


// resolveChallenges: {
//     type: 'textbox', id: '#personal_relationships_community_challenges_intimate_relationship'
// },

// relationshipsStrengths: {
//     type: 'radio',
//     id: '#personal_relationships_community_practitioner_analysis_strengths_or_protective_factors',
//     options: ['yes', 'no'],
// },
// relationshipsStrengthsYesDetails: {
//     type: 'textbox', id: '#personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_yes_details'
// },
// relationshipsStrengthsNoDetails: {
//     type: 'textbox', id: '#personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_no_details'
// },
// relationshipsRiskSeriousHarm: {
//     type: 'radio',
//     id: '#personal_relationships_community_practitioner_analysis_risk_of_serious_harm',
//     options: ['yes', 'no'],
// },
// relationshipsRiskSeriousHarmYesDetails: {
//     type: 'textbox', id: '#personal_relationships_community_practitioner_analysis_risk_of_serious_harm_yes_details'
// },
// relationshipsRiskSeriousHarmNoDetails: {
//     type: 'textbox', id: '#personal_relationships_community_practitioner_analysis_risk_of_serious_harm_no_details'
// },
// relationshipsRiskReoffending: {
//     type: 'radio',
//     id: '#personal_relationships_community_practitioner_analysis_risk_of_reoffending',
//     options: ['yes', 'no'],
// },
// relationshipsRiskReoffendingYesDetails: {
//     type: 'textbox', id: '#personal_relationships_community_practitioner_analysis_risk_of_reoffending_yes_details'
// },
// relationshipsRiskReoffendingNoDetails: {
//     type: 'textbox', id: '#personal_relationships_community_practitioner_analysis_risk_of_reoffending_no_details'
// },