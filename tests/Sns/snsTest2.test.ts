import { test } from 'fixtures'

const offender1: OffenderDef = {
    forename1: 'Autotest',
    gender: 'Male',
    dateOfBirth: { years: -25 },
}

test.describe('Create assessments and check SNS messages - layer 1', () => {

    test('No countersigning required', async ({ oasys, offender, assessment, sns, signing, sections, sentencePlan }) => {

        await oasys.login(oasys.users.probHeadPdu)
        await offender.createProb(offender1)

        // First RoSHA
        await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })
        await assessment.populateMinimal({ layer: 'Layer 1V2' })

        await signing.signAndLock({ page: 'riskScreening', expectCsrpScore: true })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])

        // First L1
        await oasys.history(offender1)
        await assessment.createProb({ purposeOfAssessment: 'Termination of Community Supervision', assessmentLayer: 'Basic (Layer 1)' })
        await sections.offendingInformation.goto(true)
        await sections.offendingInformation.offence.setValue('030')
        await sections.offendingInformation.subcode.setValue('01')
        await sections.offendingInformation.offenceDate.setValue({ months: -1 })
        await sections.offendingInformation.count.setValue(1)
        await sections.offendingInformation.sentence.setValue('Fine')
        await sections.offendingInformation.sentenceDate.setValue({})

        await sections.layer1Section2.populateMinimal()
        await sections.selfAssessmentForm.populateMinimal()

        await sentencePlan.goto('basic')
        await sentencePlan.basicSentencePlan.terminationDate.setValue({})
        await signing.signAndLock()
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

        // Second RoSHA
        await oasys.history(offender1)
        await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' }, 'Yes')

        await signing.signAndLock({ page: 'riskScreening', expectCsrpScore: true })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])  // Defect NOD-980

        // Second L1
        await oasys.history(offender1)
        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
        await sections.offendingInformation.goto(true)
        await sections.offendingInformation.offence.setValue('030')
        await sections.offendingInformation.subcode.setValue('01')
        await sections.offendingInformation.offenceDate.setValue({ months: -1 })
        await sections.offendingInformation.count.setValue(1)
        await sections.offendingInformation.sentence.setValue('Fine')
        await sections.offendingInformation.sentenceDate.setValue({})
        await sections.predictors.goto()
        await sections.predictors.o1_32.setValue(2)

        // await sections.layer1Section2.populateMinimal()
        await sections.selfAssessmentForm.populateMinimal()

        await signing.signAndLock({ page: 'basic' })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS'])
    })

})

test('Countersigning required', async ({ oasys, offender, assessment, sns, signing, sections, sentencePlan, risk }) => {

    // Create an offender with minimally complete layer 1 to get OGRS and RSR
    await oasys.login(oasys.users.probPso)
    const offender1 = await offender.createProbFromStandardOffender()

    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
    await assessment.populateMinimal({ layer: 'Layer 1', sentencePlan: 'basic' })

    // Set to Medium risk to get countersigner
    await risk.populateWithSpecificRiskLevel('High')

    // Sign assessment and send for countersigning, then check SNS messages
    await signing.signAndLock({ page: 'basic', expectCountersigner: true, countersigner: oasys.users.probHeadPdu })
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['OGRS'])
    await oasys.logout()

    // Countersign assessment then check SNS messages again
    await oasys.login(oasys.users.probHeadPdu)
    await signing.countersign({ offender: offender1, comment: 'Test comment' })

    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])
    await oasys.logout()

    await oasys.login(oasys.users.probPso)
    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
    await sections.offendingInformation.populateMinimal()
    await sections.layer1Section2.populateMinimal()
    await sections.selfAssessmentForm.populateMinimal()

    // Sign assessment, then check SNS messages
    await signing.signAndLock({ page: 'basic', expectCountersigner: true, countersigner: oasys.users.probHeadPdu })
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['OGRS'])

    await oasys.logout()

    // Countersign assessment then check SNS messages again
    await oasys.login(oasys.users.probHeadPdu)
    await signing.countersign({ offender: offender1, comment: 'Test comment' })

    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])
    await oasys.logout()
})
