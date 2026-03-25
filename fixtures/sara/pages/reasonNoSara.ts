import { OasysPage, Element } from 'classes'

export class ReasonNoSara extends OasysPage {

    name = 'ReasonNoSARA'
    menu: Menu = { type: 'Subform', level1: 'Cancel' }

    ok = new Element.Button(this.page, 'Ok')
    cancel = new Element.Button(this.page, 'Cancel')
    reason = new Element.Select<'There was no suitably trained assessor available' | 'There are no indications within the current OASys that a SARA is required e.g. domestic abuse has occurred outside of Intimate Partner Abuse'>(this.page, '#P2_REASON_ELM')
}
