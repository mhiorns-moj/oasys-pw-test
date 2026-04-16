import { BaseAssessmentPage, Element } from 'classes'

export class FullAnalysisSection7 extends BaseAssessmentPage {

    name = 'FullAnalysisSection7'
    title = 'Risk of Serious Harm Full Analysis'
    menu: Menu = { type: 'Floating', level1: 'RoSH Full Analysis', level2: 'Section 7' }

    EnterChildDetails = new Element.Button(this.page, 'Enter Child Details')
    
}
