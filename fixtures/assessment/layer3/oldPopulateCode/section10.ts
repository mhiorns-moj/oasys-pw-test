import * as oasys from 'lib'


export function noIssues() {

    const page = new oasys.Pages.Assessment.Section10().goto(true)
    page.noIssues.click()
    page.identifyIssues.setValue('Section 10 no issues')
}

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Assessment.Section10().goto(true)
    page.o10_1.setValue('2-Significant problems')
    page.o10_2.setValue('2-Significant problems')
    page.o10_3.setValue('2-Significant problems')
    page.o10_4.setValue('2-Significant problems')
    page.o10_5.setValue('Yes - 2')
    page.o10_6.setValue('2-Significant problems')
    page.o10_7Childhood.setValue('Yes')
    page.o10_7HeadInjuries.setValue('Yes')
    page.o10_7Psychiatric.setValue('Yes')
    page.o10_7Medication.setValue('Yes')
    page.o10_7FailedCoOp.setValue('Yes')
    page.o10_7Patient.setValue('Yes')
    page.o10_7Treatment.setValue('Yes')
    page.o10_8.setValue('Yes')
    page.identifyIssues.setValue(maxStrings ? oasys.oasysString(4000) : 'Section 10 issues')
    page.linkedToRisk.setValue('Yes')
    page.linkedToBehaviour.setValue('Yes')
}
