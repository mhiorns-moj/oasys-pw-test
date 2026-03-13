import * as oasys from 'lib'

describe('Example test - create a prison offender and a layer 1 assessment using new SP service', () => {

    it('Create offender and assessment', () => {
        oasys.login(oasys.Users.prisSpHomds)

        oasys.Offender.createPris(oasys.OffenderLib.Prison.Male.burglary, 'offender1')
        oasys.Assessment.createPris({ purposeOfAssessment: 'Transfer in from non England / Wales Court', assessmentLayer: 'Basic (Layer 1)' })

        // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
        oasys.Populate.minimal({ layer: 'Layer 1', provider: 'pris', newSp: true })
        // oasys.Populate.fullyPopulated({ layer: 'Layer 1', provider: 'pris', maxStrings: true })

        oasys.Assessment.signAndLock()

        oasys.logout()
    })

})
