import { OasysPage, Element } from 'classes'

export class MaintainUser extends OasysPage {

    name = 'MaintainUser'
    title = 'Maintain User'

    disableAccount = new Element.Button(this.page, 'Disable Account')
    password = new Element.Button(this.page, 'Password')
    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    userName = new Element.Textbox(this.page, '#P8_OASYS_USER_CODE')
    surname = new Element.Textbox(this.page, '#P8_USER_FAMILY_NAME')
    forename1 = new Element.Textbox(this.page, '#P8_USER_FORENAME_1')
    forename2 = new Element.Textbox(this.page, '#P8_USER_FORENAME_2')
    emailAddress = new Element.Textbox(this.page, '#P8_EMAIL_ADDRESS')
    excludeFromAutomaticDisabling = new Element.Checkbox(this.page, '#P8_EXCL_DEACT_IND_0')
    dragon = new Element.Checkbox(this.page, '#P8_AT_SOFTWARE_0')
    jaws = new Element.Checkbox(this.page, '#P8_AT_SOFTWARE_1')
    readAndWrite = new Element.Checkbox(this.page, '#P8_AT_SOFTWARE_2')
    zoomtext = new Element.Checkbox(this.page, '#P8_AT_SOFTWARE_3')
}
