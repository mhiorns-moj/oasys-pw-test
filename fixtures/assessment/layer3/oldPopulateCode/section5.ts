import * as oasys from 'lib'


export function noIssues() {

    const page = new oasys.Pages.Assessment.Section5().goto(true)
    page.noIssues.click()
    page.identifyIssues.setValue('Section 5 no issues')
}

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Assessment.Section5().goto(true)
    page.o5_2.setValue('2-Significant problems')
    page.o5_3.setValue('2-Significant problems')
    page.o5_4.setValue('2-Significant problems')
    page.o5_5.setValue('2-Significant problems')
    page.o5_6.setValue('2-Significant problems')
    page.identifyIssues.setValue(maxStrings ? oasys.oasysString(4000) : 'Section 5 issues')
    page.linkedToRisk.setValue('Yes')
    page.linkedToBehaviour.setValue('Yes')
}
