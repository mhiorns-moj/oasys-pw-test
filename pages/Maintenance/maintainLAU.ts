import { OasysPage, Element } from 'classes'

export class MaintainLau extends OasysPage {

    name = 'MaintainLau'
    title = 'Maintain LAU'

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    lauName = new Element.Textbox(this.page, '#P10_DIVISION_NAME')
    status = new Element.Radiogroup('#P10_ACTIVE')
}
