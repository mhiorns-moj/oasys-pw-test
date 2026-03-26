
describe('Create a probation offender and a layer 3 assessment plus SARA', () => {


    it('Create offender and assessment', () => {
        await oasys.login(oasys.users.probHeadPdu)

        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender1) => {

            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

            oasys.Populate.CommonPages.OffendingInformation.minimal()
            oasys.Populate.Layer3Pages.Predictors.minimal()
            oasys.Populate.sections2To13NoIssues({ populate6_11: 'No' })
            oasys.Populate.CommonPages.SelfAssessmentForm.minimal()
            await risk.screeningNoRisks()
            const section2 = new oasys.Pages.Assessment.Section2().goto()
            section2.o2_3PhysicalViolence.setValue(true)
            section2.save.click()

            new oasys.Pages.Rosh.RoshScreeningSection5().goto()
            await oasys.clickButton('Next')
            await oasys.clickButton('Create')

            oasys.Populate.Sara.sara('Low', 'Low')
            await oasys.clickButton('Save')
            await oasys.clickButton('Sign & lock')
            await oasys.clickButton('Confirm Sign & Lock')

            await oasys.history(offender1.surname, offender1.forename1, 'Start of Community Order')
            oasys.Populate.SentencePlanPages.IspSection52to8.minimal()
            await signing.signAndLock({ expectRsrWarning: true })

            await oasys.logout()
        })
    })

})