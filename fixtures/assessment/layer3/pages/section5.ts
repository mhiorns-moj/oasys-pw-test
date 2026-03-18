import { BaseAssessmentPage, Element } from 'classes'
import * as lib from 'lib'

export class Section5 extends BaseAssessmentPage {

    name = 'Section5'
    title = '5 - Financial Management and Income'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '5 - Finance' }

    noIssues = new Element.Button(this.page, 'No Issues')
    o5_2 = new Element.Select(this.page, '#itm_5_2')
    o5_3 = new Element.Select(this.page, '#itm_5_3')
    o5_4 = new Element.Select(this.page, '#itm_5_4')
    o5_5 = new Element.Select(this.page, '#itm_5_5')
    o5_6 = new Element.Select(this.page, '#itm_5_6')
    identifyIssues = new Element.Textbox(this.page, '#textarea_5_97')
    linkedToRisk = new Element.Select(this.page, '#itm_5_98')
    linkedToBehaviour = new Element.Select(this.page, '#itm_5_99')


    async populateNoIssues(suppressLog: boolean = false) {

        if (!suppressLog) lib.log('Populating section 5 - no issues')
        await this.goto(true)
        await this.noIssues.click()
        await this.identifyIssues.setValue('Section 5 no issues')
    }
}


