import * as oasys from 'lib'

export function noRisks() {

    const page = new oasys.Pages.Rosh.RoshScreeningSection5().goto(true)
    page.r5_1.setValue('No')
}

export function fullyPopulated() {

    const page = new oasys.Pages.Rosh.RoshScreeningSection5().goto(true)
    page.r5_1.setValue('Yes')
    page.r5_1t.setValue('This is a really bad offender')
}