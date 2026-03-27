

export function noIssues() {

    const page = new oasys.Pages.Assessment.Section7().goto(true)
    page.noIssues.click()
    page.identifyIssues.setValue('Section 7 no issues')
}

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Assessment.Section7().goto(true)
    page.o7_1.setValue('2-Significant problems')
    page.o7_2.setValue('2-Significant problems')
    page.o7_3.setValue('2-Significant problems')
    page.o7_4.setValue('2-Significant problems')
    page.o7_5.setValue('2-Significant problems')
    page.identifyIssues.setValue(maxStrings ? utils.oasysString(4000) : 'Section 7 issues')
    page.linkedToRisk.setValue('Yes')
    page.linkedToBehaviour.setValue('Yes')
}
