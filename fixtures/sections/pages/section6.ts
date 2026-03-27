import { BaseAssessmentPage, Element } from 'classes'

export class Section6 extends BaseAssessmentPage {

    name = 'Section6'
    title = '6 - Relationships'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '6 - Relationships' }

    noIssues = new Element.Button(this.page, 'No Issues')
    o6_1 = new Element.Select<ProblemsMissingAnswer>(this.page, '#itm_6_1')
    o6_3 = new Element.Select<ProblemsAnswer>(this.page, '#itm_6_3')
    o6_8 = new Element.Select<Q6_8Answer>(this.page, '#itm_6_8')
    o6_4 = new Element.Select<ProblemsAnswer>(this.page, '#itm_6_4')
    o6_6 = new Element.Select<ProblemsAnswer>(this.page, '#itm_6_6')
    o6_7 = new Element.Select<YesNoAnswer>(this.page, '#itm_6_7da')
    o6_7VictimPartner = new Element.Select<YesNoAnswer>(this.page, '#itm_6_7_1_1da')
    o6_7VictimFamily = new Element.Select<YesNoAnswer>(this.page, '#itm_6_7_1_2da')
    o6_7PerpetratorPartner = new Element.Select<YesNoAnswer>(this.page, '#itm_6_7_2_1da')
    o6_7PerpetratorFamily = new Element.Select<YesNoAnswer>(this.page, '#itm_6_7_2_2da')
    o6_9 = new Element.Select<YesNoAnswer>(this.page, '#itm_6_9')
    o6_10 = new Element.Select<'No problems' | 'Some problems' | 'Significant problems'>(this.page, '#itm_6_10')
    o6_11 = new Element.Select<YesNoAnswer>(this.page, '#itm_6_11')
    o6_12 = new Element.Select<ProblemsAnswer>(this.page, '#itm_6_12')
    identifyIssues = new Element.Textbox(this.page, '#textarea_6_97')
    linkedToRisk = new Element.Select<YesNoAnswer>(this.page, '#itm_6_98')
    linkedToBehaviour = new Element.Select<YesNoAnswer>(this.page, '#itm_6_99')


    async populateNoIssues(populate6_11?: 'Yes' | 'No', suppressLog: boolean = false) {

        if (!suppressLog) log('Populating section 6 - no issues')
        await this.goto(true)
        await this.noIssues.click()
        if (populate6_11) {
            await this.o6_11.setValue(populate6_11)
        }
        await this.identifyIssues.setValue('Section 6 no issues')
    }
}


