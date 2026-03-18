import * as oasys from 'lib'


export function noIssues() {

    const page = new oasys.Pages.Assessment.Section12().goto(true)
    page.noIssues.click()
    page.identifyIssues.setValue('Section 12 no issues')
}

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Assessment.Section12().goto(true)
    page.o12_1.setValue('2-Significant problems')
    page.o12_3.setValue('2-Significant problems')
    page.o12_4.setValue('2-Significant problems')
    page.o12_5.setValue('2-Significant problems')
    page.o12_6.setValue('2-Significant problems')
    page.o12_8.setValue('2-Not at all')
    page.o12_9.setValue('2-Significant problems')
    page.identifyIssues.setValue(maxStrings ? oasys.oasysString(4000) : 'Section 12 issues')
    page.linkedToRisk.setValue('Yes')
    page.linkedToBehaviour.setValue('Yes')
}
