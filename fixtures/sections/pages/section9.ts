import { BaseAssessmentPage, Element } from 'classes'

export class Section9 extends BaseAssessmentPage {

    name = 'Section9'
    title = '9 - Alcohol Misuse'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '9 - Alcohol Misuse' }

    noIssues = new Element.Button(this.page, 'No Issues')
    o9_1 = new Element.Select<ProblemsMissingAnswer>(this.page, '#itm_9_1')
    o9_1Details = new Element.Textbox(this.page, '#textarea_9_1_t')
    o9_2 = new Element.Select<ProblemsMissingAnswer>(this.page, '#itm_9_2')
    o9_3 = new Element.Select<ProblemsMissingAnswer>(this.page, '#itm_9_3')
    o9_4 = new Element.Select<YesNoMissingAnswer>(this.page, '#itm_9_4')
    o9_5 = new Element.Select<ProblemsMissingAnswer>(this.page, '#itm_9_5')
    identifyIssues = new Element.Textbox(this.page, '#textarea_9_97')
    linkedToRisk = new Element.Select(this.page, '#itm_9_98')
    linkedToBehaviour = new Element.Select(this.page, '#itm_9_99')


    async populateNoIssues(suppressLog: boolean = false) {

        if (!suppressLog) log('Populating section 9 - no issues')
        await this.goto(true)
        await this.noIssues.click()
        await this.identifyIssues.setValue('Section 9 no issues')
    }
}


