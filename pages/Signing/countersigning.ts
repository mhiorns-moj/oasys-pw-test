import { OasysPage, Element } from 'classes'

export class Countersigning extends OasysPage {

    name = 'Countersigning'
    menu: Menu = { type: 'Subform', level1: 'Countersign' }

    ok = new Element.Button(this.page, 'Ok')
    cancel = new Element.Button(this.page, 'Cancel')
    selectAction = new Element.Select<'Countersign' | 'Reject for Rework'>('#P3_CS_ACTION_LOV')
    comments = new Element.Textbox(this.page, '#P3_COUNTERSIGN_COMMENTS')
}
