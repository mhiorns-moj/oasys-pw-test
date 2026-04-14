import { OasysPage, Element } from 'classes'

export class AdditionalOffences extends OasysPage {

    name = 'AdditionalOffences'
    title = 'Add Offence'
    menu: Menu = { type: 'Subform', level1: 'Add Additional Offences' }

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    offence = new Element.Textbox(this.page, '#P5_CT_OFFENCE_CODE_TEXT')
    offenceDescription = new Element.Textbox(this.page, '#LOVDSC_P5_CT_OFFENCE_CODE_TEXT')
    subcode = new Element.Textbox(this.page, '#P5_CT_OFFENCE_SUBCODE_TEXT')
    subcodeDescription = new Element.Textbox(this.page, '#LOVDSC_P5_CT_OFFENCE_SUBCODE_TEXT')
    count = new Element.Textbox(this.page, '#P5_COUNT_OF_OFFENCES')
}
