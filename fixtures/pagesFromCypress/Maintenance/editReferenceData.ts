import { OasysPage, Element } from 'classes'

export class EditReferenceData extends OasysPage {

    name = 'EditReferenceData'
    title = 'Core Reference Data Maintenance'

    code = new Element.Textbox(this.page, '#P10_REF_ELEMENT_CODE')
    description = new Element.Textbox(this.page, '#P10_REF_ELEMENT_DESC')
    shortDesc = new Element.Textbox(this.page, '#P10_REF_ELEMENT_SHORT_DESC')
    opolCode = new Element.Textbox(this.page, '#P10_REF_ELEMENT_CTID')
    startDate = new Element.Textbox<OasysDate>(this.page, '#P10_START_DATE', true)
    endDate = new Element.Textbox<OasysDate>(this.page, '#P10_END_DATE', true)
    close = new Element.Button(this.page, 'Close')
    save = new Element.Button(this.page, 'Save')
}
