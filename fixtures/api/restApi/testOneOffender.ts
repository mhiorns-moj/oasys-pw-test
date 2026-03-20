import * as rest from '.'
import * as dbClasses from './dbClasses'
import * as restApi from './restApi'
import * as restApiDb from './restApiDb'

/** 
 * Tests all endpoints for all assessments for given offender CRN; returns an OffenderApisResult object including pass/fail, reporting output and timing stats.
 * All necessary data is pulled from the database to build expected responses.
 * 
 * Parameters:
 *  - crn (either probation or prison CRN as specified by the next parameter)
 *  - crnSource - 'prob' or 'pris'
 *  - skipPkOnlyCalls - if true, any APIs that are called with just an assessment PK will be skipped on the basis that the calling script is repeating an offender 
 *                      (selected this time using the prison CRN instead of probation) so these calls will be identical.
 */
export async function testOneOffender(parameters: { crn: string, crnSource: Provider, skipPkOnlyCalls: boolean, reportPasses: boolean }): Promise<OffenderApisResult> {

    const v1Endpoints: Endpoint[] = [
        'offences',
        'riskScores',
        'allRiskScores',
        'rmp',
    ]

    const apEndpoints: Endpoint[] = [
        'apOffence',
        'apNeeds',
        'apRmp',
        'apRoshSum',
        'apRiskInd',
        'apRiskAss',
        'apHealth',
        'apRosh',
    ]

    const v4AssessmentEndpoints: Endpoint[] = [
        'v4section1',
        'v4section2',
        'v4section3',
        'v4section4',
        'v4section5',
        'v4section6',
        'v4section7',
        'v4section8',
        'v4section9',
        'v4section10',
        'v4section11',
        'v4section12',
        'v4section13',
        'v4Rmp',
        'v4RoshFull',
        'v4RoshSumm',
        'v4Victim',
        'v4RiskIndividual',
        'v4RiskScoresAss',
        'crimNeeds',
    ]

    const v4RsrEndpoints: Endpoint[] = [
        'v4RiskScoresRsr',
    ]

    let failed = false
    const stats: EndpointStat[] = []
    const report: string[] = []


    // Get all relevant data from the OASys database
    const offenderData = await restApiDb.getOffenderWithAssessments(parameters.crnSource, parameters.crn)
    report.push(`Offender ${parameters.crnSource == 'prob' ? 'CRN' : 'NOMIS Id'}: ${parameters.crn}`)

    if (offenderData == null) {  // null return indicates no offender data or multiple offenders with the same CRN.  Tests for these cases are covered elsewhere in the regression pack
        report.push('Skipping this offender - no offender data or multiple offender records with the same CRN')
        report.push('')

    } else {
        // Store the elapsed time for database querying
        stats.push({ endpoint: 'database', responseTime: offenderData.dbElapsedTime })

        ////////////////////////////////////////////////////////////
        // Compile a set of parameters for calling the API functions
        const apiParams: EndpointParams[] = []

        if (parameters.crnSource == 'prob') { // Ignore 'pris' offenders for versions 1 to 3 endpoints

            // Add parameters for the V1 endpoints
            v1Endpoints.forEach((endpoint) => {
                const params: EndpointParams = { endpoint: endpoint, crn: offenderData.probationCrn, laoPrivilege: 'ALLOW' }
                apiParams.push(params)
            })

            // Add AP Initial
            const params: EndpointParams = { endpoint: 'apAsslist', crn: offenderData.probationCrn, laoPrivilege: 'ALLOW' }
            apiParams.push(params)

            // Add other AP endpoint params if the offender has assessments
            const apAssessments = offenderData.assessments.filter(rest.Ap.ApCommon.assessmentFilter)
            if (apAssessments.length > 0) {
                apAssessments.forEach((assessment) => addAssessment(apEndpoints, apiParams, offenderData.probationCrn, assessment))
            }

            // Use latest complete or locked incomplete assessment for the AssSumm - only if initiated after 2020 to avoid incompatible data. In reality should only be used from release 6.46
            const assSummAssessments = offenderData.assessments.filter((ass) =>
                !['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType)
                && ['COMPLETE', 'LOCKED_INCOMPLETE'].includes(ass.status)
                && ass.initiationDate > '2020')
            if (assSummAssessments.length > 0) {
                const assessment = assSummAssessments[assSummAssessments.length - 1]
                apiParams.push({
                    endpoint: assessment['sanIndicator'] == 'Y' || assessment['spIndicator'] == 'Y' ? 'assSummSan' : 'assSumm', crn: offenderData.probationCrn, laoPrivilege: 'ALLOW',
                    assessmentPk: assessment.assessmentPk, expectedStatus: assessment.status
                })
            }
        }

        // Add V4 asslist
        const v4Asslistparams: EndpointParams = {
            endpoint: 'v4AssList',
            crnSource: parameters.crnSource,
            crn: parameters.crnSource == 'prob' ? offenderData.probationCrn : offenderData.nomisId,
            laoPrivilege: 'ALLOW'
        }
        apiParams.push(v4Asslistparams)

        // Add other V4 endpoint params if the offender has assessments and if skipPkOnlyCalls parameter is false
        if (!parameters.skipPkOnlyCalls) {
            // V4 timeline includes layer2 but the subsequents do not
            const relevantAssessments = offenderData.assessments.filter(rest.V4Common.assessmentFilter).filter((ass) => ass.assessmentType != 'LAYER2')
            relevantAssessments.forEach((assessment) => addAssessment(v4AssessmentEndpoints, apiParams, offenderData.probationCrn, assessment))

            // Add RSRs
            const standaloneRsrs = offenderData.assessments.filter((ass) => ass.assessmentType == 'STANDALONE')
            standaloneRsrs.forEach((assessment) => addAssessment(v4RsrEndpoints, apiParams, offenderData.probationCrn, assessment))
        }

        // Add PNI - only if initiated after 2020 to avoid incompatible data
        const pniRelevantAssessments = offenderData.assessments.filter(rest.V4Common.pni.pniFilter).filter((ass) => ass.initiationDate > '2021')
        if (pniRelevantAssessments.length > 0) {
            const v4PniParams: EndpointParams = {
                endpoint: 'pni',
                crnSource: parameters.crnSource,
                crn: parameters.crnSource == 'prob' ? offenderData.probationCrn : offenderData.nomisId,
                additionalParameter: 'Y',
                laoPrivilege: 'ALLOW'
            }
            apiParams.push(v4PniParams)
            const custodyParams = JSON.parse(JSON.stringify(v4PniParams)) as EndpointParams
            custodyParams.additionalParameter = 'N'
            apiParams.push(custodyParams)
        }

        ///////////////////////////////////////////////////////////
        // Work out the expected responses, then call the endpoints
        const expectedValues = await rest.GetExpectedResponses.getExpectedResponses(offenderData, apiParams)
        const actualValues = await restApi.getMultipleRestData(apiParams)

        ////////////////////////////////////
        // Compare results for each endpoint
        for (let i = 0; i < apiParams.length; i++) {
            if (apiParams[i].endpoint == 'apAsslist' || apiParams[i].endpoint == 'v4AssList') {
                delete actualValues[i].result['assessments']  // spurious empty array object gets added to the asslist and allasslist endpoints, ignore for this test
            }
            if (apiParams[i].assessmentPk) {  // Write some assessment details to the log, including OASys version at initiation date
                const assessmentData = offenderData.assessments.filter((ass) => ass.assessmentPk == apiParams[i].assessmentPk)[0]
                const assVersion = assessmentData.assessmentType == 'STANDALONE' ? '' : ` v${(assessmentData as dbClasses.DbAssessment).assessmentVersion}`
                report.push(`${assessmentData.assessmentType}${assVersion} assessment (${assessmentData.assessmentPk}), initiation date ${assessmentData.initiationDate.substring(0, 10)} (${assessmentData.appVersion})`)
            }

            // Compare expected vs actuals and write results to the log
            const result = await restApi.checkApiResponse(expectedValues[i], actualValues[i], parameters.reportPasses)

            if (result.failed) {
                // Ignore defect that is low priority and not yet fixed - old assessments not found for AP endpoints when CRN contains lower-case letters
                if (offenderData.probationCrn.toUpperCase() != offenderData.probationCrn
                    && ['apOffence', 'apNeeds', 'apRmp', 'apRoshSum', 'apRiskInd', 'apRiskAss', 'apHealth', 'apRosh',].includes(apiParams[i].endpoint)
                    && result.output.filter((line) => line.includes('got notFound, No matching assessments')).length > 0
                    && result.output.length == 6) {
                    result.output.slice(0, 3).forEach((line) => report.push(line))
                    report.push('************************************************************')
                    report.push('Defect NOD-872 - assessment not returned for lower-case CRNs')
                    report.push('')
                }
                else {
                    failed = true
                }
            }
            result.output.forEach((line) => report.push(line))

            // Check response time and add to stats table, mark as SLOW if > 99ms
            let slow = actualValues[i].responseTime > 500 ? '**** VERY SLOW ****' : actualValues[i].responseTime > 99 ? '**** SLOW ****' : ''
            report.push(`${actualValues[i].responseTime}ms ${slow}`)
            stats.push({ endpoint: apiParams[i].endpoint, responseTime: actualValues[i].responseTime })
            report.push('')
        }
    }
    return { failed: failed, report: report, stats: stats }
}

function addAssessment(endpoints: Endpoint[], parameters: EndpointParams[], crn: string, assessment: dbClasses.DbAssessmentOrRsr) {

    endpoints.forEach((endpoint) => {
        const params: EndpointParams = {
            endpoint: endpoint, crn: crn,
            laoPrivilege: 'ALLOW', assessmentPk: assessment.assessmentPk, expectedStatus: assessment.status
        }
        parameters.push(params)
    })
}
