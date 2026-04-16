import { OasysPage, Element } from 'classes'

export class CountersigningOverview extends OasysPage {

    name = 'Countersigning overview'
    menu: Menu = { type: 'Subform', level1: 'Countersign Overview' }

    returnToAssessment = new Element.Button(this.page, 'Return to Assessment')
    header = new Element.Text(this.page, '#R2817922970188407 > h2')
    details = new Element.Text(this.page, '#R2817922970188407')
}
