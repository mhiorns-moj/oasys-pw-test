import { OasysPage, Element } from 'classes'

export class Victim extends OasysPage {

    name = 'Victim'
    menu: Menu = { type: 'Subform', level1: 'Enter Victim Details' }

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    approxAge = new Element.Select(this.page, '#P3_AGE_OF_VICTIM_ELM')
    gender = new Element.Select(this.page, '#P3_GENDER_ELM')
    raceEthnicity = new Element.Select(this.page, '#P3_ETHNIC_CATEGORY_ELM')
    relationship = new Element.Select(this.page, '#P3_VICTIM_RELATION_ELM')
    delete = new Element.Button(this.page, 'Delete')
    addAnotherVictim = new Element.Button(this.page, 'Add Another Victim')
}
