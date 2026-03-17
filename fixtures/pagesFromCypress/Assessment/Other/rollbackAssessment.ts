import { OasysPage, Element } from 'classes'

export class RollbackAssessment extends OasysPage {

    name = 'RollbackAssessment'
    title = 'Administration Functions - Assessment Rollback'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Rollback Assessment' }

    enterAComment = new Element.Textbox(this.page, '#P7_USER_COMMENTS')
    ok = new Element.Button(this.page, 'OK')
    cancel = new Element.Button(this.page, 'Cancel')
    rollbackAssessmentAndCourtReport = new Element.Button(this.page, 'Rollback Assessment and Court Report')
    rollbackAssessment = new Element.Button(this.page, 'Rollback Assessment')
}
