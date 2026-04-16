import { OasysPage, Element } from 'classes'

export class Lao extends OasysPage {

    name = 'Lao'
    title = 'Limited Access Offender'
    menu: Menu = { type: 'Subform', level1: 'LAO' }

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    setLaoStatus = new Element.Select(this.page, '#P90_LAO_STATUS')
    providerEstLocation = new Element.Select(this.page, '#P90_CT_AREA_EST_CODE')
    lau = new Element.Select(this.page, '#P90_DIVISION_CODE')
    team = new Element.Select(this.page, '#P90_TEAM_CODE')
    laoReaders = new Element.Shuttle(this.page, 'OFF030_USERS')
}
