import * as oasys from 'lib'

describe('Example test - create a probation offender and a layer 3 assessment', () => {


    it('Create offender and assessment', () => {
        oasys.login(oasys.Users.probHeadPdu)

        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

        // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
        oasys.Populate.minimal({ layer: 'Layer 3', populate6_11: 'No' })
        // oasys.Populate.fullyPopulated({ layer: 'Layer 3', maxStrings: false })

        oasys.Assessment.signAndLock({ expectRsrWarning: true })  // RSR parameter is not required if using the fullyPopulated option above

        oasys.logout()
    })

})
