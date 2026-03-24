import { OasysPage, Element } from 'classes'
import { SentencePlan } from './sentencePlan'

export class RspSection1to2 extends SentencePlan {

    name = 'RSPSection1to2'
    title = 'Review Sentence Plan'
    menu: Menu = { type: 'Floating', level1: 'Review Sentence Plan', level2: 'Section 2' }

    reviewNumber = new Element.Textbox<number>(this.page, '#itm_RP_1')
    reviewDate = new Element.Textbox<OasysDate>(this.page, '#itm_RP_2', true)
    typeOfAssessment = new Element.Select(this.page, '#itm_RP_3')
    transferDate = new Element.Textbox<OasysDate>(this.page, '#itm_RP_4', true)
    terminationDate = new Element.Textbox<OasysDate>(this.page, '#itm_RP_6', true)
    furtherOffences = new Element.Textbox(this.page, '#itm_RP_112')
}
