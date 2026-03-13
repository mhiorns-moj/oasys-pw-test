import { OasysPage, Element } from 'classes'

export class AddRole extends OasysPage {

    name = 'AddRole'
    title = 'Add Role'

    roleName = new Element.Textbox(this.page, '#P10_REF_ROLE_DESC')
    copyFunctionsFromRole = new Element.Select(this.page, '#P10_SELECT_ROLE')
    close = new Element.Button(this.page, 'Close')
    save = new Element.Button(this.page, 'Save')
}
