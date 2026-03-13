import * as oasys from 'lib'


export function noIssues() {

    const page = new oasys.Pages.Assessment.Section11().goto(true)
    page.noIssues.click()
    page.identifyIssues.setValue('Section 11 no issues')
}

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Assessment.Section11().goto(true)
    page.o11_1.setValue('2-Significant problems')
    page.o11_2.setValue('2-Significant problems')
    page.o11_3.setValue('2-Significant problems')
    page.o11_4.setValue('2-Significant problems')
    page.o11_5.setValue('2-Significant problems')
    page.o11_6.setValue('2-Significant problems')
    page.o11_7.setValue('2-Significant problems')
    page.o11_8.setValue('2-Significant problems')
    page.o11_9.setValue('2-Significant problems')
    page.o11_10.setValue('2-Significant problems')
    page.o11_11.setValue('2-Significant problems')
    page.o11_12.setValue('2-Significant problems')
    page.identifyIssues.setValue(maxStrings ? oasys.oasysString(4000) : 'Section 11 issues')
    page.linkedToRisk.setValue('Yes')
    page.linkedToBehaviour.setValue('Yes')
}
