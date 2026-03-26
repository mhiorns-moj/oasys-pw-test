import * as ContributorDetails from './contributorDetails'


export function minimal() {

    const page = new oasys.Pages.SentencePlan.IspSection52to8().goto(true)
    page.agreeWithPlan.setValue('Yes')
}

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.SentencePlan.IspSection52to8().goto(true)
    page.liaisonArrangements.setValue(maxStrings ? utils.oasysString(4000) : 'Liaison arrangements')
    page.supervisionArrangements.setValue(maxStrings ? utils.oasysString(4000) : 'Supervision arrangements')
    page.agreeWithPlan.setValue('No')
    page.whyNotAgree.setValue(maxStrings ? utils.oasysString(4000) : 'Why not agree')
    page.offenderComments.setValue(maxStrings ? utils.oasysString(4000) : 'Offender comments')
    page.offenderSigned.setValue('Yes')
    page.dateSigned.setValue({})
    page.assessorComments.setValue(maxStrings ? utils.oasysString(4000) : 'Assessor comments')
    page.position.setValue(maxStrings ? utils.oasysString(32) : 'Position')
    page.publicProtectionConference.setValue('Yes')
    page.conferenceDate.setValue({ days: -10 })
    page.conferenceChair.setValue(maxStrings ? utils.oasysString(100) : 'Protection board chair')
    page.dateAssessmentSent.setValue({})

    ContributorDetails.contributor1(maxStrings)
    ContributorDetails.contributor2(maxStrings)
}