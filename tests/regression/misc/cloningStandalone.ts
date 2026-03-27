
describe('Cloning test - standalone CSRP', () => {

    it('Cloning test - standalone CSRP', () => {

        await oasys.login(oasys.users.probHeadPdu)

        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
            oasys.Populate.minimal({ layer: 'Layer 3', populate6_11: 'No' })

            const section2 = new oasys.Pages.Assessment.Section2().goto()
            section2.o2_2Weapon.setValue('Yes')
            section2.o2_2SpecifyWeapon.setValue('L3 weapon')

            const section3 = new oasys.Pages.Assessment.Section3().goto()
            section3.o3_4.setValue('1-Some problems')

            await risk.screeningSection2to4.goto()
            rosh2.r2_3.setValue('No')
            rosh2.rationale.setValue('Rationale')

            await signing.signAndLock({ page: oasys.Pages.SentencePlan.IspSection52to8, expectRsrWarning: true })

            await oasys.history(offender)
            const rsr = new oasys.Pages.Offender.StandaloneRsr().goto()
            rsr.o1_8Age.checkValue('23')
            rsr.o1_32.checkValue(2)
            rsr.o1_40.checkValue(0)

            rsr.o1_32.setValue(5)
            rsr.o1_40.setValue(4)
            rsr.o1_29.setValue({ months: -1 })
            rsr.o1_38.setValue({ months: +1 })
            rsr.o1_30.setValue('No')
            rsr.o1_39.setValue('No') // Offender interview

            rsr.calculateScores.click()
            cy.screenshot()
            rsr.close.click()

            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
            await sections.predictors.goto()
            await sections.predictors.o1_32.checkValue(5)
            await sections.predictors.o1_40.checkValue(4)

            section2.goto()
            section2.o2_2Weapon.checkValue('Yes')
            section2.o2_2SpecifyWeapon.checkValue('L3 weapon')

            section3.goto()
            section3.o3_4.checkValue('1-Some problems')

            await oasys.logout()
        })
    })
})