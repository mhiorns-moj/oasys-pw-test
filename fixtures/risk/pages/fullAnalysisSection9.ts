import { BaseAssessmentPage, Element } from 'classes'

export class FullAnalysisSection9 extends BaseAssessmentPage {

    name = 'FullAnalysisSection9'
    title = 'Risk of Serious Harm Full Analysis'
    menu: Menu = { type: 'Floating', level1: 'RoSH Full Analysis', level2: 'Section 9' }

    escapeAnalysis = new Element.Textbox(this.page, '#textarea_FA65')
    disruptionTrustAnalysis = new Element.Textbox(this.page, '#textarea_FA66')
}
