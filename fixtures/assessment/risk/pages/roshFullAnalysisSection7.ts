import { BaseAssessmentPage, Element } from 'classes'
import * as lib from 'lib'

export class RoshFullAnalysisSection7 extends BaseAssessmentPage {

    name = 'RoshFullAnalysisSection7'
    title = 'Risk of Serious Harm Full Analysis'
    menu: Menu = { type: 'Floating', level1: 'RoSH Full Analysis', level2: 'Section 7' }

    EnterChildDetails = new Element.Button(this.page, 'Enter Child Details')
}
