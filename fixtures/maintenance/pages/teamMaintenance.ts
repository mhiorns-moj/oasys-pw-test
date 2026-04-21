import { OasysPage, Element } from 'classes'

export class TeamMaintenance extends OasysPage {

    name = 'TeamMaintenance'
    title = 'Team Maintenance'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Team Details' }

    close = new Element.Button(this.page, 'Close')
    selectLau = new Element.Select(this.page, '#P7_LDU')
    newTeam = new Element.Button(this.page, 'New Team')
    search = new Element.Button(this.page, 'Search')
    teamNameColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Team Name')
    activeColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Active')
}
