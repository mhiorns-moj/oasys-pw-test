import { OasysPage, Element } from 'classes'

export class MarkAssessmentHistoric extends OasysPage {

    name = 'MarkAssessmenthis.pagetoric'
    title = 'Administration Functions - Mark Assessment Historic'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Mark Assessments as Historic' }

    ok = new Element.Button(this.page, 'OK')
    cancel = new Element.Button(this.page, 'Cancel')
}
