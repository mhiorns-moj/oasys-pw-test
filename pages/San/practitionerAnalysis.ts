import { SanPage } from 'classes/san/sanPage'
import * as SanElement from 'classes/san/sanElements'

export class PractitionerAnalysis extends SanPage {

    name = 'PractitionerAnalysis'
    title = 'Strengths and needs'

    change = new SanElement.Link('a[href*="summary#practitioner-analysis"]')

    strengths = new SanElement.Radiogroup<'yes' | 'no'>(`#${this.page.idPrefix}_practitioner_analysis_strengths_or_protective_factors`, ['yes', 'no'])
    strengthsYesDetails = new SanElement.Textbox(`#${this.page.idPrefix}_practitioner_analysis_strengths_or_protective_factors_yes_details`)
    strengthsNoDetails = new SanElement.Textbox(`#${this.page.idPrefix}_practitioner_analysis_strengths_or_protective_factors_no_details`)

    riskOfHarm = new SanElement.Radiogroup<'yes' | 'no'>(`#${this.page.idPrefix}_practitioner_analysis_risk_of_serious_harm`, ['yes', 'no'])
    riskOfHarmYesDetails = new SanElement.Textbox(`#${this.page.idPrefix}_practitioner_analysis_risk_of_serious_harm_yes_details`)
    riskOfHarmNoDetails = new SanElement.Textbox(`#${this.page.idPrefix}_practitioner_analysis_risk_of_serious_harm_no_details`)

    riskOfReoffending = new SanElement.Radiogroup<'yes' | 'no'>(`#${this.page.idPrefix}_practitioner_analysis_risk_of_reoffending`, ['yes', 'no'])
    riskOfReoffendingYesDetails = new SanElement.Textbox(`#${this.page.idPrefix}_practitioner_analysis_risk_of_reoffending_yes_details`)
    riskOfReoffendingNoDetails = new SanElement.Textbox(`#${this.page.idPrefix}_practitioner_analysis_risk_of_reoffending_no_details`)

    saveAndContinue = new SanElement.Button('YES')
    markAsComplete = new SanElement.Button('YES')
    returnToOASys = new SanElement.Link('Return to OASys')

    constructor(section: SanSection) {
        super(idPrefixes[section])
        this.page.title = `${section} - Strengths and needs`
    }
}

const idPrefixes = {
    'Accommodation': 'accommodation',
    'Employment and education': 'emplyment_education',
    'Finances': 'finance',
    'Drug use': 'drug_use',
    'Alcohol use': 'alcohol_use',
    'Health and wellbeing': '',
    'Personal relationships and community': 'personal_relationships_community',
    'Thinking, behaviours and attitudes': 'thinking-behaviours-attitudes',
}