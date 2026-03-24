import { Page } from '@playwright/test'
import { OasysPage, Element } from 'classes'
import * as lib from 'lib'

export class PractitionerAnalysis extends OasysPage {

    name = 'PractitionerAnalysis'
    title = 'Strengths and needs'
    idPrefix = ''

    change = new Element.Link(this.page, 'a[href*="summary#practitioner-analysis"]')

    strengths = new Element.Radiogroup<'yes' | 'no'>(this.page, `#${this.idPrefix}_practitioner_analysis_strengths_or_protective_factors`, ['yes', 'no'])
    strengthsYesDetails = new Element.Textbox(this.page, `#${this.idPrefix}_practitioner_analysis_strengths_or_protective_factors_yes_details`)
    strengthsNoDetails = new Element.Textbox(this.page, `#${this.idPrefix}_practitioner_analysis_strengths_or_protective_factors_no_details`)

    riskOfHarm = new Element.Radiogroup<'yes' | 'no'>(this.page, `#${this.idPrefix}_practitioner_analysis_risk_of_serious_harm`, ['yes', 'no'])
    riskOfHarmYesDetails = new Element.Textbox(this.page, `#${this.idPrefix}_practitioner_analysis_risk_of_serious_harm_yes_details`)
    riskOfHarmNoDetails = new Element.Textbox(this.page, `#${this.idPrefix}_practitioner_analysis_risk_of_serious_harm_no_details`)

    riskOfReoffending = new Element.Radiogroup<'yes' | 'no'>(this.page, `#${this.idPrefix}_practitioner_analysis_risk_of_reoffending`, ['yes', 'no'])
    riskOfReoffendingYesDetails = new Element.Textbox(this.page, `#${this.idPrefix}_practitioner_analysis_risk_of_reoffending_yes_details`)
    riskOfReoffendingNoDetails = new Element.Textbox(this.page, `#${this.idPrefix}_practitioner_analysis_risk_of_reoffending_no_details`)

    saveAndContinue = new Element.Button(this.page, 'YES')
    markAsComplete = new Element.Button(this.page, 'YES')
    returnToOASys = new Element.Link(this.page, 'Return to OASys')

    constructor(page: Page, section: SanSection) {
        super(page)
        this.title = `${section} - Strengths and needs`
        this.idPrefix = idPrefixes[section]
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