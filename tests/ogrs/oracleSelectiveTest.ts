import { OgrsTestParameters, ReportMode } from '../../oasys/ogrs/types'
import { runTest } from './testLib'

// const pk = 4192377  // fully populated
const pk = 9527359  // old 2.2 weapon

const reportMode: ReportMode = 'verbose'

describe('OGRS calculator test', () => {

    test(`Assessment pk ${pk}`, () => {

        const dbTestParams: OgrsTestParameters = {
            testType: 'db',
            dbDetails: {
                type: 'assessment',
                whereClause: `oasys_set_pk = ${pk}`,
                count: 1,
            },
            staticFlag: 'N',
            reportMode: reportMode,
            includeObjects: true,
            // cypressOnly: true,
        }

        runTest(dbTestParams, '', false, false)
    })
})

