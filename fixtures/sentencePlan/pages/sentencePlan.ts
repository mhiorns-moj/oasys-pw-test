import { BaseAssessmentPage, Element } from 'classes'

export abstract class SentencePlan extends BaseAssessmentPage {

    signAndLock = new Element.Button(this.page, 'Sign & Lock')
    countersign = new Element.Button(this.page, 'Countersign')
    countersignOverview = new Element.Button(this.page, 'Countersign Overview')
    printSentencePlan = new Element.Button(this.page, 'Print Sentence Plan')
}
