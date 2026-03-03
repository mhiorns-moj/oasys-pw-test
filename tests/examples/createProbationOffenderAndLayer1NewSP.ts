import * as oasys from 'oasys'

describe('Example test - create a probation offender and a layer 1 assessment using new SP service', () => {


    it('Create offender and assessment', () => {

        oasys.login(oasys.Users.probSpHeadPdu)

        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender1) => {

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })

            // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
            oasys.Populate.minimal({ layer: 'Layer 1', newSp: true, user: oasys.Users.probSpHeadPdu })
            // oasys.Populate.fullyPopulated({layer: 'Layer 1', maxStrings: false })

            oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.SentencePlanService })

            oasys.logout()
        })
    })

})
