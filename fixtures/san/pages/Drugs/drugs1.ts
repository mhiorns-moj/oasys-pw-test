import { Element } from 'classes'
import { BaseSanEditPage } from '../baseSanEditPage'

export class Drugs1 extends BaseSanEditPage {

    name = 'Drugs1'
    title = 'Drug usage - Strengths and Needs'

    everUsed = new Element.Radiogroup<'yes' | 'no'>('#drug_use', ['yes', 'no'])
}
