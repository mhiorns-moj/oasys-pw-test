import { TieringTestParameters, TieringTestResult } from '../../oasys/ogrs/types'

const count = 260000
const timeout = 10000000

describe('Tier calculations test', () => {

    const testParams: TieringTestParameters = {
        whereClause: null,
        // whereClause : `cms_prob_number = 'V017263'`,
        count: count,
        checkOgrs4: false,
        includeStatic: false,
        reportAll: true,
    }

    test(`Tiering calculation`, () => {

        let failed = false
        cy.task('tieringTest', testParams, { timeout: timeout }).then((result: TieringTestResult) => {

            log(`Passed: ${result.passed}, failed: ${result.failed}`)

            cy.groupedLogStart(` `)
            result.logText.forEach((log) => {
                cy.groupedLog(log)
            })
            cy.groupedLogEnd()
            console.log(`Passed: ${result.passed}, failed: ${result.failed}`)
            failed = result.failed > 0

        }).then(() => {
            expect(failed).to.be.false
        })

    })

})