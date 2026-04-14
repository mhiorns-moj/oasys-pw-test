import { test } from 'fixtures'


// Offender has a completed assessment and incomplete SARA (rejected at S/L) with high/medium

test('NOD-1225', async ({ oasys, offender, assessment, sections, signing }) => {

    await oasys.login(oasys.users.probHeadPdu)

    // Offender 1
    const offender1 = await offender.createProbFromStandardOffender()

    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    oasys.Populate.CommonPages.OffendingInformation.minimal()
    oasys.Populate.Layer3Pages.Predictors.minimal()
    await sections.sections2To13NoIssues({ populate6_11: 'No' })
    await sections.selfAssessmentForm.populateMinimal()
    await risk.screeningNoRisks()

    // Set 6.7 to trigger the SARA
    const section6 = new oasys.Pages.Assessment.Section6().goto()
    section6.o6_7.setValue('Yes')
    section6.o6_7PerpetratorFamily.setValue('No')
    section6.o6_7PerpetratorPartner.setValue('Yes')
    section6.o6_7VictimFamily.setValue('No')
    section6.o6_7VictimPartner.setValue('No')

    const r24 = new oasys.Pages.Rosh.RoshScreeningSection2to4().goto()
    r24.r2_3.setValue('No')
    r24.rationale.setValue('because')


    await oasys.clickButton('Next')
    await oasys.clickButton('Create')

    // Create the SARA and populate the risk flags
    const sara = new oasys.Pages.Sara.Sara().goto()
    sara.riskOfViolencePartner.setValue('High')
    sara.riskOfViolenceOthers.setValue('Medium')
    await oasys.clickButton('Save')

    await oasys.clickButton('Close')

    // Complete the assessment and reject the SARA
    new oasys.Pages.SentencePlan.IspSection52to8().goto().agreeWithPlan.setValue('Yes')
    await oasys.clickButton('Sign & Lock')
    await oasys.clickButton('Continue with Signing')
    new oasys.Pages.Signing.SigningStatus().noSaraReason.setValue('There was no suitably trained assessor available')
    await oasys.clickButton('Continue with Signing')
    await oasys.clickButton('Confirm Sign & Lock')

    oasys.Api.testOneOffender(offender1.probationCrn, 'prob', 'probationFailedAlias', false, true)
    cy.get<boolean>('@probationFailedAlias').then((offenderFailed) => {
        expect(offenderFailed).to.be.false
    })

    await oasys.logout()
})