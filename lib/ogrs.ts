import * as oasys from 'lib'
import { calculate } from 'lib/ogrs/calculateScore'
import { createOutputObject } from 'lib/ogrs/createOutput'
import { ospRsrCalc } from 'lib/ogrs/ospRsr'
import { TestCaseParameters, OutputParameters } from './ogrs/types'
import { OgrsAssessment } from '../../cypress/support/ogrs/getTestData/dbClasses'
import { createAssessmentTestCase } from 'lib/ogrs/createAssessmentTestCase'

export function checkOgrs4CalcsOffender(offender: OffenderDef, resultAlias?: string) {

    oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk')
    cy.get<number>('@pk').then((pk) => {
        checkOgrs4CalcsPk(pk, resultAlias)
    })
}

export function checkOgrs4CalcsPk(assessmentPk: number, resultAlias = null) {

    cy.task('getOgrsAssessment', assessmentPk).then((assessment: OgrsAssessment) => {


        cy.get<AppConfig>('@appConfig').then((appConfig) => {

            const calculatorParams = createAssessmentTestCase(assessment, appConfig.offences, appConfig.appVersions)

            const calcResult = getResult(calculatorParams)

            cy.groupedLogStart('Checking OGRS4 calculations')
            let failed = checkResult('ARP static score', calcResult.details.OGRS4G_PERCENTAGE?.toNumber() ?? null, assessment.ogrs4gYr2)
            failed = checkResult('ARP static band', calcResult.details.OGRS4G_BAND?.substring(0, 1) ?? null, assessment.ogrs4gBand) || failed
            failed = checkResult('ARP static calculated', calcResult.details.OGRS4G_CALCULATED, assessment.ogrs4gCalculated) || failed
            failed = checkResult('ARP dynamic score', calcResult.details.OGP2_PERCENTAGE?.toNumber() ?? null, assessment.ogp2Yr2) || failed
            failed = checkResult('ARP dynamic band', calcResult.details.OGP2_BAND?.substring(0, 1) ?? null, assessment.ogp2Band) || failed
            failed = checkResult('ARP dynamic calculated', calcResult.details.OGP2_CALCULATED, assessment.ogp2Calculated) || failed
            failed = checkResult('VRP static score', calcResult.details.OGRS4V_PERCENTAGE?.toNumber() ?? null, assessment.ogrs4vYr2) || failed
            failed = checkResult('VRP static band', calcResult.details.OGRS4V_BAND?.substring(0, 1) ?? null, assessment.ogrs4vBand) || failed
            failed = checkResult('VRP static calculated', calcResult.details.OGRS4V_CALCULATED, assessment.ogrs4vCalculated) || failed
            failed = checkResult('VRP dynamic score', calcResult.details.OVP2_PERCENTAGE?.toNumber() ?? null, assessment.ovp2Yr2) || failed
            failed = checkResult('VRP dynamic band', calcResult.details.OVP2_BAND?.substring(0, 1) ?? null, assessment.ovp2Band) || failed
            failed = checkResult('VRP dynamic calculated', calcResult.details.OVP2_CALCULATED, assessment.ovp2Calculated) || failed
            failed = checkResult('SVRP static score', calcResult.details.SNSV_PERCENTAGE_STATIC?.toNumber() ?? null, assessment.snsvStaticYr2) || failed
            failed = checkResult('SVRP static band', calcResult.details.SNSV_BAND_STATIC?.substring(0, 1) ?? null, assessment.snsvStaticYr2Band) || failed
            failed = checkResult('SVRP static calculated', calcResult.details.SNSV_CALCULATED_STATIC, assessment.snsvStaticCalculated) || failed
            failed = checkResult('SVRP dynamic score', calcResult.details.SNSV_PERCENTAGE_DYNAMIC?.toNumber() ?? null, assessment.snsvDynamicYr2) || failed
            failed = checkResult('SVRP dynamic band', calcResult.details.SNSV_BAND_DYNAMIC?.substring(0, 1) ?? null, assessment.snsvDynamicYr2Band) || failed
            failed = checkResult('SVRP dynamic calculated', calcResult.details.SNSV_CALCULATED_DYNAMIC, assessment.snsvDynamicCalculated) || failed

            cy.groupedLogEnd().then(() => {
                if (failed) {
                    log(JSON.stringify(calculatorParams))
                    log(JSON.stringify(calcResult))
                }
                expect(failed).to.be.false
                if (resultAlias) {
                    cy.wrap(calcResult).as(resultAlias)
                }
            })
        })
    })

}

export function getResult(calculatorParams: TestCaseParameters): Ogrs4CalcResult {

    const calcResult: Ogrs4CalcResult = {
        details: createOutputObject(),
        arpText: '',
        vrpText: '',
        svrpText: '',
        dcSrpBand: '',
        iicSrpBand: '',
        csrpType: '',
        csrpBand: '',
        csrpScore: '',
    }

    const result = createOutputObject()

    calculate('serious_violence_extended', calculatorParams, result)
    calculate('general_extended', calculatorParams, result)
    calculate('violence_extended', calculatorParams, result)

    // Attempt brief versions for SNSV, OGRS4G, OGRS4V if no results from the extended ones.
    calculate('serious_violence_brief', calculatorParams, result, result.SNSV_CALCULATED_DYNAMIC == 'Y')
    calculate('general_brief', calculatorParams, result, result.OGP2_CALCULATED == 'Y')
    calculate('violence_brief', calculatorParams, result, result.OVP2_CALCULATED == 'Y')

    // OSP and RSR
    ospRsrCalc(calculatorParams, result)

    // Compile results
    calcResult.details = result
    const arp = result.OGP2_CALCULATED == 'Y' ? result.OGP2_PERCENTAGE : result.OGRS4G_PERCENTAGE
    const arpBand = result.OGP2_CALCULATED == 'Y' ? result.OGP2_BAND : result.OGRS4G_BAND
    const arpType = result.OGP2_CALCULATED == 'Y' ? 'DYNAMIC' : result.OGRS4G_CALCULATED ? 'STATIC' : ''
    calcResult.arpText = `${arpType}  ${arp}%   ${arpBand}`

    const vrp = result.OVP2_CALCULATED == 'Y' ? result.OVP2_PERCENTAGE : result.OGRS4V_PERCENTAGE
    const vrpBand = result.OVP2_CALCULATED == 'Y' ? result.OVP2_BAND : result.OGRS4V_BAND
    const vrpType = result.OVP2_CALCULATED == 'Y' ? 'DYNAMIC' : result.OGRS4V_CALCULATED ? 'STATIC' : ''
    calcResult.vrpText = `${vrpType}  ${vrp}%   ${vrpBand}`

    const svrp = result.SNSV_CALCULATED_DYNAMIC == 'Y' ? result.SNSV_PERCENTAGE_DYNAMIC : result.SNSV_PERCENTAGE_STATIC
    const svrpBand = result.SNSV_CALCULATED_DYNAMIC == 'Y' ? result.SNSV_BAND_DYNAMIC : result.SNSV_BAND_STATIC
    const svrpType = result.SNSV_CALCULATED_DYNAMIC == 'Y' ? 'DYNAMIC' : result.SNSV_CALCULATED_STATIC ? 'STATIC' : ''
    calcResult.svrpText = `${svrpType}  ${svrp}%   ${svrpBand}`

    calcResult.dcSrpBand = result.OSP_DC_BAND?.toUpperCase()
    calcResult.iicSrpBand = result.OSP_IIC_BAND?.toUpperCase()

    calcResult.csrpBand = result.RSR_BAND?.toUpperCase()
    calcResult.csrpType = result.RSR_DYNAMIC == 'Y' ? 'DYNAMIC' : result.RSR_CALCULATED == 'Y' ? 'STATIC' : ''
    calcResult.csrpScore = ` ${result.RSR_PERCENTAGE}`

    return calcResult
}

function checkResult(description: string, expectedValue: string | number, actualValue: string | number): boolean {

    const failed = expectedValue != actualValue
    if (failed) {
        cy.groupedLog(`${description}: expected ${expectedValue}, got ${actualValue}. FAILED`)
    }
    return failed
}

export type Ogrs4CalcResult = {

    details: OutputParameters,
    arpText: string,
    vrpText: string,
    svrpText: string,
    dcSrpBand: string,
    iicSrpBand: string,
    csrpType: string,
    csrpBand: string,
    csrpScore: string,
}
