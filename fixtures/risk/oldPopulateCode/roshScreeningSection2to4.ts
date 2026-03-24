import * as oasys from 'lib'

export function noRisks(withRationale: boolean = false) {

    const page = new oasys.Pages.Rosh.RoshScreeningSection2to4().goto(true)
    page.r2_3.setValue('No')
    if (withRationale) {
        page.rationale.setValue('R2.3 rationale text')
    }
    page.r3_1.setValue('No')
    page.r3_2.setValue('No')
    page.r3_3.setValue('No')
    page.r3_4.setValue('No')
    page.r4_1.setValue('No')
    page.r4_6.setValue('No')
    page.r4_4.setValue('No')
}

export function fullyPopulated() {

    const page = new oasys.Pages.Rosh.RoshScreeningSection2to4().goto(true)
    page.r2_3.setValue('Yes')
    page.r2_4_1.setValue('Yes')
    page.r2_4_2.setValue('Yes')
    page.r3_1.setValue('Yes')
    page.r3_2.setValue('Yes')
    page.r3_3.setValue('Yes')
    page.r3_4.setValue('Yes')
    page.r4_1.setValue('Yes')
    page.r4_6.setValue('Yes')
    page.r4_4.setValue('Yes')
}