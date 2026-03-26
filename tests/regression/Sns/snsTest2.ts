
const offender1: OffenderDef = {
    forename1: 'Autotest',
    gender: 'Male',
    dateOfBirth: { years: -25 },

}
describe('Create assessments and check SNS messages - layer 1', () => {


    it('No countersigning required', () => {

        await oasys.login(oasys.users.probHeadPdu)
        oasys.Offender.createProb(offender1, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender) => {

            // First RoSHA
            await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })
            oasys.Populate.minimal({ layer: 'Layer 1V2' })

            await signing.signAndLock({ page: oasys.Pages.Rosh.RoshScreeningSection5, expectRsrScore: true })
            await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])

            // First L1
            await oasys.history(offender)
            await assessment.createProb({ purposeOfAssessment: 'Termination of Community Supervision', assessmentLayer: 'Basic (Layer 1)' })
            const offendingInformation = new oasys.Pages.Assessment.OffendingInformation().goto(true)
            offendingInformation.offence.setValue('030')
            offendingInformation.subcode.setValue('01')
            offendingInformation.offenceDate.setValue({ months: -1 })
            offendingInformation.count.setValue(1)
            offendingInformation.sentence.setValue('Fine')
            offendingInformation.sentenceDate.setValue({})

            oasys.Populate.Layer1Pages.Section2.minimal()
            oasys.Populate.CommonPages.SelfAssessmentForm.minimal()

            new oasys.Pages.SentencePlan.BasicSentencePlan().goto().terminationDate.setValue({})
            await signing.signAndLock()
            await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

            // Second RoSHA
            await oasys.history(offender)
            await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' }, 'Yes')

            await signing.signAndLock({ page: oasys.Pages.Rosh.RoshScreeningSection5, expectRsrScore: true })
            await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])  // Defect NOD-980

            // Second L1
            await oasys.history(offender)
            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
            offendingInformation.goto(true)
            offendingInformation.offence.setValue('030')
            offendingInformation.subcode.setValue('01')
            offendingInformation.offenceDate.setValue({ months: -1 })
            offendingInformation.count.setValue(1)
            offendingInformation.sentence.setValue('Fine')
            offendingInformation.sentenceDate.setValue({})
            new oasys.Pages.Assessment.Predictors().goto().o1_32.setValue(2)

            // oasys.Populate.Layer1Pages.Section2.minimal()
            oasys.Populate.CommonPages.SelfAssessmentForm.minimal()

            new oasys.Pages.SentencePlan.BasicSentencePlan().goto()
            await signing.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan })
            await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS'])
        })

    })

    it('Countersigning required', () => {

        // Create an offender with minimally complete layer 1 to get OGRS and RSR
        await oasys.login(oasys.users.probPso)
        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender) => {

            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
            oasys.Populate.minimal({ layer: 'Layer 1' })

            // Set to Medium risk to get countersigner
            oasys.Populate.Rosh.specificRiskLevel('High')

            // Sign assessment and send for countersigning, then check SNS messages
            await signing.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan, expectCountersigner: true, countersigner: oasys.users.probHeadPdu })
            await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS'])
            await oasys.logout()

            // Countersign assessment then check SNS messages again
            await oasys.login(oasys.users.probHeadPdu)
            await signing.countersign({ offender: offender, comment: 'Test comment' })

            await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
            await oasys.logout()

            await oasys.login(oasys.users.probPso)
            await oasys.history(offender)
            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
            oasys.Populate.CommonPages.OffendingInformation.minimal()
            oasys.Populate.Layer1Pages.Section2.minimal()
            oasys.Populate.CommonPages.SelfAssessmentForm.minimal()

            // Sign assessment, then check SNS messages
            await signing.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan, expectCountersigner: true, countersigner: oasys.users.probHeadPdu })
            await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS'])

            await oasys.logout()

            // Countersign assessment then check SNS messages again
            await oasys.login(oasys.users.probHeadPdu)
            await signing.countersign({ offender: offender, comment: 'Test comment' })

            await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
            await oasys.logout()

        })

    })
})