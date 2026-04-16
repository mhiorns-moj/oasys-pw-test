import { OgrsTestParameters } from '../../oasys/ogrs/types'
import { runTest } from './testLib'

describe('OGRS calculator test - data science test cases', () => {

    test(1, 'N')
    test(2, 'N')
    test(1, 'Y')
    test(2, 'Y')
})

function test(part: number, staticFlag: 'Y' | 'N') {

    test(`Data science test cases - static ${staticFlag}, part ${part}`, () => {

        const csvTestParams: OgrsTestParameters = {
            testType: 'csv',
            csvDetails: {
                dataFile: 'dsTestCases',
                start: part == 1 ? 0 : 5000,
                end: part == 1 ? 4999 : 9999,
            },
            staticFlag: staticFlag,
            reportMode: 'none',
            includeObjects: true,
        }

        runTest(csvTestParams, `dsOutput${staticFlag}`, true, false)
    })
}