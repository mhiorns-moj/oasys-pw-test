import { OasysPage, Element } from 'classes'

export class CrnAmendment extends OasysPage {

    name = 'CRNAmendment'

    probationCrn = new Element.Textbox(this.page, '#P2_CRN')
    ok = new Element.Button(this.page, 'OK')
    cancel = new Element.Button(this.page, 'Cancel')
}
