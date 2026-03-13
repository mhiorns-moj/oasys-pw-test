import * as oasys from 'lib'
import { sets, getSurname } from '../parameters'

describe('NOD1045 probation SAN assessments', () => {

    it('Test ref 16', () => { // MALE Offender with a WIP SAN L3 V2 assessment (external SP).

        oasys.login(oasys.Users.probSanHeadPdu)

        for (let set = 1; set <= sets; set++) {

            oasys.Offender.searchAndSelectByName(getSurname(set, true), 'Sixteen')
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', includeSanSections: 'Yes' })

            oasys.Populate.CommonPages.OffendingInformation.minimal()
            const predictors = new oasys.Pages.Assessment.Predictors().goto(true)
            predictors.dateFirstSanction.setValue({ years: -2 })
            predictors.o1_32.setValue(2)
            predictors.o1_40.setValue(0)
            predictors.o1_29.setValue({ months: -6 })
            predictors.o1_30.setValue('No')
            predictors.o1_38.setValue({ months: 6 })

            oasys.San.gotoSan()
            oasys.San.populateSanSections('Test ref 16', sanPopulation1)
            oasys.San.returnToOASys()

            oasys.Populate.Rosh.screeningNoRisks(true)

            // oasys.San.gotoSentencePlan()
            // oasys.San.populateSanSections('SAN sentence plan', oasys.Populate.San.SentencePlan.minimal)
            // oasys.San.returnToOASys()
        }
    })

})


const sanPopulation1: SanPopulation = [
    {
        section: 'Accommodation',
        steps: [
            { item: 'currentAccommodation', value: 'settled' },
            { item: 'settledAccommodationType', value: 'friends' },
            { item: 'saveAndContinue' },
            { item: 'livingWith', value: 'family, partner' },
            { item: 'locationSuitable', value: 'yes' },
            { item: 'accommodationSuitable', value: 'yes' },
            { item: 'wantChangesAccommodation', value: 'madeChanges' },
            { item: 'saveAndContinue' },
            { item: 'practitionerAnalysis' },
            { item: 'accommodationStrengths', value: 'no' },
            { item: 'accommodationRiskSeriousHarm', value: 'no' },
            { item: 'accommodationRiskReoffending', value: 'no' },
            { item: 'markAsComplete' },
        ],
    },
    {
        section: 'Employment and education',
        steps: [
            { item: 'employmentStatus', value: 'selfEmployed' },
            { item: 'saveAndContinue' },
            { item: 'employmentHistory', value: 'continuous' },
            { item: 'additionalCommitments', value: 'none' },
            { item: 'highestQual', value: 'entryLevel' },
            { item: 'professionalQual', value: 'yes' },
            { item: 'professionalQualDetails', value: 'some qualifications' },
            { item: 'skills', value: 'yes' },
            { item: 'difficulties', value: 'none' },
            { item: 'employmentExperience', value: 'positiveNegative' },
            { item: 'educationExperience', value: 'positive' },
            { item: 'wantChangesEmployment', value: 'madeChanges' },
            { item: 'saveAndContinue' },
            { item: 'practitionerAnalysis' },
            { item: 'employmentStrengths', value: 'no' },
            { item: 'employmentRiskSeriousHarm', value: 'no' },
            { item: 'employmentRiskReoffending', value: 'no' },
            { item: 'markAsComplete' },
        ],
    },
    {
        section: 'Finances',
        steps: [
            { item: 'incomeSource', value: 'offending' },
            { item: 'ownAccount', value: 'yes' },
            { item: 'howGoodManaging', value: 'ableStrength' },
            { item: 'gambling', value: 'no' },
            { item: 'debt', value: 'no' },
            { item: 'wantChangesFinance', value: 'notAnswering' },
            { item: 'saveAndContinue' },
            { item: 'practitionerAnalysis' },
            { item: 'financeStrengths', value: 'no' },
            { item: 'financeRiskSeriousHarm', value: 'no' },
            { item: 'financeRiskReoffending', value: 'no' },
            { item: 'markAsComplete' },
        ],
    },
    {
        section: 'Drug use',
        steps: [
            { item: 'everUsed', value: 'no' },
            { item: 'saveAndContinue' },
            { item: 'practitionerAnalysis' },
            { item: 'drugsStrengths', value: 'no' },
            { item: 'drugsRiskSeriousHarm', value: 'no' },
            { item: 'drugsRiskReoffending', value: 'no' },
            { item: 'markAsComplete' },
        ],
    },
    {
        section: 'Alcohol use',
        steps: [
            { item: 'everDrank', value: 'yesNotLast3' },
            { item: 'saveAndContinue' },
            { item: 'bingeDrinking', value: 'noEvidence' },
            { item: 'pastIssues', value: 'no' },
            { item: 'whyDrink', value: 'enjoyment' },
            { item: 'impactAlcohol', value: 'noImpact' },
            { item: 'anythingHelpedAlcohol', value: 'no' },
            { item: 'wantChangesAlcohol', value: 'madeChanges' },
            { item: 'saveAndContinue' },
            { item: 'practitionerAnalysis' },
            { item: 'alcoholStrengths', value: 'no' },
            { item: 'alcoholRiskSeriousHarm', value: 'no' },
            { item: 'alcoholRiskReoffending', value: 'no' },
            { item: 'markAsComplete' },
        ],
    },
    {
        section: 'Health and wellbeing',
        steps: [
            { item: 'physicalHealthConditions', value: 'no' },
            { item: 'mentalHealthProblems', value: 'yesOngoingSevere' },
            { item: 'saveAndContinue' },
            { item: 'psychTreatment', value: 'yes' },
            { item: 'headInjury', value: 'yes' },
            { item: 'neurodiverse', value: 'yes' },
            { item: 'learningDifficulties', value: 'yesSome' },
            { item: 'coping', value: 'no' },
            { item: 'attitude', value: 'positive' },
            { item: 'selfHarmed', value: 'yes' },
            { item: 'selfHarmedDetails', value: 'Details' },
            { item: 'suicide', value: 'yes' },
            { item: 'suicideDetails', value: 'Details' },
            { item: 'optimistic', value: 'optimistic' },
            { item: 'wantChangesHealth', value: 'madeChanges' },
            { item: 'saveAndContinue' },
            { item: 'practitionerAnalysis' },
            { item: 'healthStrengths', value: 'no' },
            { item: 'healthRiskSeriousHarm', value: 'no' },
            { item: 'healthRiskReoffending', value: 'no' },
            { item: 'markAsComplete' },
        ],
    },
    {
        section: 'Personal relationships and community',
        steps: [
            { item: 'anyChildren', value: 'no' },
            { item: 'saveAndContinue' },
            { item: 'importantPeople', value: 'partner, otherChildren, family, friends, other' },
            { item: 'importantOtherDetails', value: 'Other person details' },
            { item: 'saveAndContinue' },
            { item: 'happyWithStatus', value: 'unhappy' },
            { item: 'history', value: 'mixed' },
            { item: 'resolveChallenges', value: 'Challenges text' },
            { item: 'currentFamilyRelationship', value: 'mixed' },
            { item: 'childhoodExperience', value: 'negative' },
            { item: 'behaviouralProblems', value: 'yes' },
            { item: 'wantChangesRelationships', value: 'wantToChange' },
            { item: 'saveAndContinue' },
            { item: 'practitionerAnalysis' },
            { item: 'relationshipsStrengths', value: 'no' },
            { item: 'relationshipsRiskSeriousHarm', value: 'no' },
            { item: 'relationshipsRiskReoffending', value: 'no' },
            { item: 'markAsComplete' },
        ],
    },
    {
        section: 'Thinking, behaviours and attitudes',
        steps: [
            { item: 'awareConsequences', value: 'yes' },
            { item: 'stableBehaviour', value: 'yes' },
            { item: 'activitiesLinkedOffending', value: 'proSocialActivities' },
            { item: 'resilient', value: 'yes' },
            { item: 'ableSolveProblems', value: 'yes' },
            { item: 'understandOthers', value: 'no' },
            { item: 'manipulativeBehaviour', value: 'some' },
            { item: 'saveAndContinue' },
            { item: 'manageTemper', value: 'no' },
            { item: 'violence', value: 'yes' },
            { item: 'impulse', value: 'yes' },
            { item: 'positiveAttitude', value: 'no' },
            { item: 'hostileOrientation', value: 'yes' },
            { item: 'acceptSupervision', value: 'no' },
            { item: 'supportCriminalBehaviour', value: 'yes' },
            { item: 'wantChangesThinking', value: 'madeChanges' },
            { item: 'saveAndContinue' },
            { item: 'riskOfSexualHarm', value: 'no' },
            { item: 'saveAndContinue' },
            { item: 'practitionerAnalysis' },
            { item: 'thinkingStrengths', value: 'no' },
            { item: 'thinkingRiskSeriousHarm', value: 'no' },
            { item: 'thinkingRiskReoffending', value: 'no' },
            { item: 'markAsComplete' },
        ],
    },
    {
        section: 'Offence analysis',
        steps: [
            { item: 'offenceDescription', value: `Offence description` },
            { item: 'offenceElements', value: `weapon` },
            { item: 'reason', value: `Why it happened` },
            { item: 'motivations', value: `other` },
            { item: 'motivationOther', value: `Some reason` },
            { item: 'victimType', value: `other` },
            { item: 'victimTypeDetails', value: `Victim details` },
            { item: 'saveAndContinue' },
            { item: 'howManyOthers', value: `0` },
            { item: 'saveAndContinue' },
            { item: 'impact', value: `yes` },
            { item: 'responsibility', value: `yes` },
            { item: 'patterns', value: `Patterns` },
            { item: 'escalation', value: `no` },
            { item: 'riskSeriousHarm', value: `no` },
            { item: 'riskSeriousHarmNoDetails', value: `No risk` },
            { item: 'domesticAbusePerpertrator', value: `no` },
            { item: 'domesticAbuseVictim', value: `no` },
            { item: 'markAsComplete' },
        ],
    },
]
