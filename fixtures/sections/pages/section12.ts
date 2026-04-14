import { BaseAssessmentPage, Element } from 'classes'

export class Section12 extends BaseAssessmentPage {

    name = 'Section12'
    title = '12 - Attitudes'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '12 - Attitudes' }

    noIssues = new Element.Button(this.page, 'No Issues')
    o12_1 = new Element.Select<ProblemsMissingAnswer>(this.page, '#itm_12_1')
    o12_3 = new Element.Select<ProblemsMissingAnswer>(this.page, '#itm_12_3')
    o12_4 = new Element.Select<ProblemsMissingAnswer>(this.page, '#itm_12_4')
    o12_5 = new Element.Select<ProblemsMissingAnswer>(this.page, '#itm_12_5')
    o12_6 = new Element.Select<ProblemsMissingAnswer>(this.page, '#itm_12_6')
    o12_8 = new Element.Select<'' | '0-Very motivated' | '1-Quite motivated' | '2-Not at all'>(this.page, '#itm_12_8')
    o12_9 = new Element.Select<ProblemsMissingAnswer>(this.page, '#itm_12_9')
    identifyIssues = new Element.Textbox(this.page, '#textarea_12_97')
    linkedToRisk = new Element.Select(this.page, '#itm_12_98')
    linkedToBehaviour = new Element.Select(this.page, '#itm_12_99')


    async populateNoIssues(suppressLog: boolean = false) {

        if (!suppressLog) log('Populating section 12 - no issues')
        await this.goto(true)
        await this.noIssues.click()
        await this.identifyIssues.setValue('Section 12 no issues')
    }

    async populateFull(maxStrings: boolean = false) {

        log('Fully populating section 12')
        await this.goto(true)
        await this.o12_1.setValue('2-Significant problems')
        await this.o12_3.setValue('2-Significant problems')
        await this.o12_4.setValue('2-Significant problems')
        await this.o12_5.setValue('2-Significant problems')
        await this.o12_6.setValue('2-Significant problems')
        await this.o12_8.setValue('2-Not at all')
        await this.o12_9.setValue('2-Significant problems')
        await this.identifyIssues.setValue(maxStrings ? utils.oasysString(4000) : 'Section 12 issues')
        await this.linkedToRisk.setValue('Yes')
        await this.linkedToBehaviour.setValue('Yes')
    }
}


