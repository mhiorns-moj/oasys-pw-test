

export function contributor1(maxStrings: boolean = false) {

    const page = new oasys.Pages.SentencePlan.ContributorDetails().goto(true)
    page.contributorName.setValue(maxStrings ? utils.oasysString(100) : 'Contributor 1')
    page.role.setValue(maxStrings ? utils.oasysString(256) : `First contributor's role`)
    page.attendBoard.setValue('Yes')
    page.save.click()
    page.close.click()
}

export function contributor2(maxStrings: boolean = false) {

    const page = new oasys.Pages.SentencePlan.ContributorDetails().goto(true)
    page.contributorName.setValue(maxStrings ? utils.oasysString(100) : 'Contributor 2')
    page.role.setValue(maxStrings ? utils.oasysString(256) : `Second contributor's role`)
    page.attendBoard.setValue('No')
    page.save.click()
    page.close.click()
}
