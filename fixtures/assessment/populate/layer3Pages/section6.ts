import * as oasys from 'lib'


export function noIssues(populate6_11?: 'Yes' | 'No') {

    const page = new oasys.Pages.Assessment.Section6().goto(true)
    page.noIssues.click()
    if (populate6_11) {
        page.o6_11.setValue(populate6_11)
    }
    page.identifyIssues.setValue('Section 6 no issues')
}

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Assessment.Section6().goto(true)
    page.o6_1.setValue('2-Significant problems')
    page.o6_3.setValue('2-Significant problems')
    page.o6_8.setValue('Not in a relationship')
    page.o6_4.setValue('2-Significant problems')
    page.o6_6.setValue('2-Significant problems')
    // page.o6_7.setValue('Yes')     pre - populated from section 2
    page.o6_7VictimPartner.setValue('Yes')
    page.o6_7VictimFamily.setValue('Yes')
    page.o6_7PerpetratorPartner.setValue('Yes')
    page.o6_7PerpetratorFamily.setValue('Yes')
    page.o6_9.setValue('Yes')
    page.o6_10.setValue('Some problems')
    //page.o6_11.setValue('Yes')    not relevant due to other answers
    page.o6_12.setValue('2-Significant problems')
    page.identifyIssues.setValue(maxStrings ? oasys.oasysString(4000) : 'Section 6 issues')
    page.linkedToRisk.setValue('Yes')
    page.linkedToBehaviour.setValue('Yes')
}
