declare type SanStep = {
    item: string,
    value?: string,
}

declare type SanScript = {
    section: SanSection,
    scenarios: SanScenario[],
}

declare type SanScenario = {
    name: string,
    steps: SanStep[],
    oasysAnswers: OasysAnswer[],
}

declare type SanPopulation = { section: SanSection, steps: SanStep[] }[]

declare type SanIds = { [keys: string]: SanId }
declare type SanId = { type: 'radio' | 'checkbox' | 'textbox' | 'action' | 'date' | 'combo' | 'button' | 'select' | 'conditionalCheckbox', id: string, options?: string[] }

declare type SanSection = 'Accommodation' | 'Employment and education' | 'Finances' | 'Drug use' | 'Alcohol use' | 'Health and wellbeing'
    | 'Personal relationships and community' | 'Thinking, behaviours and attitudes' | 'Offence analysis' | 'Sentence plan'

declare type SanWantChanges = 'madeChanges' | 'makingChanges' | 'wantToChange' | 'needHelp' | 'thinking' | 'notWanted' | 'notAnswering' | 'notPresent' | 'notApplicable'

declare type DrugsFrequency = 'daily' | 'weekly' | 'monthly' | 'occasionally'
declare type DrugType = 'amphetamines' | 'benzodiazepines' | 'cannabis' | 'cocaine' | 'crack' | 'ecstasy' | 'hallucinogenics' | 'heroin' | 'methadone' | 'prescribed' | 'opiates' | 'solvents' | 'steroids' | 'spice' | 'other'
declare type InjectableDrugType = 'none' | 'amphetamines' | 'benzodiazepines' | 'cocaine' | 'crack' | 'heroin' | 'methadone' | 'prescribed' | 'opiates' | 'steroids' | 'other'