import * as oasys from 'lib'

/**
 * Tests all endpoints against one or more specific oasys.Offender.
 */
describe('RestAPI regression tests', () => {


    const testCases = [,
        // ['ZABUOBO', null],    // fully populated L3/L1v2/L1v1
        // ['H923484', null],    // SARA
        // ['X450397', null],    // SUM
        // ['ZLHECUL', null],       // OASys-SP layer 1
        // ['ZEEDUBH', null],
        ['ZCADCTY', null],

    ]

    it(`All endpoint regression tests - extra test for specific cases`, () => {
        runTest(testCases)
    })

    function runTest(offenders: string[][]) {

        let failed = false
        let count = 1

        offenders.forEach((offender) => {
            cy.task('consoleLog', `Offender ${count++}: ${offender[0]} / ${offender[1]}`)

            if (offender[0] != null) {  // call with probation CRN
                oasys.Api.testOneOffender(offender[0], 'prob', 'probationFailedAlias', false, true)
                cy.get<boolean>('@probationFailedAlias').then((offenderFailed) => {
                    if (offenderFailed) {
                        cy.task('consoleLog', 'Failed')
                        failed = true
                    }
                })
            }
            if (offender[1] != null) {  // call with NomisId
                oasys.Api.testOneOffender(offender[1], 'pris', 'prisonFailedAlias', offender[0] != null, true)  // skipPrisSubsequents if already done for prob crn
                cy.get<boolean>('@prisonFailedAlias').then((offenderFailed) => {
                    if (offenderFailed) {
                        cy.task('consoleLog', 'Failed')
                        failed = true
                    }
                })
            }
        })
        cy.then(() => { if (failed) throw new Error('Error running RestAPI tests.') })
    }

})
