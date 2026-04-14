import { test } from 'fixtures'


// First offender has low risks in the SARA

test('NOD-1228', async ({ oasys, offender, assessment, sections, signing }) => {

    await oasys.login(oasys.users.probHeadPdu)

    // Offender 1
    const offender1 = await offender.createProbFromStandardOffender()

    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    oasys.Populate.CommonPages.OffendingInformation.minimal()
    await assessment.populateMinimal({ layer: 'Layer 3', populate6_11: 'No' })

    const section6 = new oasys.Pages.Assessment.Section6().goto()
    section6.o6_1.setValue('Missing')

    await signing.signAndLock({ expectRsrWarning: true, page: oasys.Pages.SentencePlan.IspSection52to8 })

    oasys.Api.testOneOffender(offender1.probationCrn, 'prob', 'probationFailedAlias', false, true)
    cy.get<boolean>('@probationFailedAlias').then((offenderFailed) => {
        expect(offenderFailed).to.be.false
    })

    await oasys.logout()
})
