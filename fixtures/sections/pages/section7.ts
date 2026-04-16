import { BaseAssessmentPage, Element } from 'classes'

export class Section7 extends BaseAssessmentPage {

    name = 'Section7'
    title = '7 - Lifestyle and Associates'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '7 - Lifestyle & Associates' }

    noIssues = new Element.Button(this.page, 'No Issues')
    o7_1 = new Element.Select(this.page, '#itm_7_1')
    o7_2 = new Element.Select(this.page, '#itm_7_2')
    o7_3 = new Element.Select(this.page, '#itm_7_3')
    o7_4 = new Element.Select(this.page, '#itm_7_4')
    o7_5 = new Element.Select(this.page, '#itm_7_5')
    identifyIssues = new Element.Textbox(this.page, '#textarea_7_97')
    linkedToRisk = new Element.Select(this.page, '#itm_7_98')
    linkedToBehaviour = new Element.Select(this.page, '#itm_7_99')


    async populateNoIssues(suppressLog: boolean = false) {

        if (!suppressLog) log('Populating section 7 - no issues')
        await this.goto(true)
        await this.noIssues.click()
        await this.identifyIssues.setValue('Section 7 no issues')
    }

    async populateFull(maxStrings: boolean = false) {

        log('Fully populating section 7')
        await this.goto(true)
        await this.o7_1.setValue('2-Significant problems')
        await this.o7_2.setValue('2-Significant problems')
        await this.o7_3.setValue('2-Significant problems')
        await this.o7_4.setValue('2-Significant problems')
        await this.o7_5.setValue('2-Significant problems')
        await this.identifyIssues.setValue(maxStrings ? utils.oasysString(4000) : 'Section 7 issues')
        await this.linkedToRisk.setValue('Yes')
        await this.linkedToBehaviour.setValue('Yes')
    }
}


