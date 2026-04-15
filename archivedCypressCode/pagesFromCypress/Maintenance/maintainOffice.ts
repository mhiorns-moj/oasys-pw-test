import { OasysPage, Element } from 'classes'

export class MaintainOffice extends OasysPage {

    name = 'MaintainOffice'
    title = 'Maintain Office'

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    officeName = new Element.Textbox(this.page, '#P10_OFFICE_NAME')
    officeAddressLine1 = new Element.Textbox(this.page, '#P10_OFFICE_ADDRESS_LINE_1')
    officeAddressLine2 = new Element.Textbox(this.page, '#P10_OFFICE_ADDRESS_LINE_2')
    officeAddressLine3 = new Element.Textbox(this.page, '#P10_OFFICE_ADDRESS_LINE_3')
    officeAddressLine4 = new Element.Textbox(this.page, '#P10_OFFICE_ADDRESS_LINE_4')
    officePostcode = new Element.Textbox(this.page, '#P10_OFFICE_POSTCODE')
    officeTelephone = new Element.Textbox(this.page, '#P10_OFFICE_TELEPHONE')
    officeFax = new Element.Textbox(this.page, '#P10_OFFICE_FAX')
    status = new Element.Radiogroup(this.page, '#P10_ACTIVE')
}
