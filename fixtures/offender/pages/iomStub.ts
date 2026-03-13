import { OasysPage, Element } from 'classes'

export class IomStub extends OasysPage {

    name = 'IOM Stub'

    probationCrn = new Element.Textbox(this.page, '#add-CRN')
    isIom = new Element.Textbox(this.page, '#add-OIM')
    records = new Element.Textbox(this.page, '#add-NUM')
    error = new Element.Select(this.page, '#add-CODE')
    mappa = new Element.Textbox(this.page, '#add-MAPPA')
    add = new Element.Button(this.page, `input[type='submit'][value='Add']`)
}
