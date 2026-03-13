import { OasysPage, Element } from 'classes'

export class Rfis extends OasysPage {

    name = 'Rfis'
    rfis = new RfisTable('R2730113476062641', 'RFIs')
    menu: Menu = { type: 'Subform', level1: '#BT_RFI1' }
}

export class RfisTable extends Element.Table {

    requesterName = new Element.Column(this.page, Element.ColumnType.Column, `#REQUESTOR_OASYS_USER_CODE_DESC_${this.page.id}`, this.page.id)
    dateRequestMade = new Element.Column(this.page, Element.ColumnType.Column, `#DATE_REQUEST_MADE_${this.page.id}`, this.page.id)
    internalRecipient = new Element.Column(this.page, Element.ColumnType.Column, `#RESPONDER_OASYS_USER_CODE_DESC_${this.page.id}`, this.page.id)
    lau = new Element.Column(this.page, Element.ColumnType.Column, `#RESPONDER_DIVISION_CODE_DESC_${this.page.id}`, this.page.id)
    team = new Element.Column(this.page, Element.ColumnType.Column, `#RESPONDER_TEAM_CODE_DESC_${this.page.id}`, this.page.id)
    externalRecipient = new Element.Column(this.page, Element.ColumnType.Column, `#RESPONDER_EXTERNAL_USER_DESC_${this.page.id}`, this.page.id)
    source = new Element.Column(this.page, Element.ColumnType.Column, `#RFI_TYPE_ELM_DESC_${this.page.id}`, this.page.id)
    typeOfRequest = new Element.Column(this.page, Element.ColumnType.Column, `#PURPOSE_ASSESSMENT_ELM_DESC_${this.page.id}`, this.page.id)
    status = new Element.Column(this.page, Element.ColumnType.Column, `#RESPONSE_STATUS_ELM_DESC_${this.page.id}`, this.page.id)
}

