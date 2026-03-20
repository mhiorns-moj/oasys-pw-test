import { OasysPage, Element } from 'classes'

export class Rfis extends OasysPage {

    name = 'Rfis'
    title = 'RFI'
    rfiTable = new RfisTable(this.page, 'R2730113476062641', 'RFIs')
    menu: Menu = { type: 'Subform', level1: '#BT_RFI1' }
}

export class RfisTable extends Element.Table {

    requesterName = new Element.Column(this.page, Element.ColumnType.Column, `#REQUESTOR_OASYS_USER_CODE_DESC_${this.id}`, this.id)
    dateRequestMade = new Element.Column(this.page, Element.ColumnType.Column, `#DATE_REQUEST_MADE_${this.id}`, this.id)
    internalRecipient = new Element.Column(this.page, Element.ColumnType.Column, `#RESPONDER_OASYS_USER_CODE_DESC_${this.id}`, this.id)
    lau = new Element.Column(this.page, Element.ColumnType.Column, `#RESPONDER_DIVISION_CODE_DESC_${this.id}`, this.id)
    team = new Element.Column(this.page, Element.ColumnType.Column, `#RESPONDER_TEAM_CODE_DESC_${this.id}`, this.id)
    externalRecipient = new Element.Column(this.page, Element.ColumnType.Column, `#RESPONDER_EXTERNAL_USER_DESC_${this.id}`, this.id)
    source = new Element.Column(this.page, Element.ColumnType.Column, `#RFI_TYPE_ELM_DESC_${this.id}`, this.id)
    typeOfRequest = new Element.Column(this.page, Element.ColumnType.Column, `#PURPOSE_ASSESSMENT_ELM_DESC_${this.id}`, this.id)
    status = new Element.Column(this.page, Element.ColumnType.Column, `#RESPONSE_STATUS_ELM_DESC_${this.id}`, this.id)
}

