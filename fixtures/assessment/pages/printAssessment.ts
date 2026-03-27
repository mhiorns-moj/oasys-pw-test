import { OasysPage, Element } from 'classes'

export class PrintAssessment extends OasysPage {

    name = 'PrintAssessment'

    menu: Menu = { type: 'Subform', level1: 'Print' }

    allSections = new Element.Checkbox(this.page, `tr:has-text('ALL Assessment Sections') > td > input`)
    caseId = new Element.Checkbox(this.page, `tr:has-text('Case ID') > td > input`)
    section1 = new Element.Checkbox(this.page, `tr:has-text('1 - Offending Information') > td > input`)
    section2 = new Element.Checkbox(this.page, `tr:has-text('2 - Analysis of Offences') > td > input`)
    section3 = new Element.Checkbox(this.page, `tr:has-text('3 - Accommodation') > td > input`)
    section4 = new Element.Checkbox(this.page, `tr:has-text('4 - Education, Training and Employability') > td > input`)
    section5 = new Element.Checkbox(this.page, `tr:has-text('5 - Financial Management and Income') > td > input`)
    section6 = new Element.Checkbox(this.page, `tr:has-text('6 - Relationships') > td > input`)
    section7 = new Element.Checkbox(this.page, `tr:has-text('7 - Lifestyle and Associates') > td > input`)
    section8 = new Element.Checkbox(this.page, `tr:has-text('8 - Drug Misuse') > td > input`)
    section9 = new Element.Checkbox(this.page, `tr:has-text('9 - Alcohol Misuse') > td > input`)
    section10 = new Element.Checkbox(this.page, `tr:has-text('10 - Emotional Well-being') > td > input`)
    section11 = new Element.Checkbox(this.page, `tr:has-text('11 - Thinking and Behaviour') > td > input`)
    section12 = new Element.Checkbox(this.page, `tr:has-text('12 - Attitudes') > td > input`)
    section13 = new Element.Checkbox(this.page, `tr:has-text('13 - Health and Other Considerations') > td > input`)
    selfAssessmentForm = new Element.Checkbox(this.page, `tr:has-text('Self Assessment Form') > td > input`)
    roshScreening = new Element.Checkbox(this.page, `tr:has-text('Risk of Serious Harm Screening') > td > input`)
    roshFullAnalysis = new Element.Checkbox(this.page, `tr:has-text('RoSH Full Analysis') > td > input`)
    roshSummary = new Element.Checkbox(this.page, `tr:has-text('Risk of Serious Harm Summary') > td > input`)
    riskManagementPlan = new Element.Checkbox(this.page, `tr:has-text('Risk Management Plan') > td > input`)
    summarySheet = new Element.Checkbox(this.page, `tr:has-text('Summary Sheet') > td > input`)
    initialSentencePlan = new Element.Checkbox(this.page, `tr:has-text('Initial Sentence Plan') > td > input`)
    reviewSentencePlan = new Element.Checkbox(this.page, `tr:has-text('Review Sentence Plan') > td > input`)
    basicSentencePlan = new Element.Checkbox(this.page, `tr:has-text('Basic Sentence Plan') > td > input`)
    print = new Element.Button(this.page, 'Print')
    cancel = new Element.Button(this.page, 'Cancel')
}
