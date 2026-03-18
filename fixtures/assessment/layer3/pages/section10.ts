import { BaseAssessmentPage, Element } from 'classes'
import * as lib from 'lib'

export class Section10 extends BaseAssessmentPage {

    name = 'Section10'
    title = '10 - Emotional Well-being'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '10 - Emotional Well-being' }

    noIssues = new Element.Button(this.page, 'No Issues')
    o10_1 = new Element.Select<ProblemsAnswer>(this.page, '#itm_10_1')
    o10_2 = new Element.Select<ProblemsAnswer>(this.page, '#itm_10_2')
    o10_3 = new Element.Select<ProblemsAnswer>(this.page, '#itm_10_3')
    o10_4 = new Element.Select<ProblemsAnswer>(this.page, '#itm_10_4')
    o10_5 = new Element.Select<'No -0' | 'Yes - 2'>(this.page, '#itm_10_5')
    o10_6 = new Element.Select<ProblemsAnswer>(this.page, '#itm_10_6')
    o10_7Childhood = new Element.Select<YesNoAnswer>(this.page, '#itm_10_7_V2_CHILDHOOD')
    o10_7HeadInjuries = new Element.Select<YesNoAnswer>(this.page, '#itm_10_7_V2_HISTHEADINJ')
    o10_7Psychiatric = new Element.Select<YesNoAnswer>(this.page, '#itm_10_7_V2_HISTPSYCH')
    o10_7Medication = new Element.Select<YesNoAnswer>(this.page, '#itm_10_7_V2_MEDICATION')
    o10_7FailedCoOp = new Element.Select<YesNoAnswer>(this.page, '#itm_10_7_V2_FAILEDTOCOOP')
    o10_7Patient = new Element.Select<YesNoAnswer>(this.page, '#itm_10_7_V2_PATIENT')
    o10_7Treatment = new Element.Select<YesNoAnswer>(this.page, '#itm_10_7_V2_PSYCHTREAT')
    o10_8 = new Element.Select<YesNoAnswer>(this.page, '#itm_10_8')
    identifyIssues = new Element.Textbox(this.page, '#textarea_10_97')
    linkedToRisk = new Element.Select(this.page, '#itm_10_98')
    linkedToBehaviour = new Element.Select(this.page, '#itm_10_99')


    async populateNoIssues(suppressLog: boolean = false) {

        if (!suppressLog) lib.log('Populating section 10 - no issues')
        await this.goto(true)
        await this.noIssues.click()
        await this.identifyIssues.setValue('Section 10 no issues')
    }
}


