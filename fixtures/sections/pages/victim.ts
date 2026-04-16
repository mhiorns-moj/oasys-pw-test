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


    async victim1() {

        log('Populating victim 1')
        await this.goto(true)
        await this.approxAge.setValue('5-11')
        await this.gender.setValue('Male')
        await this.raceEthnicity.setValue('White - Irish')
        await this.relationship.setValue('Son/Daughter - child')
        await this.save.click()
        await this.close.click()
    }

    async victim2() {

        log('Populating victim 2')
        await this.goto(true)
        await this.approxAge.setValue('21-25')
        await this.gender.setValue('Female')
        await this.raceEthnicity.setValue('Not stated')
        await this.relationship.setValue('Ex-partner')
        await this.save.click()
        await this.close.click()
    }
}
