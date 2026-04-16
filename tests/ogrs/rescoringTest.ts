import { RescoringResult, RescoringTestParameters } from '../../oasys/ogrs/types'

describe('OGRS rescoring datafix test', () => {

    test(1)
})

function test(part: number) {

    test(`Rescoring test, part ${part}`, () => {

        cy.get<AppConfig>('@appConfig').then((appConfig) => {

            const testParams: RescoringTestParameters = {
                dataFile: 'rescoringOSP',
                runNumber: '2',
                start: null,
                end: null,
                staticFlag: 'Y',
                includeLayer1: true,
                useCurrentDate: false,
                reportMode: 'normal',
                outputFile: 'rescoringOutput',
                appConfig: appConfig,
            }

            runTest(testParams)
        })
    })
}


const timeout = 10000000
const summaryOutputItems = ['SNSV_PERCENTAGE_STATIC', 'SNSV_PERCENTAGE_DYNAMIC', 'OGRS4V_PERCENTAGE', 'OVP2_PERCENTAGE', 'OGRS4G_PERCENTAGE', 'OGP2_PERCENTAGE',]

export function runTest(params: RescoringTestParameters) {

    cy.task('rescoringTest', params, { timeout: timeout }).then((results: RescoringResult[]) => {

        cy.groupedLogStart('')
        for (let i = 0; i < results.length; i++) {
            const result = results[i]
            cy.groupedLog(`CRN: ${result.crn}, pk: ${result.pk}`)
        }
        cy.groupedLogEnd()
    })
}
