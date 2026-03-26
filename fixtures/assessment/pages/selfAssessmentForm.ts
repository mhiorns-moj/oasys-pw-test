import { BaseAssessmentPage, Element } from 'classes'

export class SelfAssessmentForm extends BaseAssessmentPage {

    name = 'SelfAssessmentForm'
    title = 'Self Assessment Form'
    menu: Menu = { type: 'Floating', level1: 'Self Assessment Form' }

    helpNeeded = new Element.Select(this.page, '#itm_SAQA')
    dateCompleted = new Element.Textbox<OasysDate>(this.page, '#itm_SAQB', true)
    markUnansweredAsNo = new Element.Button(this.page, 'Mark unanswered as No')
    s1 = new Element.Select(this.page, '#itm_SAQC1_1')
    s1LinkedOffending = new Element.Select(this.page, '#itm_SAQC1_2')
    s2 = new Element.Select(this.page, '#itm_SAQC2_1')
    s2LinkedOffending = new Element.Select(this.page, '#itm_SAQC2_2')
    s3 = new Element.Select(this.page, '#itm_SAQC3_1')
    s3LinkedOffending = new Element.Select(this.page, '#itm_SAQC3_2')
    s4 = new Element.Select(this.page, '#itm_SAQC4_1')
    s4LinkedOffending = new Element.Select(this.page, '#itm_SAQC4_2')
    s5 = new Element.Select(this.page, '#itm_SAQC5_1')
    s5LinkedOffending = new Element.Select(this.page, '#itm_SAQC5_2')
    s6 = new Element.Select(this.page, '#itm_SAQC6_1')
    s6LinkedOffending = new Element.Select(this.page, '#itm_SAQC6_2')
    s7 = new Element.Select(this.page, '#itm_SAQC7_1')
    s7LinkedOffending = new Element.Select(this.page, '#itm_SAQC7_2')
    s8 = new Element.Select(this.page, '#itm_SAQC8_1')
    s8LinkedOffending = new Element.Select(this.page, '#itm_SAQC8_2')
    s9 = new Element.Select(this.page, '#itm_SAQC9_1')
    s9LinkedOffending = new Element.Select(this.page, '#itm_SAQC9_2')
    s10 = new Element.Select(this.page, '#itm_SAQC10_1')
    s10LinkedOffending = new Element.Select(this.page, '#itm_SAQC10_2')
    s11 = new Element.Select(this.page, '#itm_SAQC11_1')
    s11LinkedOffending = new Element.Select(this.page, '#itm_SAQC11_2')
    s12 = new Element.Select(this.page, '#itm_SAQC12_1')
    s12LinkedOffending = new Element.Select(this.page, '#itm_SAQC12_2')
    s13 = new Element.Select(this.page, '#itm_SAQC13_1')
    s13LinkedOffending = new Element.Select(this.page, '#itm_SAQC13_2')
    s14 = new Element.Select(this.page, '#itm_SAQC14_1')
    s14LinkedOffending = new Element.Select(this.page, '#itm_SAQC14_2')
    s15 = new Element.Select(this.page, '#itm_SAQC15_1')
    s15LinkedOffending = new Element.Select(this.page, '#itm_SAQC15_2')
    s16 = new Element.Select(this.page, '#itm_SAQC16_1')
    s16LinkedOffending = new Element.Select(this.page, '#itm_SAQC16_2')
    s17 = new Element.Select(this.page, '#itm_SAQC17_1')
    s17LinkedOffending = new Element.Select(this.page, '#itm_SAQC17_2')
    s18 = new Element.Select(this.page, '#itm_SAQC18_1')
    s18LinkedOffending = new Element.Select(this.page, '#itm_SAQC18_2')
    s19 = new Element.Select(this.page, '#itm_SAQC19_1')
    s19LinkedOffending = new Element.Select(this.page, '#itm_SAQC19_2')
    s20 = new Element.Select(this.page, '#itm_SAQC20_1')
    s20LinkedOffending = new Element.Select(this.page, '#itm_SAQC20_2')
    s21 = new Element.Select(this.page, '#itm_SAQC21_1')
    s21LinkedOffending = new Element.Select(this.page, '#itm_SAQC21_2')
    s22 = new Element.Select(this.page, '#itm_SAQC22_1')
    s22LinkedOffending = new Element.Select(this.page, '#itm_SAQC22_2')
    s23 = new Element.Select(this.page, '#itm_SAQC23_1')
    s23LinkedOffending = new Element.Select(this.page, '#itm_SAQC23_2')
    s24 = new Element.Select(this.page, '#itm_SAQC24_1')
    s24LinkedOffending = new Element.Select(this.page, '#itm_SAQC24_2')
    s25 = new Element.Select(this.page, '#itm_SAQC25_1')
    s25LinkedOffending = new Element.Select(this.page, '#itm_SAQC25_2')
    s26 = new Element.Select(this.page, '#itm_SAQC26_1')
    s26LinkedOffending = new Element.Select(this.page, '#itm_SAQC26_2')
    s27 = new Element.Select(this.page, '#itm_SAQC27_1')
    s27LinkedOffending = new Element.Select(this.page, '#itm_SAQC27_2')
    s28 = new Element.Select(this.page, '#itm_SAQ28')
    why = new Element.Textbox(this.page, '#textarea_SAQD')
    whyNotCompleted = new Element.Textbox(this.page, '#textarea_SAQDE')
    save = new Element.Button(this.page, '#P2_BT_SAVE_BOTT')


    async populateMinimal() {

        log('Minimally populating self assessment page')
        await this.goto(true)
        await this.whyNotCompleted.setValue(`Didn't want to`)
    }
}


