import { BaseAssessmentPage, Element } from 'classes'

export class FullAnalysisSection62 extends BaseAssessmentPage {

    name = 'FullAnalysisSection62'
    title = 'Risk of Serious Harm Full Analysis'
    menu: Menu = { type: 'Floating', level1: 'RoSH Full Analysis', level2: 'Section 6.2' }

    harmfulBehaviours = new Element.Textbox(this.page, '#textarea_FA61')
    behaviourPatterns = new Element.Textbox(this.page, '#textarea_FA67')
}
