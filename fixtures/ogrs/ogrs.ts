import { Decimal } from 'decimal.js'
import { Temporal } from '@js-temporal/polyfill'

import { OasysDb } from 'fixtures'
import { Calculator } from './calculator/calculator'
import { Data } from './data/data'
import { Rescoring } from './rescoring/rescoring'
import { Tiering } from './tiering/tiering'
import { OgrsAssessment, OgrsRsr } from './data/dbClasses'
import { OgrsInputParams, TestCaseResult, OgrsOutputParams, Ogrs4CalcResult, OgrsTestResult } from './types'
import { createAssessmentInputParams } from 'fixtures/ogrs/data/createAssessmentTestCase'
import { ogrsFunctionCall } from './data/ogrsFunctionCall'
import { loadParameterSet } from './data/loadTestData'

const tolerance = new Decimal('1E-37')
const precision = 40

export class Ogrs {

    constructor(private readonly oasysDb: OasysDb) { }

    private readonly calculator = new Calculator()
    private readonly data = new Data(this.oasysDb)
    readonly rescoring = new Rescoring(this.oasysDb)
    readonly tiering = new Tiering(this.oasysDb)

    /**
     * Calculate OGRS results from a set of input parameters
     */
    calculate(calculatorParams: OgrsInputParams): OgrsOutputParams {

        return this.calculator.calculate(calculatorParams)
    }

    async getOasysData(type: AssessmentOrRsr, count: number, whereClause: string): Promise<OgrsAssessment[] | OgrsRsr[]> {

        const result = type == 'assessment' ? await this.data.getAssessmentTestData(count, whereClause) : await this.data.getRsrTestData(count, whereClause)
        return result
    }

    getInputParams(type: AssessmentOrRsr, assessmentOrRsr: OgrsAssessment | OgrsRsr, dateParam: string | Temporal.PlainDate = null): OgrsInputParams {

        const result = type == 'assessment' ? this.data.getAssessmentInputParams(assessmentOrRsr as OgrsAssessment, dateParam) : this.data.getRsrInputParams(assessmentOrRsr as OgrsRsr)
        return result
    }

    getFunctionCall(params: OgrsInputParams) {

        return ogrsFunctionCall(params)
    }

    async getOracleResult(functionCall: string): Promise<OgrsOutputParams> {

        const oracleResponse = await this.oasysDb.callFunction(functionCall)
        return this.data.loadOracleOutputValues(oracleResponse.split('|'))
    }

    createInputFromCsvLine(line: string): OgrsInputParams {
        return loadParameterSet(line)
    }

    /**
     * Checks the calculation stored in oasys_set for a given pk.  Fails the test unless the optional second parameter is passed as false.
     * Returns an OgrsTestResult object
     */
    async checkOgrsInOasysSet(assessmentPk: number, stopOnFail = true): Promise<OgrsTestResult> {

        const assessment = await this.data.getOneAssessment(assessmentPk)
        const calculatorParams = createAssessmentInputParams(assessment)

        const result: Ogrs4CalcResult = {
            outputParams: this.calculate(calculatorParams),
            arpText: '',
            vrpText: '',
            svrpText: '',
            dcSrpBand: '',
            iicSrpBand: '',
            csrpType: '',
            csrpBand: '',
            csrpScore: '',
        }

        // Compile results
        const arp = result.outputParams.OGP2_CALCULATED == 'Y' ? result.outputParams.OGP2_PERCENTAGE : result.outputParams.OGRS4G_PERCENTAGE
        const arpBand = result.outputParams.OGP2_CALCULATED == 'Y' ? result.outputParams.OGP2_BAND : result.outputParams.OGRS4G_BAND
        const arpType = result.outputParams.OGP2_CALCULATED == 'Y' ? 'DYNAMIC' : result.outputParams.OGRS4G_CALCULATED ? 'STATIC' : ''
        result.arpText = `${arpType}  ${arp}%   ${arpBand}`

        const vrp = result.outputParams.OVP2_CALCULATED == 'Y' ? result.outputParams.OVP2_PERCENTAGE : result.outputParams.OGRS4V_PERCENTAGE
        const vrpBand = result.outputParams.OVP2_CALCULATED == 'Y' ? result.outputParams.OVP2_BAND : result.outputParams.OGRS4V_BAND
        const vrpType = result.outputParams.OVP2_CALCULATED == 'Y' ? 'DYNAMIC' : result.outputParams.OGRS4V_CALCULATED ? 'STATIC' : ''
        result.vrpText = `${vrpType}  ${vrp}%   ${vrpBand}`

        const svrp = result.outputParams.SNSV_CALCULATED_DYNAMIC == 'Y' ? result.outputParams.SNSV_PERCENTAGE_DYNAMIC : result.outputParams.SNSV_PERCENTAGE_STATIC
        const svrpBand = result.outputParams.SNSV_CALCULATED_DYNAMIC == 'Y' ? result.outputParams.SNSV_BAND_DYNAMIC : result.outputParams.SNSV_BAND_STATIC
        const svrpType = result.outputParams.SNSV_CALCULATED_DYNAMIC == 'Y' ? 'DYNAMIC' : result.outputParams.SNSV_CALCULATED_STATIC ? 'STATIC' : ''
        result.svrpText = `${svrpType}  ${svrp}%   ${svrpBand}`

        result.dcSrpBand = result.outputParams.OSP_DC_BAND?.toUpperCase()
        result.iicSrpBand = result.outputParams.OSP_IIC_BAND?.toUpperCase()

        result.csrpBand = result.outputParams.RSR_BAND?.toUpperCase()
        result.csrpType = result.outputParams.RSR_DYNAMIC == 'Y' ? 'DYNAMIC' : result.outputParams.RSR_CALCULATED == 'Y' ? 'STATIC' : ''
        result.csrpScore = ` ${result.outputParams.RSR_PERCENTAGE}`

        log('', 'Checking OGRS4 calculations')
        let failed = checkScore('ARP static score', result.outputParams.OGRS4G_PERCENTAGE?.toNumber() ?? null, assessment.ogrs4gYr2)
        failed = checkScore('ARP static band', result.outputParams.OGRS4G_BAND?.substring(0, 1) ?? null, assessment.ogrs4gBand) || failed
        failed = checkScore('ARP static calculated', result.outputParams.OGRS4G_CALCULATED, assessment.ogrs4gCalculated) || failed
        failed = checkScore('ARP dynamic score', result.outputParams.OGP2_PERCENTAGE?.toNumber() ?? null, assessment.ogp2Yr2) || failed
        failed = checkScore('ARP dynamic band', result.outputParams.OGP2_BAND?.substring(0, 1) ?? null, assessment.ogp2Band) || failed
        failed = checkScore('ARP dynamic calculated', result.outputParams.OGP2_CALCULATED, assessment.ogp2Calculated) || failed
        failed = checkScore('VRP static score', result.outputParams.OGRS4V_PERCENTAGE?.toNumber() ?? null, assessment.ogrs4vYr2) || failed
        failed = checkScore('VRP static band', result.outputParams.OGRS4V_BAND?.substring(0, 1) ?? null, assessment.ogrs4vBand) || failed
        failed = checkScore('VRP static calculated', result.outputParams.OGRS4V_CALCULATED, assessment.ogrs4vCalculated) || failed
        failed = checkScore('VRP dynamic score', result.outputParams.OVP2_PERCENTAGE?.toNumber() ?? null, assessment.ovp2Yr2) || failed
        failed = checkScore('VRP dynamic band', result.outputParams.OVP2_BAND?.substring(0, 1) ?? null, assessment.ovp2Band) || failed
        failed = checkScore('VRP dynamic calculated', result.outputParams.OVP2_CALCULATED, assessment.ovp2Calculated) || failed
        failed = checkScore('SVRP static score', result.outputParams.SNSV_PERCENTAGE_STATIC?.toNumber() ?? null, assessment.snsvStaticYr2) || failed
        failed = checkScore('SVRP static band', result.outputParams.SNSV_BAND_STATIC?.substring(0, 1) ?? null, assessment.snsvStaticYr2Band) || failed
        failed = checkScore('SVRP static calculated', result.outputParams.SNSV_CALCULATED_STATIC, assessment.snsvStaticCalculated) || failed
        failed = checkScore('SVRP dynamic score', result.outputParams.SNSV_PERCENTAGE_DYNAMIC?.toNumber() ?? null, assessment.snsvDynamicYr2) || failed
        failed = checkScore('SVRP dynamic band', result.outputParams.SNSV_BAND_DYNAMIC?.substring(0, 1) ?? null, assessment.snsvDynamicYr2Band) || failed
        failed = checkScore('SVRP dynamic calculated', result.outputParams.SNSV_CALCULATED_DYNAMIC, assessment.snsvDynamicCalculated) || failed

        if (failed) {
            log(JSON.stringify(calculatorParams))
            log(JSON.stringify(result))
        }
        if (stopOnFail) {
            expect(failed).toBeFalsy()
        }
        return { result: result, failed: failed }

    }

    /**
     * Generate a calculation for a specified set of inputs, and compare it to a known set of outputs
     */
    calculateOgrsAndCompare(testCaseParams: OgrsInputParams, expectedResults: OgrsOutputParams, testCaseRef: string, reportMode: ReportMode): TestCaseResult {

        Decimal.set({ precision: precision })
        const testCaseResult: TestCaseResult = {
            failed: false,
            inputParams: testCaseParams,
            outputParams: this.calculate(testCaseParams),
            identifier: testCaseRef,
        }

        testCaseResult.outputParams.ASSESSMENT_DATE = oasysDateTime.dateToOracleFormatString(testCaseParams.ASSESSMENT_DATE)

        // Compare and report results
        const logText: string[] = []
        testCaseResult.failed = checkResults(expectedResults, testCaseResult.outputParams, reportMode, logText)

        if ((testCaseResult.failed || reportMode != 'minimal') && reportMode != 'none') {
            log(' ')
            fileLog('')
            log('', `Test case ${testCaseRef}, static flag ${testCaseParams.STATIC_CALC} - ${testCaseResult.failed ? ' *** FAILED ***' : ' PASSED'}`)
            fileLog(`Test case ${testCaseRef}, static flag ${testCaseParams.STATIC_CALC} - ${testCaseResult.failed ? ' *** FAILED ***' : ' PASSED'}`)
            fileLog(`    Input parameters: ${JSON.stringify(testCaseParams)}`)
            fileLog(`    Oracle result:    ${JSON.stringify(expectedResults)}`)
            fileLog(`    Cypress result:   ${JSON.stringify(testCaseResult.outputParams)}`)
            if (testCaseResult.failed || reportMode == 'verbose') {
                log(' ')
                for (const l of logText) {
                    log(l)
                }
            }
        }

        // Report invalid offence codes
        if (testCaseParams.OFFENCE_CODE && !testCaseParams.offenceCat && reportMode != 'none') {
            if (reportMode == 'minimal') {
                log(`Test case ${testCaseRef}: invalid offence code ${testCaseParams.OFFENCE_CODE}`)
            } else {
                log(`Invalid offence code: ${testCaseParams.OFFENCE_CODE}`)
            }
        }
        return testCaseResult
    }

}

function checkScore(description: string, expectedValue: string | number, actualValue: string | number): boolean {

    const failed = expectedValue != actualValue
    if (failed) {
        log(`${description}: expected ${expectedValue}, got ${actualValue}. FAILED`)
    }
    return failed
}

function checkResults(expectedResults: OgrsOutputParams, actualResults: OgrsOutputParams, reportMode: ReportMode, logText: string[]): boolean {

    // Compare the complete result set for a single test case, line by line, to determine failure and generate report

    let failed = false

    Object.keys(expectedResults).forEach((param) => {

        // tolerance check for _SCORE and _COPAS, decimal check for all other numbers except _COUNT, array check for _MISSING_QUESTIONS, simple equality for everything else
        let mode: 'decimal' | 'tolerance' | 'simple' | 'missing' = 'simple'

        // @ts-expect-error
        if (!Number.isNaN(Number.parseFloat(expectedResults[param])) && !Number.isNaN(Number.parseFloat(actualResults[param]))) {  // numeric comparison required

            if ((param.includes('_SCORE') && param != 'OSP_DC_SCORE') || param.includes('_COPAS')) {
                mode = 'tolerance'
            } else if (!param.includes('_COUNT')) {
                mode = 'decimal'
            }
        } else if (param.includes('MISSING_QUESTIONS')) {
            mode = 'missing'
        }

        // check Decimal values - with tolerance for scores
        if (mode == 'decimal' || mode == 'tolerance') {
            // @ts-expect-error
            const diff = expectedResults[param].minus(actualResults[param]).abs()
            if ((mode == 'tolerance' && diff.greaterThan(tolerance)) || (mode == 'decimal' && diff.greaterThan(0))) {
                failed = true
                if (mode == 'tolerance' || (mode == 'decimal' && diff.greaterThan(0))) {
                    // @ts-expect-error
                    logText.push(`      ${param} *** failed: Oracle ${expectedResults[param]}, Cypress ${actualResults[param]}, difference: ${diff}`)
                }
            } else if (mode == 'tolerance' && reportMode != 'minimal' && reportMode != 'none') {
                // @ts-expect-error
                logText.push(`      ${param} passed: Oracle ${expectedResults[param]}, Cypress ${actualResults[param]}, difference: ${diff}`)
            } else if (reportMode == 'verbose') {
                // @ts-expect-error
                logText.push(`      ${param} passed: Oracle ${expectedResults[param]}, Cypress ${actualResults[param]}`)
            }

            // missing questions list
        } else if (mode == 'missing') {
            // @ts-expect-error
            const expectedMissing = JSON.stringify(expectedResults[param])
            // @ts-expect-error
            const actualMissing = JSON.stringify(actualResults[param])
            if (expectedMissing != actualMissing) {
                logText.push(`      ${param} *** failed: Oracle ${expectedMissing}, Cypress ${actualMissing}`)
                failed = true
            }
            else if (reportMode == 'verbose') {
                logText.push(`      ${param} passed: Oracle ${expectedMissing}`)
            }

            // simple equality check
            // @ts-expect-error
        } else if (actualResults[param] != expectedResults[param]) {
            failed = true
            // @ts-expect-error
            logText.push(`      ${param} *** failed: Oracle ${expectedResults[param]}, Cypress ${actualResults[param]}`)

            // otherwise passed
        } else if (reportMode == 'verbose') {
            // @ts-expect-error
            logText.push(`      ${param} passed: ${expectedResults[param]}`)
        }
    })

    return failed
}