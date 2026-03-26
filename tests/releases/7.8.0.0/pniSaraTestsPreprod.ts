
describe('Pre-prod tests for PNI SARA parameters', () => {


    const testCases = [
        // First set return incorrect values for SARA parameters
        ['V217229', null],
        ['E445066', null],
        ['E475550', null],
        ['T027274', null],
        ['E496953', null],
        ['E050428', null],
        ['E506857', null],
        ['E599091', null],
        ['E716844', null],
        ['E679100', null],
        [null, 'A9029EY'],          //  (case raised by John for NOD-1196)
        ['E591983', null],          //  - 1.30 not reported missing
        ['S016052', null],          //  - 1.30 not reported missing
        [null, 'A2144FH'],          //  - 1.30 not reported missing
    ]

    it(`Pre-prod tests for PNI SARA parameters`, () => {
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
