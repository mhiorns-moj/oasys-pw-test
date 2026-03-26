import { restErrorResults } from '../../../cypress/support/restApi/restApiUrls'

/**
 * Tests all the endpoints for the standard error conditions
 */

describe('RestAPI regression tests', () => {


    it('Error conditions - all endpoints', () => {

        const v1Endpoints: Endpoint[] = [
            'offences',
            'riskScores',
            'allRiskScores',
            'rmp',
            'timeline',
            'apAsslist',
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

        const v3Endpoints: Endpoint[] = [
            'assSumm',
            'assSummSan',
        ]

        const v4Endpoints: Endpoint[] = [
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

        v1Endpoints.forEach((endpoint) => {
            oasys.Api.checkAPIError(
                {
                    endpoint: endpoint,
                    crn: 'PROB7373',
                    laoPrivilege: 'ALLOW'
                },
                restErrorResults.duplicateCRN
            )
            oasys.Api.checkAPIError(
                {
                    endpoint: endpoint,
                    crn: 'ZZZXXXX',
                    laoPrivilege: 'ALLOW'
                },
                restErrorResults.noOffender
            )
            oasys.Api.checkAPIError(
                {
                    endpoint: endpoint,
                    crn: 'PROB7373',
                    laoPrivilege: 'rubbish'
                },
                restErrorResults.badParameters
            )
            oasys.Api.checkAPIError(
                {
                    endpoint: endpoint,
                    crn: 'ZCAWNYY',
                    laoPrivilege: 'LIMIT'
                },
                restErrorResults.forbidden
            )
        })

        apEndpoints.forEach((endpoint) => {
            oasys.Api.checkAPIError(
                {
                    endpoint: endpoint,
                    crn: 'PROB7373',
                    assessmentPk: 1328593,
                    expectedStatus: 'COMPLETE',
                    laoPrivilege: 'ALLOW'
                },
                restErrorResults.noAssessments
            )
            oasys.Api.checkAPIError(
                {
                    endpoint: endpoint,
                    crn: 'ZZZXXXX',
                    assessmentPk: 1328593,
                    expectedStatus: 'COMPLETE',
                    laoPrivilege: 'ALLOW'
                },
                restErrorResults.noAssessments
            )
            oasys.Api.checkAPIError(
                {
                    endpoint: endpoint,
                    crn: 'PROB7373',
                    assessmentPk: 1328593,
                    expectedStatus: 'COMPLETE',
                    laoPrivilege: 'rubbish'
                },
                restErrorResults.badParameters
            )
            oasys.Api.checkAPIError(
                {
                    endpoint: endpoint,
                    crn: 'ZCAWNYY',
                    assessmentPk: 1651500,
                    expectedStatus: 'OPEN',
                    laoPrivilege: 'LIMIT'
                },
                restErrorResults.forbidden
            )
        })

        // Check v4 Asslist
        oasys.Api.checkAPIError(
            {
                endpoint: 'v4AssList',
                crnSource: 'prob',
                crn: 'PROB7373',
                laoPrivilege: 'ALLOW'
            },
            restErrorResults.duplicateCRN
        )
        oasys.Api.checkAPIError(
            {
                endpoint: 'v4AssList',
                crnSource: 'prob',
                crn: 'ZZZXXXX',
                laoPrivilege: 'ALLOW'
            },
            restErrorResults.noOffender
        )
        oasys.Api.checkAPIError(
            {
                endpoint: 'v4AssList',
                crnSource: 'prob',
                crn: 'PROB7373',
                laoPrivilege: 'rubbish'
            },
            restErrorResults.badParameters
        )
        oasys.Api.checkAPIError(
            {
                endpoint: 'v4AssList',
                crnSource: 'prob',
                crn: 'ZCAWNYY',
                laoPrivilege: 'LIMIT'
            },
            restErrorResults.forbidden
        )

        // V3 (asssumm) endpoints
        v3Endpoints.forEach((endpoint) => {
            oasys.Api.checkAPIError(
                {
                    endpoint: endpoint,
                    assessmentPk: 1328593,
                    expectedStatus: 'COMPLETE',
                    laoPrivilege: 'rubbish'
                },
                restErrorResults.badParameters
            )
            oasys.Api.checkAPIError(
                {
                    endpoint: endpoint,
                    assessmentPk: 1651500,
                    crn: 'ZCAWNYY',
                    expectedStatus: 'COMPLETE',
                    laoPrivilege: 'LIMIT'
                },
                restErrorResults.forbidden
            )
        })

        // V4 assessment endpoints
        v4Endpoints.forEach((endpoint) => {
            oasys.Api.checkAPIError(
                {
                    endpoint: endpoint,
                    assessmentPk: 1328593,
                    laoPrivilege: 'ALLOW'
                },
                restErrorResults.noAssessments
            )
            oasys.Api.checkAPIError(
                {
                    endpoint: endpoint,
                    assessmentPk: 1328593,
                    laoPrivilege: 'rubbish'
                },
                restErrorResults.badParameters
            )
            oasys.Api.checkAPIError(
                {
                    endpoint: endpoint,
                    assessmentPk: 1651500,
                    laoPrivilege: 'LIMIT'
                },
                restErrorResults.forbidden
            )
        })

        oasys.Api.checkAPIError(
            {
                endpoint: 'v4RiskScoresRsr',
                assessmentPk: 9999999,
                laoPrivilege: 'ALLOW'
            },
            restErrorResults.noAssessments
        )
        oasys.Api.checkAPIError(
            {
                endpoint: 'v4RiskScoresRsr',
                assessmentPk: 1732,
                laoPrivilege: 'rubbish'
            },
            restErrorResults.badParameters
        )
        oasys.Api.checkAPIError(
            {
                endpoint: 'v4RiskScoresRsr',
                assessmentPk: 1732,
                laoPrivilege: 'LIMIT'
            },
            restErrorResults.forbidden
        )

    })

})
