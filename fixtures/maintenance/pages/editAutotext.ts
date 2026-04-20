import { OasysPage, Element } from 'classes'

export class EditAutotext extends OasysPage {

    name = 'EditAutotext'
    title = 'Edit Auto Text'

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    autotextType = new Element.Select(this.page, '#P4_PERSONAL_OR_GLOBAL')
    autotext = new Element.Textbox(this.page, '#P4_DISPLAY_TEXT')
}
