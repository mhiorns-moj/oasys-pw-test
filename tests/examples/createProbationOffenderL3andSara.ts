import * as oasys from 'lib'

describe('Create a probation offender and a layer 3 assessment plus SARA', () => {


    it('Create offender and assessment', () => {
        oasys.login(oasys.Users.probHeadPdu)

        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender1) => {

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

            oasys.Populate.CommonPages.OffendingInformation.minimal()
            oasys.Populate.Layer3Pages.Predictors.minimal()
            oasys.Populate.sections2To13NoIssues({ populate6_11: 'No' })
            oasys.Populate.CommonPages.SelfAssessmentForm.minimal()
            oasys.Populate.Rosh.screeningNoRisks()
            const section2 = new oasys.Pages.Assessment.Section2().goto()
            section2.o2_3PhysicalViolence.setValue(true)
            section2.save.click()

            new oasys.Pages.Rosh.RoshScreeningSection5().goto()
            oasys.Nav.clickButton('Next')
            oasys.Nav.clickButton('Create')

            oasys.Populate.Sara.sara('Low','Low')
            oasys.Nav.clickButton('Save')
            oasys.Nav.clickButton('Sign & lock')
            oasys.Nav.clickButton('Confirm Sign & Lock')

            oasys.Nav.history(offender1.surname, offender1.forename1, 'Start of Community Order')
            oasys.Populate.SentencePlanPages.IspSection52to8.minimal()
            oasys.Assessment.signAndLock({ expectRsrWarning: true })

            oasys.logout()
        })
    })

})