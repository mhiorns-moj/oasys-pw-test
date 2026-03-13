import { OasysPage, Element } from 'classes'

export class CountersignatureRequired extends OasysPage {

    name = 'CountersignatureRequired'

    confirm = new Element.Button(this.page, 'Confirm')
    cancel = new Element.Button(this.page, 'Cancel')
    countersigner = new Element.Lov('#P3_COUNTERSIGN_LOV_LABEL')
    comments = new Element.Textbox(this.page, '#P3_ASSESSOR_COMMENTS')
}
