import * as oasys from 'lib'

describe('Example test - create a prison offender and a layer 3 assessment', () => {


    it('Create offender and assessment', () => {
        oasys.login(oasys.users.prisHomds)

        oasys.Offender.createPris(oasys.OffenderLib.Prison.Male.burglary, 'offender1')
        await assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)' })

        // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
        oasys.Populate.minimal({ layer: 'Layer 3', provider: 'pris', populate6_11: 'No' })
        // oasys.Populate.fullyPopulated({ layer: 'Layer 3', provider: 'pris', maxStrings: false })

        await signing.signAndLock({ page: oasys.Pages.SentencePlan.IspSection1to4, expectRsrWarning: true })  // RRS parameter is not required if using the fullyPopulated option above

        oasys.logout()
    })

})
