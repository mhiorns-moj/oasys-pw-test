import { OasysPage, Element } from 'classes'

export class RollbackSara extends OasysPage {

    name = 'RollbackSARA'
    title = 'Administration Functions - SARA Rollback'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Rollback SARA' }

    message = new Element.Text(this.page, "this.page will rollback the SARA signing information. Click 'OK' to continue with the SARA rollback, otherwise click 'Cancel'.")
    ok = new Element.Button(this.page, 'OK')
    cancel = new Element.Button(this.page, 'Cancel')
    rollbackAssessmentMessage = new Element.Text(this.page, 'If you wish to rollback this.page SARA, you must first rollback the OASys assessment')
}
