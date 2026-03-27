import { test } from 'fixtures'


test.describe('Create assessments and check SNS messages - layer 3', () => {

    test('No countersigning required', async ({ oasys, offender, assessment, sns, signing }) => {

        // Create an offender with minimally complete layer 3
        await oasys.login(oasys.users.probSpHeadPdu)

        const offender1 = await offender.createProbFromStandardOffender()

        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
        await assessment.populateMinimal({ layer: 'Layer 3', populate6_11: 'No' })

        // Sign assessment, then check SNS messages
        await signing.signAndLock({ expectRsrWarning: true })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment')

        // Create another assessment (cloning from the one above), this one with OPD override and RSR
        await oasys.history(offender1)
        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

        await sections.predictors.goto()
        await sections.predictors.o1_30.setValue('No')
        await sections.predictors.o1_29.setValue({ months: -1 })
        await sections.predictors.o1_38.setValue({ years: 3 })
        await assessment.summarySheet.goto()
        await assessment.summarySheet.opdOverride.setValue('Yes')
        await assessment.summarySheet.opdOverrideReason.setValue('Testing')

        // Sign assessment, then check SNS messages again
        await signing.signAndLock({ page: 'spService' })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR', 'OPD'])
        await oasys.logout()

    })

    test('Countersigning required', async ({ oasys, offender, assessment, sns, signing, risk, sentencePlan }) => {

        // Create an offender with minimally complete layer 3 to get OGRS and RSR
        await oasys.login(oasys.users.probSpPso)
        const offender1 = await offender.createProbFromStandardOffender()

        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
        await sections.offendingInformation.populateMinimal()
        await sections.predictors.populateMinimal()
        await sections.sections2To13NoIssues({ populate6_11: 'No' })
        await sections.selfAssessmentForm.populateMinimal()

        // Set to Medium risk to get countersigner
        await risk.populateWithSpecificRiskLevel('High')
        await sentencePlan.populateMinimal()

        // Sign assessment and send for countersigning, then check SNS messages
        await signing.signAndLock({ expectRsrWarning: true, expectCountersigner: true, countersigner: oasys.users.probSpHeadPdu })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['OGRS'])
        await oasys.logout()

        // Countersign assessment then check SNS messages again
        await oasys.login(oasys.users.probSpHeadPdu)
        await signing.countersign({ offender: offender1, comment: 'Test comment' })

        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])
        await oasys.logout()

        // Create another assessment, this one with OPD override and RSR
        await oasys.login(oasys.users.probSpPso)
        await oasys.history(offender1)

        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

        await sections.predictors.goto()
        await sections.predictors.o1_30.setValue('No')
        await sections.predictors.o1_29.setValue({ months: -1 })
        await sections.predictors.o1_38.setValue({ years: 3 })
        await assessment.summarySheet.goto()
        await assessment.summarySheet.opdOverride.setValue('Yes')
        await assessment.summarySheet.opdOverrideReason.setValue('Testing')

        // Sign assessment and check SNS messages
        await signing.signAndLock({ page: 'spService', expectCountersigner: true, countersigner: oasys.users.probSpHeadPdu })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['OGRS', 'RSR'])
        await oasys.logout()

        // Countersign assessment then check SNS messages again
        await oasys.login(oasys.users.probSpHeadPdu)
        await signing.countersign({ offender: offender1, comment: 'Test comment' })

        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OPD'])
        await oasys.logout()

    })
})