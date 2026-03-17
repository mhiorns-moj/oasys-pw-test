import { OasysPage, Element } from 'classes'
import { SentencePlan } from '../../pages/sentencePlan'

export class SentencePlanService extends SentencePlan {

    name = 'SentencePlanService'
    title = 'Sentence Plan Service'
    menu: Menu = { type: 'Floating', level1: 'Sentence Plan Service' }

    openSpLabel = new Element.Text(this.page, `div:contains('To exit OASys and launch into the Sentence Plan Service please click on the button below')`)
    openSp = new Element.Button(this.page, 'Open Sentence Plan Service')
}


