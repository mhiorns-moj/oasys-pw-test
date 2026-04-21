import { test } from 'fixtures'

const count = 260000
const whereClause: string = null
// const whereClause = `cms_prob_number = 'V017263'`
const includeStatic = false
const reportAll = true


test('Tier calculations test', async ({ ogrs }) => {

    let failed = 0
    let passed = 0

    const tieringData = await ogrs.tiering.getTieringTestData(count, whereClause)

    for (const tieringCase of tieringData) {
        const logText: string[] = []

        const caseResult = ogrs.tiering.calculate(tieringCase, includeStatic, logText)

        if (caseResult != tieringCase.oracleResults.finalTier || reportAll) {
            log(`     ${JSON.stringify(tieringCase)}`, `CRN: ${tieringCase.probationCrn} / ${tieringCase.prisonCrn} FAILED`)
            log(`     ROSH: ${tieringCase.rosh}`)
            log(`     MAPPA: ${tieringCase.mappa}`)
            log(`     Lifer: ${tieringCase.lifer}`)
            log(`     Custody: ${tieringCase.custodyInd}`)
            log(`     Oracle: ${tieringCase.oracleResults.finalTier}, Cypress: ${caseResult}`)
            logText.forEach((logLine) => {
                log(logLine)
            })
            log(' ')
            if (caseResult != tieringCase.oracleResults.finalTier) {
                failed++
            } else {
                passed++
            }
        }

    }

    log(`Passed: ${passed}, failed: ${failed}`, 'Summary')
    console.log(`Passed: ${passed}, failed: ${failed}`)

    expect(failed).toBe(0)

})
