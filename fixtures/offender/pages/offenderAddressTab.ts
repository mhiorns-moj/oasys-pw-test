import { OasysPage, Element } from 'classes'

export class OffenderAddressTab extends OasysPage {

    name = 'OffenderAddressTab'

    noFixedAbode = new Element.Checkbox(this.page, '#P10_NFA_IND_0')
    aptFlatNumber = new Element.Textbox(this.page, '#P10_ADDRESS_LINE_1')
    premisesNameNumber = new Element.Textbox(this.page, '#P10_ADDRESS_LINE_2')
    street = new Element.Textbox(this.page, '#P10_ADDRESS_LINE_3')
    locality = new Element.Textbox(this.page, '#P10_ADDRESS_LINE_4')
    town = new Element.Textbox(this.page, '#P10_ADDRESS_LINE_5')
    county = new Element.Textbox(this.page, '#P10_ADDRESS_LINE_6')
    postcode = new Element.Textbox(this.page, '#P10_ADDRESS_POSTCODE')
    telephone = new Element.Textbox(this.page, '#P10_TELEPHONE_NUMBER')
    localAuthority = new Element.Select(this.page, '#P10_LOCAL_AUTHORITY_ELM')
}
