

export function programme1() {

    const page = new oasys.Pages.SentencePlan.AccreditedProgramme().goto(true)
    page.programmeAttended.setValue('One to One Programme')
    page.completed.setValue('Yes')
    page.objectivesAchieved.setValue('Fully achieved')
    page.reportAvailable.setValue('No')
    page.save.click()
    page.close.click()
}

export function programme2() {

    const page = new oasys.Pages.SentencePlan.AccreditedProgramme().goto(true)
    page.programmeAttended.setValue('Aggression Replacement Training (ART)')
    page.completed.setValue('No')
    page.objectivesAchieved.setValue('Partly achieved')
    page.reportAvailable.setValue('Yes')
    page.save.click()
    page.close.click()
}
