import { OAuth2Client } from '@badgateway/oauth2-client'     //  See https://github.com/badgateway/oauth2-client#readme for documentation
import axios from 'axios'                                    //      https://www.npmjs.com/package/axios
import { flatten } from 'flat'                               //      https://www.npmjs.com/package/flat

import * as rest from '.'
import { restApiUrls, restErrorResults } from './restApiUrls'
import { testEnvironment } from '../../../localSettings'
import { OasysDateTime } from 'oasys'

const restConfig = testEnvironment.rest

const client = new OAuth2Client({

    clientId: restConfig.clientId,
    clientSecret: restConfig.clientSecret,
    server: restConfig.baseUrl,
    tokenEndpoint: restApiUrls.filter((endpoint) => endpoint.endpoint == 'token')[0].url,
})

var token = ''

/**
 * Generic function to get a response from any of the endpoints defined in environments.ts.
 * Parameter is an EndpointParams object, which includes the endpoint name, crn, laoPrivilege, plus other parameters that may be relevant depending on the endpoint.
 * 
 * The RestResponse return value includes the url called, status code, returned data and error message if any.
 * 
 * This function is called via cypress.config.ts using `cy.task('getRestData', parameters)`
 */
export async function getRestData(parameters: EndpointParams): Promise<RestResponse> {

    // Construct the URL with parameters
    restApiUrls.filter((endpoint) => endpoint.endpoint == parameters.endpoint)[0].url
    let url = (' ' + restApiUrls.filter((endpoint) => endpoint.endpoint == parameters.endpoint)[0].url).slice(1)  // have to force copying to a new object to avoid problems with replace function
    Object.keys(parameters).forEach((parameter) => {
        if (parameter != 'endpoint') {
            url = url.replace(`{${parameter}}`, parameters[parameter])
        }
    })

    var restResponse: RestResponse = { url: url, statusCode: null, result: null, message: null, responseTime: null }

    try {
        await getTokenIfRequired()
        OasysDateTime.startTimer('restResponse')
        const response = await axios.request({
            baseURL: restConfig.baseUrl,
            url: url,
            headers: { 'authorization': 'Bearer ' + token },
            validateStatus: () => true
        })

        restResponse.statusCode = getStatusCode(response.status)
        restResponse.result = response.data
        if (response.status != 200) {
            restResponse.message = response.data.message
        }
        restResponse.responseTime = OasysDateTime.elapsedTime('restResponse')
    }
    catch (err) {
        restResponse.statusCode = 'error'
        restResponse.message = err.message
    }

    return restResponse
}

async function getTokenIfRequired() {

    // TODO  check for expiry

    if (token == '') {
        const tokenObject = await client.clientCredentials()
        token = tokenObject.accessToken
    }
}

/**
 * Generic function to get multiple responses from any of the endpoints defined in environments.ts.
 * Parameter is an EndpointParams object array, which includes the endpoint name, crn, laoPrivilege, plus other parameters that may be relevant depending on the endpoint.
 * 
 * The RestResponse array return value includes url called, status code, returned data and error message if any.
 * 
 * This function is called via cypress.config.ts using `cy.task('getMultipleRestData', parameters)`
 */
export async function getMultipleRestData(parameters: EndpointParams[]): Promise<RestResponse[]> {

    const response: RestResponse[] = []

    for (let i = 0; i < parameters.length; i++) {
        const r = await getRestData(parameters[i])
        response.push(r)
    }
    return response
}

function getStatusCode(status: number): RestStatus {

    switch (status) {
        case 0: return 'error'
        case 200: return 'ok'
        case 400: return 'badRequest'
        case 403: return 'forbidden'
        case 404: return 'notFound'
        case 409: return 'conflict'
    }
}


/**
 * Checks an endpoint response value against the expected return values.
 * Parameters are:
 * 
 *      1) an object containing the expected values, in the expected structure.
 *      2) an object containing the actual response values.
 * 
 * Returns a CheckAPIResult object with two properties: failed (boolean) and output (string[] with the log details). 
 */
export async function checkApiResponse(expectedValues: rest.Common.EndpointResponse | RestErrorResult, response: RestResponse, reportPasses: boolean): Promise<CheckAPIResult> {

    let failed = false
    let logText: string[] = []

    logText.push(`Checking ${response.url}`)

    // If an error is expected, check the error message
    if (expectedValues['statusCode'] != undefined) {
        const expectedResult = expectedValues as RestErrorResult

        if (response.statusCode == 'ok') {
            logText.push(`Error checking API ${response.url}: expected ${expectedResult.statusCode}, got ${response.statusCode}`)
            failed = true
        } else {
            if (response.statusCode != expectedResult.statusCode) {
                logText.push(`Error checking API ${response.url}: expected status ${expectedResult.statusCode}, got ${response.statusCode}`)
                failed = true
            }
            if (response.message != expectedResult.message &&  // Accept mismatch if it's no assessments vs no matching assessments - rules for this are unclear
                !(expectedResult.message == restErrorResults.noAssessments.message && response.message == restErrorResults.noMatchingAssessments.message)) {
                logText.push(`Error checking API ${response.url}: expected '${expectedResult.message}', got '${response.message}'`)
                failed = true
            }
        }

        // Fail if an error is returned but was not expected
    } else if (response.statusCode != 'ok') {

        logText.push(`Error checking API ${response.url}: got ${response.statusCode}, ${response.message}`)
        failed = true

        // otherwise check the contents of the response
    } else {
        let data = JSON.stringify(response.result)
        if (data.charCodeAt(0) == 34) {
            data = data.substring(1, data.length - 1)
        }
        try {
            response.result = JSON.parse(data)
        } catch (e) {
            logText.push(`************ FAILED ****************** Error parsing JSON for ${response.url}: ${e.message}`)
            logText.push(data)
            logText.push('')
            return { failed: true, output: logText }
        }


        // Sort any arrays as the order can be variable, easier to compare them in the same order
        sortArrays(expectedValues)
        sortArrays(response.result)

        // Flatten out to a single object using the library linked above.
        // Each property of this object has a multi-level key (e.g. assessments[0].offenceDetails[1].offenceType) plus the value
        const expectedElements = flatten(expectedValues)
        const actualElements = flatten(response.result)

        // Check that all expected elements have been received and are correct
        Object.keys(expectedElements).forEach((key) => {
            if (Object.keys(actualElements).includes(key)) {
                const stringType = typeof expectedElements[key] == 'string'
                const expectedValue = stringType ? expectedElements[key]?.substring(0, 3500) : expectedElements[key]
                const receivedValue = stringType ? actualElements[key]?.replaceAll('\x02', '')?.substring(0, 3500) : actualElements[key]

                if (expectedValue != receivedValue) {
                    const newline = expectedValue?.length > 100 ? '\n                ' : ''
                    logText.push(`Incorrect value for ${key}: ${newline}expected '${expectedValue}', ${newline}received '${receivedValue}'`)
                    failed = true
                }
            }
            else {
                logText.push(`Expected element not received: ${key} with value '${expectedElements[key]}'`)
                failed = true
            }
        })

        // Check that there are no extra elements received
        Object.keys(actualElements).forEach((key) => {
            if (!Object.keys(expectedElements).includes(key)) {
                logText.push(`Received element not expected: ${key} with value '${actualElements[key]}'`)
                failed = true
            }
        })
    }

    if (failed) {
        logText.push('************* FAILED *************')
        logText.push(`    expect: ${JSON.stringify(expectedValues)}`)
        logText.push(`    response: ${JSON.stringify(response)}`)
        logText.push('**********************************')
    } else {
        logText.push('Passed')
        if (reportPasses) {
            logText.push(`    response: ${JSON.stringify(response)}`)
        }
    }
    return { failed: failed, output: logText }

}

// Sort all arrays in the expected and received objects recursively, to simplify matching
function sortArrays(obj: any) {

    if (!obj) return

    const isArray = obj instanceof Array
    if (isArray) {
        if (obj.length > 0) {
            obj.forEach((item) => { sortArrays(item) })
            if (obj[0]['objectiveSequence'] == undefined) {  // Don't attempt to sort objectives, the sequence no is used in the query
                obj.sort(arraySort)
            }
        }
    } else if (typeof obj == 'object') {
        Object.keys(obj).forEach((key) => {
            sortArrays(obj[key])
        })
    }
}

function arraySort(a: object, b: object): number {

    const aString = JSON.stringify(a)
    const bString = JSON.stringify(b)

    return aString > bString ? 1 : aString < bString ? -1 : 0
}
