import * as oasys from 'lib'

describe('NOD-1201', () => {

    // Offender has a completed assessment with 2.3 Physical Violence and not 6.7DA, complete SARA with high/medium
    // Second assessment with SARA rejected

    it('NOD-1201', () => {
        oasys.login(oasys.Users.probHeadPdu)

        // Offender 1
        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender1) => {

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

            oasys.Populate.CommonPages.OffendingInformation.minimal()
            oasys.Populate.Layer3Pages.Predictors.minimal()
            oasys.Populate.sections2To13NoIssues({ populate6_11: 'No' })
            oasys.Populate.CommonPages.SelfAssessmentForm.minimal()
            oasys.Populate.Rosh.screeningNoRisks()

            // Set 6.7 to trigger the SARA
            const section2 = new oasys.Pages.Assessment.Section2().goto()
            section2.o2_3PhysicalViolence.setValue(true)

            const r24 = new oasys.Pages.Rosh.RoshScreeningSection2to4().goto()

            // Create the SARA fully populate with high/medium risk flags
            oasys.Nav.clickButton('Next')
            oasys.Nav.clickButton('Create')
            oasys.Populate.Sara.sara('High', 'Medium')
            oasys.Nav.clickButton('Save')
            oasys.Nav.clickButton('Sign & lock')
            oasys.Nav.clickButton('Confirm Sign & Lock')

            // Complete the assessment
            oasys.Nav.history(offender1, 'Start of Community Order')
            new oasys.Pages.SentencePlan.IspSection52to8().goto().agreeWithPlan.setValue('Yes')
            oasys.Assessment.signAndLock({ expectRsrWarning: true })

            oasys.Api.testOneOffender(offender1.probationCrn, 'prob', 'probationFailedAlias', false, true)
            cy.get<boolean>('@probationFailedAlias').then((offenderFailed) => {
                expect(offenderFailed).to.be.false
            })

            // Create assessment 2
            oasys.Nav.history(offender1)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })

            // Reject the SARA
            r24.goto()
            oasys.Nav.clickButton('Next')
            new oasys.Pages.Sara.CreateSara().cancel.click()
            const noSara = new oasys.Pages.Sara.ReasonNoSara()
            noSara.reason.setValue('There was no suitably trained assessor available')
            noSara.ok.click()

            oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.RspSection1to2, expectRsrWarning: true })

            oasys.Api.testOneOffender(offender1.probationCrn, 'prob', 'probationFailedAlias', false, true)
            cy.get<boolean>('@probationFailedAlias').then((offenderFailed) => {
                expect(offenderFailed).to.be.false
            })

            // Create assessment 3
            oasys.Nav.history(offender1)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })

            // Create the SARA, but clear the risk flags
            r24.goto()
            oasys.Nav.clickButton('Next')
            new oasys.Pages.Sara.CreateSara().create.click()
            const sara = new oasys.Pages.Sara.Sara().goto()
            sara.riskOfViolencePartner.setValue('')
            sara.riskOfViolenceOthers.setValue('')
            sara.save.click()
            sara.close.click()

            // Complete the assessment, but reject the SARA
            new oasys.Pages.SentencePlan.RspSection1to2().goto()
            oasys.Nav.clickButton('Sign & Lock')
            oasys.Nav.clickButton('Continue with Signing')
            new oasys.Pages.Signing.SigningStatus().noSaraReason.setValue('There was no suitably trained assessor available')
            oasys.Nav.clickButton('Continue with Signing')
            oasys.Nav.clickButton('Confirm Sign & Lock')

            oasys.Api.testOneOffender(offender1.probationCrn, 'prob', 'probationFailedAlias', false, true)
            cy.get<boolean>('@probationFailedAlias').then((offenderFailed) => {
                expect(offenderFailed).to.be.false
            })
            oasys.logout()
        })
    })

})