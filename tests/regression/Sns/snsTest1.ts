import * as oasys from 'lib'

describe('Create assessments and check SNS messages - layer 3', () => {


    it('No countersigning required', () => {

        // Create an offender with minimally complete layer 3
        oasys.login(oasys.Users.probHeadPdu)
        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender) => {

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
            oasys.Populate.minimal({ layer: 'Layer 3', populate6_11: 'No' })

            // Sign assessment, then check SNS messages
            oasys.Assessment.signAndLock({ expectRsrWarning: true })
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment')

            // Create another assessment (cloning from the one above), this one with OPD override and RSR
            oasys.Nav.history('@offender1')
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

            const predictors = new oasys.Pages.Assessment.Predictors().goto()
            predictors.o1_30.setValue('No')
            predictors.o1_29.setValue({ months: -1 })
            predictors.o1_38.setValue({ years: 3 })
            const summarySheet = new oasys.Pages.Assessment.SummarySheet()
            summarySheet.goto().opdOverride.setValue('Yes')
            summarySheet.opdOverrideReason.setValue('Testing')
            new oasys.Pages.SentencePlan.IspSection52to8().goto()

            // Sign assessment, then check SNS messages again
            oasys.Assessment.signAndLock()
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR', 'OPD'])
        })

    })

    it('Countersigning required', () => {

        // Create an offender with minimally complete layer 3 to get OGRS and RSR
        oasys.login(oasys.Users.probPso)
        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender) => {

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
            oasys.Populate.CommonPages.OffendingInformation.minimal()
            oasys.Populate.Layer3Pages.Predictors.minimal()
            oasys.Populate.sections2To13NoIssues({ populate6_11: 'No' })
            oasys.Populate.CommonPages.SelfAssessmentForm.minimal()

            // Set to Medium risk to get countersigner
            oasys.Populate.Rosh.specificRiskLevel('High')
            new oasys.Pages.SentencePlan.IspSection52to8().goto().agreeWithPlan.setValue('Yes')

            // Sign assessment and send for countersigning, then check SNS messages
            oasys.Assessment.signAndLock({ expectRsrWarning: true, expectCountersigner: true, countersigner: oasys.Users.probHeadPdu })
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS'])
            oasys.logout()

            // Countersign assessment then check SNS messages again
            oasys.login(oasys.Users.probHeadPdu)
            oasys.Assessment.countersign({ offender: offender, comment: 'Test comment' })

            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
            oasys.logout()

            // Create another assessment, this one with OPD override and RSR
            oasys.login(oasys.Users.probPso)
            oasys.Nav.history('@offender1')

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

            const predictors = new oasys.Pages.Assessment.Predictors().goto()
            predictors.o1_30.setValue('No')
            predictors.o1_29.setValue({ months: -1 })
            predictors.o1_38.setValue({ years: 3 })
            const summarySheet = new oasys.Pages.Assessment.SummarySheet()
            summarySheet.goto().opdOverride.setValue('Yes')
            summarySheet.opdOverrideReason.setValue('Testing')

            // Sign assessment and check SNS messages
            oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.IspSection52to8, expectCountersigner: true, countersigner: oasys.Users.probHeadPdu })
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS', 'RSR'])
            oasys.logout()

            // Countersign assessment then check SNS messages again
            oasys.login(oasys.Users.probHeadPdu)
            oasys.Assessment.countersign({ offender: offender, comment: 'Test comment' })

            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OPD'])
            oasys.logout()

        })

    })
})