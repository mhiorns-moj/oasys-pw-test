import { OasysPage, Element } from 'classes'

export class MaintainTeam extends OasysPage {

    name = 'MaintainTeam'
    title = 'Maintain Team'

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    lAU = new Element.Select(this.page, '#P10_DIVISION_CODE')
    teamName = new Element.Textbox(this.page, '#P10_TEAM_NAME')
    contactTelephoneNumber = new Element.Textbox(this.page, '#P10_CONTACT_NUMBER')
    emailAddress = new Element.Textbox(this.page, '#P10_EMAIL_ADDRESS')
    status = new Element.Radiogroup(this.page, '#P10_ACTIVE')
    usersInTeam = new Element.Shuttle(this.page, '#shuttlePRO040_TEAM')
}
