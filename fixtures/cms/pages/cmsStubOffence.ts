import { OasysPage, Element } from 'classes'

export class CmsStubOffence extends OasysPage {

    name = 'CMSStubOffence'
    title = 'Training - CMS Stub'

    close = new Element.Button(this.page, 'Close')
    save = new Element.Button(this.page, 'Save')
    offence = new Element.Textbox(this.page, '#P400_OFFENCE_GROUP_CODE')
    offenceDescription = new Element.Textbox(this.page, '#LOVDSC_P400_OFFENCE_GROUP_CODE')
    subcode = new Element.Textbox(this.page, '#P400_OFFENCE_SUB_CODE')
    subcodeDescription = new Element.Textbox(this.page, '#LOVDSC_P400_OFFENCE_SUB_CODE')
    additionalOffence = new Element.Checkbox(this.page, '#P400_ADDITIONAL_OFFENCE_IND_0')
}
