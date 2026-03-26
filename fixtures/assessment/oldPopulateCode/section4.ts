
export function noIssues() {

    const page = new oasys.Pages.Assessment.Section4().goto(true)
    page.noIssues.click()
    page.identifyIssues.setValue('Section 4 no issues')
}

export function fullyPopulated(params: PopulateAssessmentParams) {

    const page = new oasys.Pages.Assessment.Section4().goto(true)
    page.o4_2.setValue('2 - Yes')
    page.o4_3.setValue('2-Significant problems')
    page.o4_4.setValue('2-Significant problems')
    page.o4_5.setValue('2-Significant problems')
    page.o4_6.setValue('2-Significant problems')
    page.o4_7.setValue('2-Significant problems')
    page.o4_7Reading.setValue(true)
    page.o4_7Writing.setValue(true)
    page.o4_7Numeracy.setValue(true)
    page.o4_8.setValue('2-Significant problems')
    page.o4_9.setValue('2 - No qualifications')
    page.o4_10.setValue('2-Significant problems')
    if (params.provider == 'pris') {
        page.basicSkillsScore.setValue('8')
    } else {
        page.skillsCheckerScore.setValue('40-59')
    }
    page.identifyIssues.setValue(params.maxStrings ? utils.oasysString(4000) : 'Section 4 issues')
    page.linkedToRisk.setValue('Yes')
    page.linkedToBehaviour.setValue('Yes')
}
