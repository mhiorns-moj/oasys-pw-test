import { OasysPage, Element } from 'classes'

export class CsrpConfirm extends OasysPage {

    name = 'CsrpConfirm'

    ok = new Element.Button(this.page, 'OK')
    cancel = new Element.Button(this.page, 'Cancel')
    csrpDetails = new Element.Text(this.page, '#P3_RSR_ALERT_DISPLAY')
}
