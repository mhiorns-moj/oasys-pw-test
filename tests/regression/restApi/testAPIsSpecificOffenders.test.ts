import { test } from 'fixtures'

/**
 * Tests all endpoints against one or more specific oasys.Offender.
 */

const testCases = [
    // ['ZABUOBO', null],    // fully populated L3/L1v2/L1v1
    // ['H923484', null],    // SARA
    // ['X450397', null],    // SUM
    // ['ZLHECUL', null],       // OASys-SP layer 1
    // ['ZUHJFAA', null],      // SAN assessments
    ['ZSZGXOP', null],
]

// const limitEndpoints: Endpoint[] = []
const limitEndpoints: Endpoint[] = ['assSumm']

test('All endpoint regression tests - extra test for specific cases', async ({ api, oasysDb }) => {

    let failed = false
    let count = 1

    for (const offender of testCases) {
        console.log(`Offender ${count++}: ${offender[0]} / ${offender[1]}`)

        if (offender[0] != null) {  // call with probation CRN
            const offenderFailed = await api.testOneOffender(offender[0], 'prob', false, true, oasysDb, null, limitEndpoints)
            if (offenderFailed) {
                console.log('Failed')
                failed = true
            }
        }
        if (offender[1] != null) {  // call with NomisId
            const offenderFailed = await api.testOneOffender(offender[1], 'pris', offender[0] != null, true, oasysDb, null, limitEndpoints)  // skipPrisSubsequents if already done for prob crn
            if (offenderFailed) {
                console.log('Failed')
                failed = true
            }
        }
    }

    expect(failed).toBeFalsy()
})
