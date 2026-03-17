import * as SanElement from 'classes/san/sanElements'
import { BaseSanEditPage } from '../baseSanEditPage'

export class Drugs3 extends BaseSanEditPage {

    name = 'Drugs3'
    title = 'Drug usage - Strengths and Needs'

    amphetaminesFrequency = new SanElement.Radiogroup<DrugsFrequency>('#how_often_used_last_six_months_amphetamines', ['daily', 'weekly', 'monthly', 'occasionally'])
    benzodiazepinesFrequency = new SanElement.Radiogroup<DrugsFrequency>('#how_often_used_last_six_months_benzodiazepines', ['daily', 'weekly', 'monthly', 'occasionally'])
    cannabisFrequency = new SanElement.Radiogroup<DrugsFrequency>('#how_often_used_last_six_months_cannabis', ['daily', 'weekly', 'monthly', 'occasionally'])
    cocaineFrequency = new SanElement.Radiogroup<DrugsFrequency>('#how_often_used_last_six_months_cocaine', ['daily', 'weekly', 'monthly', 'occasionally'])
    crackFrequency = new SanElement.Radiogroup<DrugsFrequency>('#how_often_used_last_six_months_crack', ['daily', 'weekly', 'monthly', 'occasionally'])
    ecstasyFrequency = new SanElement.Radiogroup<DrugsFrequency>('#how_often_used_last_six_months_ecstasy', ['daily', 'weekly', 'monthly', 'occasionally'])
    hallucinogenicsFrequency = new SanElement.Radiogroup<DrugsFrequency>('#how_often_used_last_six_months_hallucinogenics', ['daily', 'weekly', 'monthly', 'occasionally'])
    heroinFrequency = new SanElement.Radiogroup<DrugsFrequency>('#how_often_used_last_six_months_heroin', ['daily', 'weekly', 'monthly', 'occasionally'])
    methadoneFrequency = new SanElement.Radiogroup<DrugsFrequency>('#how_often_used_last_six_months_methadone_not_prescribed', ['daily', 'weekly', 'monthly', 'occasionally'])
    prescribedFrequency = new SanElement.Radiogroup<DrugsFrequency>('#how_often_used_last_six_months_misused_prescribed_drugs', ['daily', 'weekly', 'monthly', 'occasionally'])
    opiatesFrequency = new SanElement.Radiogroup<DrugsFrequency>('#how_often_used_last_six_months_other_opiates', ['daily', 'weekly', 'monthly', 'occasionally'])
    solventsFrequency = new SanElement.Radiogroup<DrugsFrequency>('#how_often_used_last_six_months_solvents', ['daily', 'weekly', 'monthly', 'occasionally'])
    steroidsFrequency = new SanElement.Radiogroup<DrugsFrequency>('#how_often_used_last_six_months_steroids', ['daily', 'weekly', 'monthly', 'occasionally'])
    spiceFrequency = new SanElement.Radiogroup<DrugsFrequency>('#how_often_used_last_six_months_spice', ['daily', 'weekly', 'monthly', 'occasionally'])
    otherFrequency = new SanElement.Radiogroup<DrugsFrequency>('#how_often_used_last_six_months_other_drug', ['daily', 'weekly', 'monthly', 'occasionally'])

    detailsNotLastSixMonths = new SanElement.Textbox('#not_used_in_last_six_months_details')
    injected = new SanElement.CheckboxGroup<InjectableDrugType>('#drugs_injected', ['none', '-', 'amphetamines', 'benzodiazepines', 'cocaine', 'crack', 'heroin', 'methadone', 'prescribed', 'opiates', 'steroids', 'other'], true)

    amphetaminesInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_amphetamines', ['lastSix', 'moreThanSix'])
    benzodiazepinesInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_benzodiazepines', ['lastSix', 'moreThanSix'])
    cocaineInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_cocaine', ['lastSix', 'moreThanSix'])
    crackInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_crack', ['lastSix', 'moreThanSix'])
    heroinInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_heroin', ['lastSix', 'moreThanSix'])
    methadoneInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_methadone_not_prescribed', ['lastSix', 'moreThanSix'])
    prescribedInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_misused_prescribed_drugs', ['lastSix', 'moreThanSix'])
    opiatesInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_other_opiates', ['lastSix', 'moreThanSix'])
    steroidsInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_steroids', ['lastSix', 'moreThanSix'])
    otherInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_other_drug', ['lastSix', 'moreThanSix'])

    treatment = new SanElement.Radiogroup<'yes' | 'no'>('#drugs_is_receiving_treatment', ['yes', 'no'])
    treatmentYesDetails = new SanElement.Textbox('#drugs_is_receiving_treatment_yes_details')
}
