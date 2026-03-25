import * as oasys from 'lib'

describe('Example test - create a probation offender and a RoSHa assessment', () => {


    it('Create offender and assessment', () => {
        oasys.login(oasys.users.probHeadPdu)

        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })

        // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
        oasys.Populate.minimal({ layer: 'Layer 1V2' })
        // oasys.Populate.fullyPopulated({layer: 'Layer 1V2', maxStrings: false })

        await signing.signAndLock({ expectRsrScore: true })

        oasys.logout()
    })

})
