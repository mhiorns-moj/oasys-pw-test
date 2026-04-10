
const offender1: OffenderDef = {
    forename1: 'Autotest',
    gender: 'Male',
    dateOfBirth: { years: -35 }

}
describe('Create assessments and check SNS messages - RoSHA plus layer 1', () => {


    it('No countersigning required', () => {

        await oasys.login(oasys.users.probHeadPdu)
        const offender1 = await offender.createProb(offender1)


        // First RoSHA
        await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })
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

        await signing.signAndLock({ expectRsrScore: true })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

        // First L1
        await oasys.history(offender1)
        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
        await sections.offendingInformation.goto()
        await sections.offendingInformation.count.setValue(1)
        await sections.offendingInformation.offenceDate.setValue({ months: -9 })
        const additionalOffence = new oasys.Pages.Assessment.Other.AdditionalOffences().goto()
        additionalOffence.offence.setValue('809')
        additionalOffence.subcode.setValue('01')
        additionalOffence.count.setValue(1)
        additionalOffence.save.click()
        additionalOffence.close.click()
        await sections.offendingInformation.sentence.setValue('CJA2003 - Community Order')
        await sections.offendingInformation.sentenceDate.setValue({})
        await sections.offendingInformation.courtProximity.setValue('Local Court')
        await sections.offendingInformation.courtName.setValue('Bedford MC')
        await sections.offendingInformation.orderLengthMonths.setValue('12')

        await sections.layer1Section2.populateMinimal()
        await sections.selfAssessmentForm.populateMinimal()

        await signing.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan, })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

    })

})

})