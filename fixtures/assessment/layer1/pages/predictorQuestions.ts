import { BaseAssessmentPage, Element } from 'classes'

export class PredictorQuestions extends BaseAssessmentPage {

    name = 'Predictors RSR'
    title = '1 - RSR Questions'
    menu: Menu = { type: 'Floating', level1: 'Section 1', level2: 'RSR Questions' }

    /**
    *  Is the offender living in suitable accommodation?
    */
    o3_4 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_3_4')
    /**
     *  Is the person unemployed?
     */
    o4_2 = new Element.Select<'0-No' | '0-Not available for work' | '2-Yes' | 'Missing'>(this.page, '#P5_QU_4_2')
    /**
     *  What is the person's current relationship with partner?
     */
    o6_4 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_6_4')
    /**
     *  Is there evidence of current or previous domestic abuse?
     */
    o6_7 = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_6_7DA')
    o6_7VictimPartner = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_6_7_1_1DA')
    o6_7VictimFamily = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_6_7_1_2DA')
    o6_7PerpetratorPartner = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_6_7_2_1DA')
    o6_7PerpetratorFamily = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_6_7_2_2DA')
    /**
     * Is the person's current use of alcohol a problem
     */
    o9_1 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_9_1')
    /**
     * Is there evidence of binge drinking
     */
    o9_2 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_9_2')
    /**
     * Is impulsivity a problem for the offender
     */
    o11_2 = new Element.Select<ProblemsAnswer>(this.page, '#P5_QU_11_2')
    /**
     * Is temper control a problem for the offender
     */
    o11_4 = new Element.Select<ProblemsAnswer>(this.page, '#P5_QU_11_4')
    /**
     * Does the offender have pro-criminal attitudes
     */
    o12_1 = new Element.Select<ProblemsAnswer>(this.page, '#P5_QU_12_1')

}

