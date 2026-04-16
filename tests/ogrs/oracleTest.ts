import { OgrsTestParameters, ReportMode } from '../../oasys/ogrs/types'
import { runTest } from './testLib'

const count = 10000
const reportMode: ReportMode = 'minimal'

describe('OGRS calculator test', () => {

    const dbTestParams: OgrsTestParameters = {
        testType: 'db',
        dbDetails: {
            type: 'assessment',
            whereClause: '',
            count: count,
        },
        staticFlag: null,
        reportMode: reportMode,
        includeObjects: false,
    }

    test(`Layer 3 v1 complete`, () => {

        dbTestParams.dbDetails.type = 'assessment'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm = 'COMPLETE'`
        runTest(dbTestParams, '', false, false)
    })

    test(`Layer 3 v1 not complete (any other status)`, () => {

        dbTestParams.dbDetails.type = 'assessment'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm <> 'COMPLETE'`
        runTest(dbTestParams, '', false, false)
    })

    test(`Layer 1 v2 complete`, () => {

        dbTestParams.dbDetails.type = 'assessment'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER1' and version_number = 2 and assessment_status_elm = 'COMPLETE'`,
            runTest(dbTestParams, '', false, false)
    })

    test(`Layer 1 v2 not complete (any other status)`, () => {

        dbTestParams.dbDetails.type = 'assessment'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER1' and version_number = 2 and assessment_status_elm <> 'COMPLETE'`
        runTest(dbTestParams, '', false, false)
    })

    test(`Layer 1 v1 complete`, () => {

        dbTestParams.dbDetails.type = 'assessment'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER1' and version_number = 1 and assessment_status_elm = 'COMPLETE'`,
            runTest(dbTestParams, '', false, false)
    })

    test(`Layer 1 v1 not complete (any other status)`, () => {

        dbTestParams.dbDetails.type = 'assessment'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER1' and version_number = 1 and assessment_status_elm <> 'COMPLETE'`
        runTest(dbTestParams, '', false, false)
    })

    test(`Standalone RSR complete`, () => {

        dbTestParams.dbDetails.type = 'rsr'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and rsr_status = 'COMPLETE'`
        runTest(dbTestParams, '', false, false)
    })
})