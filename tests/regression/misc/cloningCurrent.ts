
describe('Cloning test - current period of supervision', () => {

    it('Cloning test - current period of supervision', () => {

        await oasys.login(oasys.users.probHeadPdu)

        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
            oasys.Populate.minimal({ layer: 'Layer 3', populate6_11: 'No' })
            await signing.signAndLock({ expectRsrWarning: true })

            await oasys.history(offender)
            await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
            const section3 = new oasys.Pages.Assessment.Section3().goto()
            section3.identifyIssues.setValue('Second assessment section 3 issues')
            await signing.signAndLock({ page: oasys.Pages.SentencePlan.RspSection72to10, expectRsrWarning: true })

            await oasys.history(offender)
            await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
            const section4 = new oasys.Pages.Assessment.Section4().goto()
            section4.identifyIssues.setValue('Third assessment section 4 issues')
            await signing.signAndLock({ page: oasys.Pages.SentencePlan.RspSection72to10, expectRsrWarning: true })

            await oasys.history(offender)
            await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Basic (Layer 1)' })
            await signing.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan })

            await oasys.history(offender)
            await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Basic (Layer 1)' })
            await signing.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan })

            await oasys.history(offender)
            await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Basic (Layer 1)' })
            await signing.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan })

            await oasys.history(offender)
            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
            section3.goto().identifyIssues.checkValue('Second assessment section 3 issues')
            section4.goto().identifyIssues.checkValue('Third assessment section 4 issues')

            await oasys.logout()
        })
    })
})