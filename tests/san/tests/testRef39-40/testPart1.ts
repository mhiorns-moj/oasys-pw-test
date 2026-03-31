import { Assessment, Oasys, Offender, Risk, San, Sections, SentencePlan, Signing } from 'fixtures'
import { MergeTestData } from '../testRef39.40.test'
import * as testData from '../../data/mergeTest'

const offender1: OffenderDef = {

    forename1: 'MergeOne',
    gender: 'Male',
    dateOfBirth: { years: -20 },
}

const offender2: OffenderDef = {

    forename1: 'MergeTwo',
    gender: 'Male',
    dateOfBirth: { years: -20 },
}

export async function createOffendersAndAssessments(mergeTestData: MergeTestData, oasys: Oasys, signing: Signing,
    offender: Offender, assessment: Assessment, san: San, sections: Sections, risk: Risk, sentencePlan: SentencePlan) {

    log('Merge tests part 1 - create and complete 3.2 assessment on offender 1', 'Test step')

    await oasys.login(oasys.users.probSanHeadPdu)
    mergeTestData.offender1 = await offender.createProb(offender1)

    // Create assessment
    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
    mergeTestData.offender1Pks.push(pk1)

    // Complete section 1
    await sections.offendingInformation.goto()
    await sections.offendingInformation.offence.setValue('030')
    await sections.offendingInformation.subcode.setValue('01')
    await sections.offendingInformation.count.setValue(1)
    await sections.offendingInformation.offenceDate.setValue({ months: -6 })
    await sections.offendingInformation.sentence.setValue('Fine')
    await sections.offendingInformation.sentenceDate.setValue({ months: -1 })

    await sections.predictors.goto(true)
    await sections.predictors.dateFirstSanction.setValue({ years: -2 })
    await sections.predictors.o1_32.setValue(2)
    await sections.predictors.o1_40.setValue(0)
    await sections.predictors.o1_29.setValue({ months: -1 })
    await sections.predictors.o1_30.setValue('No')
    await sections.predictors.o1_38.setValue({})

    await san.gotoSan()
    await san.populateSanSections('Merge test', testData.sanPopulation, true)
    await san.returnToOASys()

    await risk.screeningNoRisks(true)

    // Complete SP, then sign and lock
    await sentencePlan.populateMinimal()
    await signing.signAndLock({ page: 'spService' })

    log('Merge tests part 2 - create and complete two 3.2 assessments on offender 2, delete the second', 'Test step')
    mergeTestData.offender2 = await offender.createProb(offender2)

    // Create assessment
    const pk2 = await assessment.createProb({ purposeOfAssessment: 'Start of Suspended Sentence Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
    mergeTestData.offender2Pks.push(pk2)

    // Complete section 1
    await sections.offendingInformation.goto()
    await sections.offendingInformation.offence.setValue('030')
    await sections.offendingInformation.subcode.setValue('01')
    await sections.offendingInformation.count.setValue(1)
    await sections.offendingInformation.offenceDate.setValue({ months: -6 })
    await sections.offendingInformation.sentence.setValue('Fine')
    await sections.offendingInformation.sentenceDate.setValue({ months: -1 })

    await sections.predictors.goto(true)
    await sections.predictors.dateFirstSanction.setValue({ years: -2 })
    await sections.predictors.o1_32.setValue(2)
    await sections.predictors.o1_40.setValue(0)
    await sections.predictors.o1_29.setValue({ months: -1 })
    await sections.predictors.o1_30.setValue('No')
    await sections.predictors.o1_38.setValue({})

    await san.gotoSan()
    await san.populateSanSections('Merge test', testData.sanPopulation, true)
    await san.populateSanSections('Merge test', testData.modifySanForAssessment2, true)
    await san.returnToOASys()

    await risk.screeningNoRisks(true)

    // Complete SP, then sign and lock
    await sentencePlan.populateMinimal()

    await signing.signAndLock({ page: 'spService' })

    // Deleted assessment added for testing of SAN defect ARN-2427
    await oasys.history(mergeTestData.offender2)
    const pk3 = await assessment.createProb({ purposeOfAssessment: 'Review' })
    mergeTestData.offender2Pks.push(pk3)
    await oasys.logout()

    await oasys.login(oasys.users.admin, oasys.users.probationSan)
    await offender.searchAndSelectByPnc(mergeTestData.offender2.pnc)
    await assessment.deleteLatest()

    await oasys.logout()
}
