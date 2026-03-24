import { BaseAssessmentPage, Element } from 'classes'
import * as lib from 'lib'

export class FastReview extends BaseAssessmentPage {

    name = 'FastReview'
    title = 'Fast Review'
    menu: Menu = { type: 'Floating', level1: 'Fast Review' }

    instruction = new Element.Text(this.page, 'Review each of the sections of OASys and indicate if there have been any changes in any of the sections')
    section2 = new Element.Select<YesNoAnswer>(this.page, '#itm_6_1_1_1')
    section2Comments = new Element.Textbox(this.page, '#textarea_6_1_1_t')
    section3 = new Element.Select<YesNoAnswer>(this.page, '#itm_6_1_2_1')
    section3Comments = new Element.Textbox(this.page, '#textarea_6_1_2_t')
    section4 = new Element.Select<YesNoAnswer>(this.page, '#itm_6_1_3_1')
    section4Comments = new Element.Textbox(this.page, '#textarea_6_1_3_t')
    section5 = new Element.Select<YesNoAnswer>(this.page, '#itm_6_1_4_1')
    section5Comments = new Element.Textbox(this.page, '#textarea_6_1_4_t')
    section6 = new Element.Select<YesNoAnswer>(this.page, '#itm_6_1_5_1')
    section6Comments = new Element.Textbox(this.page, '#textarea_6_1_5_t')
    section7 = new Element.Select<YesNoAnswer>(this.page, '#itm_6_1_6_1')
    section7Comments = new Element.Textbox(this.page, '#textarea_6_1_6_t')
    section8 = new Element.Select<YesNoAnswer>(this.page, '#itm_6_1_7_1')
    section8Comments = new Element.Textbox(this.page, '#textarea_6_1_7_t')
    section9 = new Element.Select<YesNoAnswer>(this.page, '#itm_6_1_8_1')
    section9Comments = new Element.Textbox(this.page, '#textarea_6_1_8_t')
    section10 = new Element.Select<YesNoAnswer>(this.page, '#itm_6_1_9_1')
    section10Comments = new Element.Textbox(this.page, '#textarea_6_1_9_t')
    section11 = new Element.Select<YesNoAnswer>(this.page, '#itm_6_1_10_1')
    section11Comments = new Element.Textbox(this.page, '#textarea_6_1_10_t')
    section12 = new Element.Select<YesNoAnswer>(this.page, '#itm_6_1_11_1')
    section12Comments = new Element.Textbox(this.page, '#textarea_6_1_11_t')


    async populateNoChanges(suppressLog: boolean = false) {

        if (!suppressLog) log('Populating fast review - no changes')
        await this.goto(true)

        await this.section2.setValue('No')
        await this.section3.setValue('No')
        await this.section4.setValue('No')
        await this.section5.setValue('No')
        await this.section6.setValue('No')
        await this.section7.setValue('No')
        await this.section8.setValue('No')
        await this.section9.setValue('No')
        await this.section10.setValue('No')
        await this.section11.setValue('No')
        await this.section12.setValue('No')
    }
}


