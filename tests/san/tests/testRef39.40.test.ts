import { test } from 'fixtures'
import { createOffendersAndAssessments } from './testRef39-40/testPart1'
import { additionalAssessment, merge } from './testRef39-40/testPart2'
import { checkOffender1AndCreateAssessment, checkOffender2AndCreateAssessment, demerge } from './testRef39-40/testPart3'

/**
 * Merge - where BOTH offenders have OASys-SAN assessments
 * Merge two offenders where BOTH of the offenders have OASys-SAN assessments - check it posts the correct MERGE API
 * 
 * De-merge - where BOTH offenders have OASys-SAN assessments
 * Using the offender who was previously merged in this situation, create and complete a new OASys-SAN assessment.
 * The carry out a De-merge - check it posts the correct MERGE API
 * 
 * Check they end up with the correct SAN assessment - set some text to identify which is which
 */

export type MergeTestData = {
    offender1: OffenderDef, offender2: OffenderDef,
    offender1Pks: number[], offender2Pks: number[], crn1AfterMergePks: number[], crn2AfterMergePks: number[]
}

test.describe.serial('SAN integration test - test refs 39 and 40', () => {

    const mergeTestData: MergeTestData = {
        offender1: null, offender2: null, offender1Pks: [], offender2Pks: [], crn1AfterMergePks: [], crn2AfterMergePks: []
    }

    test('Create offenders and assessments', async ({ oasys, signing, offender, assessment, san, sections, risk, sentencePlan }) => {

        await createOffendersAndAssessments(mergeTestData, oasys, signing, offender, assessment, san, sections, risk, sentencePlan)
    })

    test('Merge offenders and create a new assessment', async ({ page, oasys, signing, offender, tasks, assessment, san }) => {

        await merge(page, mergeTestData, oasys, offender, tasks, assessment, san)
        await additionalAssessment(mergeTestData, oasys, offender, assessment, san, signing)
    })

    test('Demerge offenders', async ({ oasys, offender, san }) => {

        await demerge(mergeTestData, oasys, offender, san)
    })

    test('Check offenders after demerge and create assessment', async ({ oasys, offender, assessment, san }) => {

        await checkOffender1AndCreateAssessment(mergeTestData, oasys, offender, assessment, san)
        await checkOffender2AndCreateAssessment(mergeTestData, oasys, offender, assessment, san)
    })

})