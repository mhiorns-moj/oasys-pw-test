import { OasysPage, Element } from 'classes'

export class PrintAssessment extends OasysPage {

    name = 'PrintAssessment'

    menu: Menu = { type: 'Subform', level1: 'Print' }

    allSections = new Element.Checkbox(`tr:contains('ALL Assessment Sections') > td > input`)
    caseId = new Element.Checkbox(`tr:contains('Case ID') > td > input`)
    section1 = new Element.Checkbox(`tr:contains('1 - Offending Information') > td > input`)
    section2 = new Element.Checkbox(`tr:contains('2 - Analysis of Offences') > td > input`)
    section3 = new Element.Checkbox(`tr:contains('3 - Accommodation') > td > input`)
    section4 = new Element.Checkbox(`tr:contains('4 - Education, Training and Employability') > td > input`)
    section5 = new Element.Checkbox(`tr:contains('5 - Financial Management and Income') > td > input`)
    section6 = new Element.Checkbox(`tr:contains('6 - Relationships') > td > input`)
    section7 = new Element.Checkbox(`tr:contains('7 - Lifestyle and Associates') > td > input`)
    section8 = new Element.Checkbox(`tr:contains('8 - Drug Misuse') > td > input`)
    section9 = new Element.Checkbox(`tr:contains('9 - Alcohol Misuse') > td > input`)
    section10 = new Element.Checkbox(`tr:contains('10 - Emotional Well-being') > td > input`)
    section11 = new Element.Checkbox(`tr:contains('11 - Thinking and Behaviour') > td > input`)
    section12 = new Element.Checkbox(`tr:contains('12 - Attitudes') > td > input`)
    section13 = new Element.Checkbox(`tr:contains('13 - Health and Other Considerations') > td > input`)
    selfAssessmentForm = new Element.Checkbox(`tr:contains('Self Assessment Form') > td > input`)
    roshScreening = new Element.Checkbox(`tr:contains('Risk of Serious Harm Screening') > td > input`)
    roshFullAnalysis = new Element.Checkbox(`tr:contains('RoSH Full Analysis') > td > input`)
    roshSummary = new Element.Checkbox(`tr:contains('Risk of Serious Harm Summary') > td > input`)
    riskManagementPlan = new Element.Checkbox(`tr:contains('Risk Management Plan') > td > input`)
    summarySheet = new Element.Checkbox(`tr:contains('Summary Sheet') > td > input`)
    initialSentencePlan = new Element.Checkbox(`tr:contains('Initial Sentence Plan') > td > input`)
    reviewSentencePlan = new Element.Checkbox(`tr:contains('Review Sentence Plan') > td > input`)
    basicSentencePlan = new Element.Checkbox(`tr:contains('Basic Sentence Plan') > td > input`)
    print = new Element.Button(this.page, 'Print')
    cancel = new Element.Button(this.page, 'Cancel')
}
