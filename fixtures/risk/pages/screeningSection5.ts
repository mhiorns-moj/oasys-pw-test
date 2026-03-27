import { BaseAssessmentPage, Element } from 'classes'

export class ScreeningSection5 extends BaseAssessmentPage {

    name = 'RoshScreeningSection5'
    title = 'Risk of Serious Harm Screening'
    menu: Menu = { type: 'Floating', level1: 'RoSH Screening', level2: 'Section 5' }

    signAndLock = new Element.Button(this.page, 'Sign & Lock')
    countersign = new Element.Button(this.page, 'Countersign')
    countersignOverview = new Element.Button(this.page, 'Countersign Overview')
    r5_1 = new Element.Select(this.page, '#itm_R5_1')
    r5_1t = new Element.Textbox(this.page, '#textarea_R5_1_t')
    r5_2 = new Element.Select(this.page, '#itm_R5_2b')
    r5_2t = new Element.Textbox(this.page, '#textarea_R5_2a')


    async noRisks() {

        await this.goto()
        await this.r5_1.setValue('No')
    }

    async populateFull() {

        log('RoSH screening section 5 - fully populated')
        await this.goto(true)
        await this.r5_1.setValue('Yes')
        await this.r5_1t.setValue('This is a really bad offender')
    }
}
