import { test } from 'fixtures'
import { createOffendersAndAssessments } from './testParts/testRef39Part1'
import { mergeAndCreateAssessment } from './testParts/testRef39Part2'
import { demergeAndCheckOffenders } from './testParts/testRef40'

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
        offender1: {
            forename1: 'MergeOne',
            gender: 'Male',
            dateOfBirth: { years: -20 }
        }, offender2: {
            forename1: 'MergeTwo',
            gender: 'Male',
            dateOfBirth: { years: -20 },
        },
        offender1Pks: [], offender2Pks: [], crn1AfterMergePks: [], crn2AfterMergePks: []
    }

    createOffendersAndAssessments(mergeTestData)
    mergeAndCreateAssessment(mergeTestData)
    demergeAndCheckOffenders(mergeTestData)

})