import * as oasys from 'lib'


export function noIssues() {

    const page = new oasys.Pages.Assessment.Section3().goto(true)
    page.noIssues.click()
    page.identifyIssues.setValue('Section 3 no issues')
}

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Assessment.Section3().goto(true)
    page.o3_3.setValue('Yes')
    page.o3_4.setValue('2-Significant problems')
    page.o3_5.setValue('2-Significant problems')
    page.o3_6.setValue('2-Significant problems')
    page.identifyIssues.setValue(maxStrings ? oasys.oasysString(4000) : 'Section 3 issues')
    page.linkedToRisk.setValue('Yes')
    page.linkedToBehaviour.setValue('Yes')
}
