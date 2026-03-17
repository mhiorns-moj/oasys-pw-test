import * as SanElement from 'classes/san/sanElements'
import { BaseSanEditPage } from '../baseSanEditPage'

export class Drugs1 extends BaseSanEditPage {

    name = 'Drugs1'
    title = 'Drug usage - Strengths and Needs'

    everUsed = new SanElement.Radiogroup<'yes' | 'no'>('#drug_use', ['yes', 'no'])
}
