import { OasysPage, Element } from 'classes'

export class ReverseDeletion extends OasysPage {

    name = 'ReverseDeletion'
    title = 'Reverse Deletion'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Reverse Deletions' }

    type = new Element.Select<'Assessment' | 'Basic Custody Screening' | 'INTBDTTO' | 'Offender' | 'Sub Assessment - RM2000' | 'Sub Assessment - SARA'>('#P10_ACTION')
    offenderSearch = new Element.Textbox(this.page, '#P10_OFFENDER_SEARCH')
    offender = new Element.Lov(this.page, '#P10_OFFENDER_LABEL')
    assessment = new Element.Lov(this.page, '#P10_ASSESSMENT_LABEL')
    reason = new Element.Textbox(this.page, '#P10_SIGNING_COMMENTS')
    ok = new Element.Button(this.page, 'OK')
    cancel = new Element.Button(this.page, 'Cancel')
}
