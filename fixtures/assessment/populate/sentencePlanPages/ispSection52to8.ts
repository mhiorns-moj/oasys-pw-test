import * as oasys from 'lib'
import * as ContributorDetails from './contributorDetails'


export function minimal() {

    const page = new oasys.Pages.SentencePlan.IspSection52to8().goto(true)
    page.agreeWithPlan.setValue('Yes')
}

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.SentencePlan.IspSection52to8().goto(true)
    page.liaisonArrangements.setValue(maxStrings ? oasys.oasysString(4000) : 'Liaison arrangements')
    page.supervisionArrangements.setValue(maxStrings ? oasys.oasysString(4000) : 'Supervision arrangements')
    page.agreeWithPlan.setValue('No')
    page.whyNotAgree.setValue(maxStrings ? oasys.oasysString(4000) : 'Why not agree')
    page.offenderComments.setValue(maxStrings ? oasys.oasysString(4000) : 'Offender comments')
    page.offenderSigned.setValue('Yes')
    page.dateSigned.setValue({})
    page.assessorComments.setValue(maxStrings ? oasys.oasysString(4000) : 'Assessor comments')
    page.position.setValue(maxStrings ? oasys.oasysString(32) : 'Position')
    page.publicProtectionConference.setValue('Yes')
    page.conferenceDate.setValue({ days: -10 })
    page.conferenceChair.setValue(maxStrings ? oasys.oasysString(100) : 'Protection board chair')
    page.dateAssessmentSent.setValue({})

    ContributorDetails.contributor1(maxStrings)
    ContributorDetails.contributor2(maxStrings)
}