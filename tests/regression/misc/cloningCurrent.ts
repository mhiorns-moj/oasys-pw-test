import * as oasys from 'lib'

describe('Cloning test - current period of supervision', () => {

    it('Cloning test - current period of supervision', () => {

        oasys.login(oasys.Users.probHeadPdu)

        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
            oasys.Populate.minimal({ layer: 'Layer 3', populate6_11: 'No' })
            oasys.Assessment.signAndLock({ expectRsrWarning: true })

            oasys.Nav.history(offender)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
            const section3 = new oasys.Pages.Assessment.Section3().goto()
            section3.identifyIssues.setValue('Second assessment section 3 issues')
            oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.RspSection72to10, expectRsrWarning: true })

            oasys.Nav.history(offender)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
            const section4 = new oasys.Pages.Assessment.Section4().goto()
            section4.identifyIssues.setValue('Third assessment section 4 issues')
            oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.RspSection72to10, expectRsrWarning: true })

            oasys.Nav.history(offender)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Basic (Layer 1)' })
            oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan })

            oasys.Nav.history(offender)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Basic (Layer 1)' })
            oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan })

            oasys.Nav.history(offender)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Basic (Layer 1)' })
            oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan })
            
            oasys.Nav.history(offender)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
            section3.goto().identifyIssues.checkValue('Second assessment section 3 issues')
            section4.goto().identifyIssues.checkValue('Third assessment section 4 issues')

            oasys.logout()
        })
    })
})