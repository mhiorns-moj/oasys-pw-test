import * as fs from 'fs-extra'

import { test } from 'fixtures'

const dataFile = 'rescoringCRNs-T2B 16-Dec'
const runNumber = '22'
const staticFlag = 'Y'
const includeLayer1 = true
const outputFile = 'rescoringOutput'

const dataFilePath = 'tests/ogrs/data/'
const outputPath = 'test-results/'
export const dateFormat = 'DD-MM-YYYY'

test('OGRS rescoring datafix test', async ({ ogrs }) => {

    // Load input parameters from a CSV file (list of CRNs)
    const crnFile = await fs.readFile(`${dataFilePath}${dataFile}.csv`, 'utf8')
    const crns = crnFile.split('\r\n')

    // Call the Oracle package for each CRN, and store alongside existing predictor values from OASYS_SET
    for (let i = 0; i <= crns.length - 1; i++) {

        // Get offender and assessment details from the OASys db
        const probationCrn = crns[i].split(',')[0]
        const nomisId = crns[i].split(',')[1]
        const rescoringOffenderWithAssessment = await ogrs.rescoring.getOffenderData(probationCrn == '' ? 'pris' : 'prob', probationCrn == '' ? nomisId : probationCrn, includeLayer1)

        if (rescoringOffenderWithAssessment == null || rescoringOffenderWithAssessment.assessment == null) {
            // not found or duplicate CRN, or no assessment of the correct type/status
            await fs.appendFile(`${outputPath}${outputFile}.csv`, '\n', 'utf8')
            log(`CRN: ${crns[i]}, pk: `)

        } else {

            const testCaseParams = ogrs.rescoring.createAssessmentTestCase(rescoringOffenderWithAssessment.assessment, staticFlag, includeLayer1)

            // Call the calculator in Oracle
            const functionCall = ogrs.getFunctionCall(testCaseParams)
            const oracleTestCaseResult = await ogrs.getOracleResult(functionCall)

            await fs.appendFile(`${outputPath}${outputFile}.csv`,
                ogrs.rescoring.getOutputLine(testCaseParams, rescoringOffenderWithAssessment, oracleTestCaseResult, runNumber), 'utf8'
            )

            log(`CRN: ${crns[i]}, pk: ${rescoringOffenderWithAssessment.assessment.pk}`)
        }

    }

})

