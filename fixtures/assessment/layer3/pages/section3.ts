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
}


