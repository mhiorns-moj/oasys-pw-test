import { BaseAssessmentPage, Element } from 'classes'
import * as lib from 'lib'

export class Section4 extends BaseAssessmentPage {

    name = 'Section4'
    title = '4 - Education, Training and Employability'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '4 - ETE' }

    noIssues = new Element.Button(this.page, 'No Issues')
    o4_2 = new Element.Select(this.page, '#itm_4_2')
    o4_3 = new Element.Select(this.page, '#itm_4_3')
    o4_4 = new Element.Select(this.page, '#itm_4_4')
    o4_5 = new Element.Select(this.page, '#itm_4_5')
    o4_6 = new Element.Select(this.page, '#itm_4_6')
    o4_7 = new Element.Select(this.page, '#itm_4_7')
    o4_7Reading = new Element.Checkbox(this.page, '#itm_4_7_1_READING')
    o4_7Writing = new Element.Checkbox(this.page, '#itm_4_7_1_WRITING')
    o4_7Numeracy = new Element.Checkbox(this.page, '#itm_4_7_1_NUMERACY')
    o4_8 = new Element.Select(this.page, '#itm_4_8')
    o4_9 = new Element.Select(this.page, '#itm_4_9')
    o4_10 = new Element.Select(this.page, '#itm_4_10')
    skillsCheckerTool = new Element.Button(this.page, 'Skills Checker Tool')
    skillsCheckerScore = new Element.Select(this.page, '#itm_4_92')
    basicSkillsScore = new Element.Select(this.page, '#itm_4_90')
    identifyIssues = new Element.Textbox(this.page, '#textarea_4_94')
    linkedToRisk = new Element.Select(this.page, '#itm_4_96')
    linkedToBehaviour = new Element.Select(this.page, '#itm_4_98')


    async populateNoIssues(suppressLog: boolean = false) {

        if (!suppressLog) log('Populating section 4 - no issues')
        await this.goto(true)
        await this.noIssues.click()
        await this.identifyIssues.setValue('Section 4 no issues')
    }
}


