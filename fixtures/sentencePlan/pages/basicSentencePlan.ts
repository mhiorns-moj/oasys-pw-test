import { OasysPage, Element } from 'classes'

export class BasicSentencePlan extends OasysPage {

    name = 'BasicSentencePlan'
    title = 'Basic Sentence Plan'
    menu: Menu = { type: 'Floating', level1: 'Basic Sentence Plan' }

    signAndLock = new Element.Button(this.page, 'Sign & Lock')
    countersign = new Element.Button(this.page, 'Countersign')
    countersignOverview = new Element.Button(this.page, 'Countersign Overview')
    printSentencePlan = new Element.Button(this.page, 'Print Sentence Plan')
    typeOfAssessment = new Element.Select(this.page, '#itm_BSP_1')
    transferDate = new Element.Textbox<OasysDate>(this.page, '#itm_BSP_2', true)
    terminationDate = new Element.Textbox<OasysDate>(this.page, '#itm_BSP_3', true)
    addAnotherObjective = new Element.Button(this.page, 'Add Another Objective')
    comments = new Element.Textbox(this.page, '#textarea_BSP_4')
}
