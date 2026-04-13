
describe('NOD-1201', () => {

    // Offender has a completed assessment with 2.3 Physical Violence and not 6.7DA, complete SARA with high/medium
    // Second assessment with SARA rejected

    it('NOD-1201', () => {
        await oasys.login(oasys.users.probHeadPdu)

        // Offender 1
        const offender1 = await offender.createProbFromStandardOffender()
        cy.get<OffenderDef>('@offender1').then((offender1) => {

            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

            oasys.Populate.CommonPages.OffendingInformation.minimal()
            oasys.Populate.Layer3Pages.Predictors.minimal()
            await sections.sections2To13NoIssues({ populate6_11: 'No' })
            await sections.selfAssessmentForm.populateMinimal()
            await risk.screeningNoRisks()

            // Set 6.7 to trigger the SARA
            await sections.section3.goto()
            section2.o2_3PhysicalViolence.setValue(true)

            const r24 = new oasys.Pages.Rosh.RoshScreeningSection2to4().goto()

            // Create the SARA fully populate with high/medium risk flags
            await oasys.clickButton('Next')
            await oasys.clickButton('Create')
            oasys.Populate.Sara.sara('High', 'Medium')
            await oasys.clickButton('Save')
            await oasys.clickButton('Sign & lock')
            await oasys.clickButton('Confirm Sign & Lock')

            // Complete the assessment
            await oasys.history(offender1, 'Start of Community Order')
            new oasys.Pages.SentencePlan.IspSection52to8().goto().agreeWithPlan.setValue('Yes')
            await signing.signAndLock({ expectRsrWarning: true })

            oasys.Api.testOneOffender(offender1.probationCrn, 'prob', 'probationFailedAlias', false, true)
            cy.get<boolean>('@probationFailedAlias').then((offenderFailed) => {
                expect(offenderFailed).to.be.false
            })

            // Create assessment 2
            await oasys.history(offender1)
            await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })

            // Reject the SARA
            r24.goto()
            await oasys.clickButton('Next')
            new oasys.Pages.Sara.CreateSara().cancel.click()
            const noSara = new oasys.Pages.Sara.ReasonNoSara()
            noSara.reason.setValue('There was no suitably trained assessor available')
            noSara.ok.click()

            await signing.signAndLock({ page: oasys.Pages.SentencePlan.RspSection1to2, expectRsrWarning: true })

            oasys.Api.testOneOffender(offender1.probationCrn, 'prob', 'probationFailedAlias', false, true)
            cy.get<boolean>('@probationFailedAlias').then((offenderFailed) => {
                expect(offenderFailed).to.be.false
            })

            // Create assessment 3
            await oasys.history(offender1)
            await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })

            // Create the SARA, but clear the risk flags
            r24.goto()
            await oasys.clickButton('Next')
            new oasys.Pages.Sara.CreateSara().create.click()
            const sara = new oasys.Pages.Sara.Sara().goto()
            sara.riskOfViolencePartner.setValue('')
            sara.riskOfViolenceOthers.setValue('')
            sara.save.click()
            sara.close.click()

            // Complete the assessment, but reject the SARA
            new oasys.Pages.SentencePlan.RspSection1to2().goto()
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
    })

})