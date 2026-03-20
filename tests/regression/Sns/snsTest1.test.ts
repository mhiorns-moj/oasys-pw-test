import * as lib from 'lib'
import { test } from 'fixtures'


test.describe('Create assessments and check SNS messages - layer 3', () => {

    test('No countersigning required', async ({ oasys, offender, assessment, sns }) => {

        // Create an offender with minimally complete layer 3
        await oasys.login(oasys.users.probSpHeadPdu)

        const offender1 = await offender.createProb(offender.offenders.Probation.Male.burglary)

        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
        await assessment.populateMinimal({ layer: 'Layer 3', populate6_11: 'No', newSp: true })

        // Sign assessment, then check SNS messages
        await assessment.signing.signAndLock({ expectRsrWarning: true })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment')

        // Create another assessment (cloning from the one above), this one with OPD override and RSR
        await oasys.history(offender1)
        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

        await assessment.common.predictors.goto()
        await assessment.common.predictors.o1_30.setValue('No')
        await assessment.common.predictors.o1_29.setValue({ months: -1 })
        await assessment.common.predictors.o1_38.setValue({ years: 3 })
        await assessment.layer3.summarySheet.goto()
        await assessment.layer3.summarySheet.opdOverride.setValue('Yes')
        await assessment.layer3.summarySheet.opdOverrideReason.setValue('Testing')
        await assessment.sentencePlan.goto('spService')

        // Sign assessment, then check SNS messages again
        await assessment.signing.signAndLock()
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR', 'OPD'])
        await oasys.logout()

    })

    // test('Countersigning required', async ({ oasys, offender, assessment }) => {

    //     // Create an offender with minimally complete layer 3 to get OGRS and RSR
    //     oasys.login(oasys.users.probPso)
    //     offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
    //     cy.get<OffenderDef>('@offender1').then((offender) => {

    //         await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
    //         oasys.Populate.CommonPages.OffendingInformation.minimal()
    //         oasys.Populate.Layer3Pages.Predictors.minimal()
    //         oasys.Populate.sections2To13NoIssues({ populate6_11: 'No' })
    //         oasys.Populate.CommonPages.SelfAssessmentForm.minimal()

    //         // Set to Medium risk to get countersigner
    //         oasys.Populate.Rosh.specificRiskLevel('High')
    //         new oasys.Pages.SentencePlan.IspSection52to8().goto().agreeWithPlan.setValue('Yes')

    //         // Sign assessment and send for countersigning, then check SNS messages
    //         await assessment.signAndLock({ expectRsrWarning: true, expectCountersigner: true, countersigner: oasys.users.probHeadPdu })
    //         oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS'])
    //         oasys.logout()

    //         // Countersign assessment then check SNS messages again
    //         oasys.login(oasys.users.probHeadPdu)
    //         await assessment.countersign({ offender: offender, comment: 'Test comment' })

    //         oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
    //         oasys.logout()

    //         // Create another assessment, this one with OPD override and RSR
    //         oasys.login(oasys.users.probPso)
    //         oasys.Nav.history('@offender1')

    //         await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    //         const predictors = new oasys.Pages.Assessment.Predictors().goto()
    //         predictors.o1_30.setValue('No')
    //         predictors.o1_29.setValue({ months: -1 })
    //         predictors.o1_38.setValue({ years: 3 })
    //         const summarySheet = new oasys.Pages.Assessment.SummarySheet()
    //         summarySheet.goto().opdOverride.setValue('Yes')
    //         summarySheet.opdOverrideReason.setValue('Testing')

    //         // Sign assessment and check SNS messages
    //         await assessment.signAndLock({ page: oasys.Pages.SentencePlan.IspSection52to8, expectCountersigner: true, countersigner: oasys.users.probHeadPdu })
    //         oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS', 'RSR'])
    //         oasys.logout()

    //         // Countersign assessment then check SNS messages again
    //         oasys.login(oasys.users.probHeadPdu)
    //         await assessment.countersign({ offender: offender, comment: 'Test comment' })

    //         oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OPD'])
    //         oasys.logout()

    //     })

    // })
})