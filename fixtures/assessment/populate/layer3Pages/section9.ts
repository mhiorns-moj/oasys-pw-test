import * as oasys from 'lib'


export function noIssues() {

    const page = new oasys.Pages.Assessment.Section9().goto(true)
    page.noIssues.click()
    page.identifyIssues.setValue('Section 9 no issues')
}

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Assessment.Section9().goto(true)
    page.o9_1.setValue('2-Significant problems')
    page.o9_1Details.setValue(maxStrings ? oasys.oasysString(4000) : '9.1 Details')
    page.o9_2.setValue('2-Significant problems')
    page.o9_3.setValue('2-Significant problems')
    page.o9_4.setValue('Yes')
    page.o9_5.setValue('2-Significant problems')
    page.identifyIssues.setValue(maxStrings ? oasys.oasysString(4000) : 'Section 9 issues')
    page.linkedToRisk.setValue('Yes')
    page.linkedToBehaviour.setValue('Yes')
}
