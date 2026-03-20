/**
 * __oasys.Api.*function*__  
 * 
### Rest API testing

The `oasys\tests\regression\restAPI` folder contains two tests which aim to carry out a comprehensive regression test on all endpoints.

#### `oasys\tests\regression\restAPI\endpointErrors.cy.ts`

This test calls each endpoint with parameters designed to generate an error condition, including:
  - duplicate CRN
  - invalid CRN
  - invalid LAO parameter
  - access denied due to LAO status
  - no assessment found

#### `oasys\tests\regression\restAPI\testAllApisMultipleOffenders.cy.ts`

This runs a regression test for all endpoints for a sample of offenders extracted from the database.  Offenders are selected on a partially random basis - 
there are 10 groups of offenders, each created prior to a random date in each of the last 10 years.  There is also another set of specific offenders that are known to have certain
data to ensure good test coverage.

For each selected offender, and each assessment for that offender, all necessary data is extracted from the database and used to build an expected response for each endpoint.
These expected responses are then compared against the actual responses, to identify missing properties, extra properties and incorrect values.

### Adding new APIs

The following steps are required to add any new endpoints to the API tests:

  - if any new data from the OASys database is required, update or add the appropriate class in `oasys\restAPI\dbClasses.ts`.  Each class here contains the relevant SQL query
    as well as a constructor to create an object using the data returned by that query.  If new classes/queries are added, you will also have to update the code in
    `cypress\support\restAPIdb.ts` that runs the queries.
  - add the new endpoint (assigning an appropriate name) to the `Endpoint` enum in `oasys\restAPI\callAPI.ts`.
  - use that name to add the url to the `restAPIUrls` const in `cypress\support\environments.ts`.
  - create a new class to define the expected endpoint response (details below).
  - add the new endpoint to the list of function calls in `getSingleResponse` in `oasys\restAPI\getExpectedResponses.ts`.
  - add the new endpoint to the appropriate list in `oasys\restAPI\testOneOffender.ts`.
  - add the new endpoint to the appropriate list in `oasys\tests\regression\restAPI\endpointErrors.cy.ts`.

#### Endpoint classes

Expected responses are constructed using Typescript classes to define all the properties; there is a class for each endpoint in one of the folders under `oasys\restAPI`.
Common values (such as the assessment timeline and common assessment details) are added by the base classes, e.g. `oasys\restAPI\v4\v4Common.ts` which in turn inherits from 
`oasys\restAPI\common.ts`.

Each class file must be referenced in the `index.ts` file in the same folder, and must contain the items described below.  In general the best approach is to copy an existing class
file and modify it to fit the new specification; most new endpoints will be similar others in the `oasys\restAPI\v4` folder so one of these is likely to be a good starting point.

#### `function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: api.EndpointParams, resultAlias: string)`

This function is called from `oasys\restAPI\getExpectedResponses.ts`, and returns the expected endpoint response using a Cypress alias. The required parameters are:
  - a `DbOffenderWithAssessments` object, this will contain all necessary offender and assessment data
  - the endpoint parameters (e.g. endpoint name, CRN, assessment PK etc)

It identifies the relevant assessment details, then creates a response object using classes like these examples:

#### `class RoshSummEndpointResponse extends v4Common.V4EndpointResponse`
#### `RoshSummAssessment extends v4Common.V4AssessmentCommon`

These, together with any other classes appropriate to each endpoint, contain property names that match the expected JSON property names, and are populated with the supplied 
offender and assessment data.
 * 
 * @module API
 */

/** 
 * Tests all endpoints for all assessments for given offender probation CRN; uses a result alias to return a true/false result (true if any tests fail).
 * All necessary data is pulled from the database to build expected responses.
 * 
 * Parameters:
 *  - crn (either probation or prison CRN as specified by the next parameter)
 *  - crnSource - 'prob' or 'pris'
 *  - resultAlias - a Cypress alias name used to return the result
 *  - skipPkOnlyCalls - if true, any APIs that are called with just an assessment PK will be skipped on the basis that the calling script is repeating an offender 
 *                      (selected this time using the prison CRN instead of probation) so these calls will be identical.
 *  - stats - optional array of EndpointStat objects to collect timing stats
 */

export function testOneOffender(crn: string, crnSource: Provider, resultAlias: string, skipPkOnlyCalls: boolean,
  reportPasses: boolean, stats: EndpointStat[] = null) {

  cy.task('testApisForOffender', { crn: crn, crnSource: crnSource, skipPkOnlyCalls: skipPkOnlyCalls, stats: stats, reportPasses: reportPasses })
    .then((result: OffenderApisResult) => {

      cy.groupedLogStart(result.report[0])
      result.report.slice(1).forEach((reportLine) => {
        cy.groupedLog(reportLine)
      })
      cy.groupedLogEnd()

      if (stats) result.stats.forEach((stat) => { stats.push(stat) })

      cy.wrap(result.failed).as(resultAlias)
    })

}

/**
 * Calls an endpoint and checks the error conditions where a status code other than OK is expected, along with an error message.
 * Parameters are:
 *      1) an EndpointParams object including the endpoint and associated parameters such as CRN
 *      2) a RestErrorResult object defining the expected result, standard responses are defined in the RestErrorResult class in this module.
 *      3) an optional ouptut alias to return results.
 * 
 * If the last parameter is included, the test will not fail.  The output that can be accessed via the supplied alias
 * is a boolean, set to true if the check failed. 
 */
export function checkAPIError(parameters: EndpointParams, expectedResult: RestErrorResult, resultAlias: string = '') {

  cy.task('getRestData', parameters).then((response: RestResponse) => {

    let failed = false
    cy.groupedLogStart(`Checking RestAPI response for: ${response.url}, expecting ${expectedResult.statusCode}`)
    cy.groupedLog(`result: ${JSON.stringify(response.result)}`)

    if (response.statusCode != expectedResult.statusCode) {
      cy.groupedLog(`Error checking API ${response.url}: expected status ${expectedResult.statusCode}, got ${response.statusCode}`)
      failed = true
    }

    if (response.message != expectedResult.message) {
      cy.groupedLog(`Error checking API ${response.url}: expected '${expectedResult.message}', got '${response.message}'`)
      failed = true
    }
    cy.groupedLogEnd().then(() => {
      if (resultAlias == '') {
        if (failed) {
          throw new Error('Failed checking RestAPI response')
        }
      } else {
        return failed
      }
    })
  })
}
