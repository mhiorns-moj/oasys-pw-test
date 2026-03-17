import { OasysPage, Element } from 'classes'

export class ContributorDetails extends OasysPage {

    name = 'ContributorDetails'
    menu: Menu = { type: 'Subform', level1: 'Enter Contributor Details' }

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    contributorName = new Element.Textbox(this.page, '#P3_CONTRIBUTOR_NAME')
    role = new Element.Textbox(this.page, '#P3_CONTRIBUTOR_ROLE')
    attendBoard = new Element.Select(this.page, '#P3_SENT_PLAN_BOARD_ATTD_IND')
    delete = new Element.Button(this.page, 'Delete')
    addAnotherContributor = new Element.Button(this.page, 'Add Another Contributor')
}
