import { OasysPage, Element } from 'classes'

export class RsrConfirm extends OasysPage {

    name = 'RsrConfirm'

    ok = new Element.Button(this.page, 'OK')
    cancel = new Element.Button(this.page, 'Cancel')
    rsrDetails = new Element.Text(this.page, '#P3_RSR_ALERT_DISPLAY')
}
