import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { SentencePlan } from './sentencePlan'

export class SentencePlanService extends SentencePlan {

    name = 'SentencePlanService'
    title = 'Sentence Plan Service'
    menu: Menu = { type: 'Floating', level1: 'Sentence Plan Service' }

    openSpLabel = new Element.Text(`div:contains('To exit OASys and launch into the Sentence Plan Service please click on the button below')`)
    openSp = new Element.Button('Open Sentence Plan Service')
}


