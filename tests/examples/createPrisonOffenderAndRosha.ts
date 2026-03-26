
describe('Example test - create a prison offender and a RoSHa assessment', () => {


    it('Create offender and assessment', () => {
        await oasys.login(oasys.users.prisHomds)

        oasys.Offender.createPris(oasys.OffenderLib.Prison.Male.burglary, 'offender1')
        await assessment.createPris({ purposeOfAssessment: 'Risk of Harm Assessment' })

        // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
        oasys.Populate.minimal({ layer: 'Layer 1V2', provider: 'pris' })
        // oasys.Populate.fullyPopulated({layer: 'Layer 1V2', provider: 'pris', maxStrings: false })

        await signing.signAndLock({ expectRsrScore: true })

        await oasys.logout()
    })

})
