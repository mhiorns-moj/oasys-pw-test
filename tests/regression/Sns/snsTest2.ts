import * as oasys from 'lib'

const offender1: OffenderDef = {
    forename1: 'Autotest',
    gender: 'Male',
    dateOfBirth: { years: -25 },

}
describe('Create assessments and check SNS messages - layer 1', () => {


    it('No countersigning required', () => {

        oasys.login(oasys.Users.probHeadPdu)
        oasys.Offender.createProb(offender1, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender) => {

            // First RoSHA
            oasys.Assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })
            oasys.Populate.minimal({ layer: 'Layer 1V2' })

            oasys.Assessment.signAndLock({ page: oasys.Pages.Rosh.RoshScreeningSection5, expectRsrScore: true })
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])

            // First L1
            oasys.Nav.history(offender)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Termination of Community Supervision', assessmentLayer: 'Basic (Layer 1)' })
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
            oasys.Assessment.signAndLock()
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

            // Second RoSHA
            oasys.Nav.history(offender)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' }, 'Yes')

            oasys.Assessment.signAndLock({ page: oasys.Pages.Rosh.RoshScreeningSection5, expectRsrScore: true })
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])  // Defect NOD-980

            // Second L1
            oasys.Nav.history(offender)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
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
            oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan })
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS'])
        })

    })

    it('Countersigning required', () => {

        // Create an offender with minimally complete layer 1 to get OGRS and RSR
        oasys.login(oasys.Users.probPso)
        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender) => {

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
            oasys.Populate.minimal({ layer: 'Layer 1' })

            // Set to Medium risk to get countersigner
            oasys.Populate.Rosh.specificRiskLevel('High')

            // Sign assessment and send for countersigning, then check SNS messages
            oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan, expectCountersigner: true, countersigner: oasys.Users.probHeadPdu })
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS'])
            oasys.logout()

            // Countersign assessment then check SNS messages again
            oasys.login(oasys.Users.probHeadPdu)
            oasys.Assessment.countersign({ offender: offender, comment: 'Test comment' })

            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
            oasys.logout()

            oasys.login(oasys.Users.probPso)
            oasys.Nav.history(offender)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
            oasys.Populate.CommonPages.OffendingInformation.minimal()
            oasys.Populate.Layer1Pages.Section2.minimal()
            oasys.Populate.CommonPages.SelfAssessmentForm.minimal()

            // Sign assessment, then check SNS messages
            oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan, expectCountersigner: true, countersigner: oasys.Users.probHeadPdu })
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS'])

            oasys.logout()

            // Countersign assessment then check SNS messages again
            oasys.login(oasys.Users.probHeadPdu)
            oasys.Assessment.countersign({ offender: offender, comment: 'Test comment' })

            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
            oasys.logout()

        })

    })
})