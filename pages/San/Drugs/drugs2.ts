import * as SanElement from 'classes/san/sanElements'
import { BaseSanEditPage } from '../baseSanEditPage'

export class Drugs2 extends BaseSanEditPage {

    name = 'Drugs2'
    title = 'Drug usage - Strengths and Needs'
    drugType = new SanElement.CheckboxGroup<DrugType>('#select_misused_drugs', ['amphetamines', 'benzodiazepines', 'cannabis', 'cocaine', 'crack', 'ecstasy', 'hallucinogenics', 'heroin', 'methadone', 'prescribed', 'opiates', 'solvents', 'steroids', 'spice', 'other'])

    amphetaminesLastSixMonths = new SanElement.Radiogroup<'yes' | 'no'>('#drug_last_used_amphetamines', ['yes', 'no'])
    benzodiazepinesLastSixMonths = new SanElement.Radiogroup<'yes' | 'no'>('#drug_last_used_benzodiazepines', ['yes', 'no'])
    cannabisLastSixMonths = new SanElement.Radiogroup<'yes' | 'no'>('#drug_last_used_cannabis', ['yes', 'no'])
    cocaineLastSixMonths = new SanElement.Radiogroup<'yes' | 'no'>('#drug_last_used_cocaine', ['yes', 'no'])
    crackLastSixMonths = new SanElement.Radiogroup<'yes' | 'no'>('#drug_last_used_crack', ['yes', 'no'])
    ecstasyLastSixMonths = new SanElement.Radiogroup<'yes' | 'no'>('#drug_last_used_ecstasy', ['yes', 'no'])
    hallucinogenicsLastSixMonths = new SanElement.Radiogroup<'yes' | 'no'>('#drug_last_used_hallucinogenics', ['yes', 'no'])
    heroinLastSixMonths = new SanElement.Radiogroup<'yes' | 'no'>('#drug_last_used_heroin', ['yes', 'no'])
    methadoneLastSixMonths = new SanElement.Radiogroup<'yes' | 'no'>('#drug_last_used_methadone_not_prescribed', ['yes', 'no'])
    prescribedLastSixMonths = new SanElement.Radiogroup<'yes' | 'no'>('#drug_last_used_misused_prescribed_drugs', ['yes', 'no'])
    opiatesLastSixMonths = new SanElement.Radiogroup<'yes' | 'no'>('#drug_last_used_other_opiates', ['yes', 'no'])
    solventsLastSixMonths = new SanElement.Radiogroup<'yes' | 'no'>('#drug_last_used_solvents', ['yes', 'no'])
    spiceLastSixMonths = new SanElement.Radiogroup<'yes' | 'no'>('#drug_last_used_spice', ['yes', 'no'])
    steroidsLastSixMonths = new SanElement.Radiogroup<'yes' | 'no'>('#drug_last_used_steroids', ['yes', 'no'])
    drugTypeOther = new SanElement.Textbox('#other_drug_name')
    otherLastSixMonths = new SanElement.Radiogroup<'yes' | 'no'>('#drug_last_used_other_drug', ['yes', 'no'])
}
