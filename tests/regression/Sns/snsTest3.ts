import * as oasys from 'lib'

const offender1: OffenderDef = {
    forename1: 'Autotest',
    gender: 'Male',
    dateOfBirth: { years: -35 }

}
describe('Create assessments and check SNS messages - RoSHA plus layer 1', () => {


    it('No countersigning required', () => {

        oasys.login(oasys.Users.probHeadPdu)
        oasys.Offender.createProb(offender1, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender) => {

            // First RoSHA
            oasys.Assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })
            const roshaPredictors = new oasys.Pages.Assessment.RoshaPredictors().goto()
            roshaPredictors.offence.setValue('807')
            roshaPredictors.subcode.setValue('01')
            roshaPredictors.dateFirstSanction.setValue({ months: -9 })
            roshaPredictors.o1_32.setValue('3')
            roshaPredictors.o1_40.setValue(0)
            roshaPredictors.o1_30.setValue('No')
            roshaPredictors.o1_29.setValue({ days: -1 })
            roshaPredictors.o1_38.setValue({ days: -1 })
            roshaPredictors.save.click()

            oasys.Populate.RoshPages.RoshScreeningSection1.noRisks()
            const roshScreening2 = new oasys.Pages.Rosh.RoshScreeningSection2to4().goto()
            roshScreening2.r2_3.setValue(`No`)
            roshScreening2.r3_1.setValue(`Don't Know`)
            roshScreening2.r3_2.setValue(`Don't Know`)
            roshScreening2.r3_3.setValue(`Don't Know`)
            roshScreening2.r3_4.setValue(`Don't know`)
            roshScreening2.r4_1.setValue(`Don't Know`)
            roshScreening2.r4_6.setValue(`Don't Know`)
            roshScreening2.r4_4.setValue(`Don't know`)
            roshScreening2.next.click()

            oasys.Assessment.signAndLock({ expectRsrScore: true })
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

            // First L1
            oasys.Nav.history(offender)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
            const offendingInformation = new oasys.Pages.Assessment.OffendingInformation().goto()
            offendingInformation.count.setValue(1)
            offendingInformation.offenceDate.setValue({ months: -9 })
            const additionalOffence = new oasys.Pages.Assessment.Other.AdditionalOffences().goto()
            additionalOffence.offence.setValue('809')
            additionalOffence.subcode.setValue('01')
            additionalOffence.count.setValue(1)
            additionalOffence.save.click()
            additionalOffence.close.click()
            offendingInformation.sentence.setValue('CJA2003 - Community Order')
            offendingInformation.sentenceDate.setValue({})
            offendingInformation.courtProximity.setValue('Local Court')
            offendingInformation.courtName.setValue('Bedford MC')
            offendingInformation.orderLengthMonths.setValue('12')

            oasys.Populate.Layer1Pages.Section2.minimal()
            oasys.Populate.CommonPages.SelfAssessmentForm.minimal()

            oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan, })
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

        })

    })

})