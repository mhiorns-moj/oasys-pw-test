import { OasysPage, Element } from 'classes'

export class DeleteSigningRoleConfirmation extends OasysPage {

    name = 'DeleteSigningRoleConfirmation'
    title = 'Delete Signing Role Confirmation'

    ok = new Element.Button(this.page, 'OK')
    cancel = new Element.Button(this.page, 'Cancel')
}
