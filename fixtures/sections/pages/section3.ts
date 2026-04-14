import { BaseAssessmentPage, Element } from 'classes'

export class Section3 extends BaseAssessmentPage {

    name = 'Section3'
    title = '3 - Accommodation'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '3 - Accommodation' }

    noIssues = new Element.Button(this.page, 'No Issues')
    /** No fixed abode */
    o3_3 = new Element.Select<YesNoMissingAnswer>(this.page, '#itm_3_3')
    /** Suitability of accommodation */
    o3_4 = new Element.Select<ProblemsMissingAnswer>(this.page, '#itm_3_4')
    /** Permanence of accommodation*/
    o3_5 = new Element.Select<ProblemsMissingAnswer>(this.page, '#itm_3_5')
    /** Suitability of location */
    o3_6 = new Element.Select<ProblemsMissingAnswer>(this.page, '#itm_3_6')
    identifyIssues = new Element.Textbox(this.page, '#textarea_3_97')
    linkedToRisk = new Element.Select(this.page, '#itm_3_98')
    linkedToBehaviour = new Element.Select(this.page, '#itm_3_99')


    async populateNoIssues(suppressLog: boolean = false) {

        if (!suppressLog) log('Populating section 3 - no issues')
        await this.goto(true)
        await this.noIssues.click()
        await this.identifyIssues.setValue('Section 3 no issues')
    }

    async populateFull(maxStrings: boolean = false) {

        log('Fully populating section 3')
        await this.goto(true)
        await this.o3_3.setValue('Yes')
        await this.o3_4.setValue('2-Significant problems')
        await this.o3_5.setValue('2-Significant problems')
        await this.o3_6.setValue('2-Significant problems')
        await this.identifyIssues.setValue(maxStrings ? utils.oasysString(4000) : 'Section 3 issues')
        await this.linkedToRisk.setValue('Yes')
        await this.linkedToBehaviour.setValue('Yes')
    }
}


