import { OasysPage, Element } from 'classes'

export class OffenderSentencePlanSigning extends OasysPage {

    name = 'OffenderSentencePlanSigning'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Add Offender Sentence Plan Signed Date' }

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    signed = new Element.Select(this.page, '#P3_OFFENDER_SIGNED_LOV')
    dateSigned = new Element.Textbox<OasysDate>(this.page, '#P3_DATE_SIGNED', true)
    comments = new Element.Textbox(this.page, '#P3_PLAN_COMMENTS')
    reasons = new Element.Textbox(this.page, '#P3_DECLINES_TO_SIGN_REASON')
}
