import * as oasys from 'lib'

export function victim1() {

    const page = new oasys.Pages.Assessment.Other.Victim().goto(true)
    page.approxAge.setValue('5-11')
    page.gender.setValue('Male')
    page.raceEthnicity.setValue('White - Irish')
    page.relationship.setValue('Son/Daughter - child')
    page.save.click()
    page.close.click()
}

export function victim2() {

    const page = new oasys.Pages.Assessment.Other.Victim().goto(true)
    page.approxAge.setValue('21-25')
    page.gender.setValue('Female')
    page.raceEthnicity.setValue('Not stated')
    page.relationship.setValue('Ex-partner')
    page.save.click()
    page.close.click()
}