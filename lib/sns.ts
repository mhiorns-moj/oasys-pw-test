/**
 * __oasys.Sns.*function*__  
 * 
 * Functions for checking the SNS messages (as stored in the database log).
 * 
 * @module SNS
 */

import { flatten } from 'flat'; // https://www.npmjs.com/package/flat

import * as oasys from 'lib'
import { DbAssessmentOrRsr, DbSns } from 'sns/dbClasses'
import { SnsMessage } from 'sns/snsClasses'

/** 
 * Test all SNS messages for the latest assessment or standalone RSR for a given offender.
 * This function should be called immediately after completing the assessment/RSR, or immediately after countersigning.
 * 
 * It determines which messages should be in the message table, and checks the message content for each against OASys data.
 * The test will fail if there are any mismatches.
 * 
 * The third optional parameter can be a list of expected message types, allowing confirmation that the data is in the right state to generate those messages.
 */
export function testSnsMessageData(crn: string, type: AssessmentOrRsr, expectingMessages?: ('AssSumm' | 'OGRS' | 'OPD' | 'RSR')[]) {

    let failed = false
    const actualSnsMessages: DbSns[] = []

    cy.groupedLogStart(`Testing SNS messages for latest ${type} for offender ${crn}`)

    // Get latest assessment or RSR from the database and build the expected SNS messages.
    getAssessment(crn, type, 'assessmentAlias')
    cy.get<DbAssessmentOrRsr>('@assessmentAlias').then((assessment) => {

        if (assessment == null) {
            cy.groupedLog(`No ${type} found`)
        } else {
            // For RoSHA assessments - check if risk assessment has been completed.
            if (type == 'assessment' && assessment.purposeOfAssessment == 'Risk of Harm Assessment') {
                oasys.Db.getData(DbAssessmentOrRsr.roshaQuestionQuery(assessment.pk), 'roshaQuestionAlias')
                cy.get<string[][]>('@roshaQuestionAlias').then((roshaQuestionData) => {
                    if (roshaQuestionData.length > 0) {
                        assessment.roshaRiskAssessmentCompleted = roshaQuestionData[0][0] == 'YES'
                    }
                })
            }

            // Get SNS messages from the database for the assessment - limit to last 15 seconds
            oasys.Db.getData(DbSns.query(assessment.pk, type, 15), 'snsAlias')

            cy.get<string[][]>('@snsAlias').then((snsData) => {
                snsData.forEach((sns) => {
                    actualSnsMessages.push(new DbSns(sns))
                })
            }).then(() => {

                // Check all expected messages against actuals
                const expectedSnsMessages = buildExpectedMessages(assessment, crn)
                // If 'expectingMessages' parameter has been specified, check it against expectedSnsMessages determined from database values
                if (expectingMessages != null) {
                    const dbExpectedMessages = expectedSnsMessages.map((e) => e.messageType)
                    if (expectingMessages.length != (expectedSnsMessages.length)) {
                        failed = true
                    } else {
                        dbExpectedMessages.forEach((msg) => {
                            if (!expectingMessages.includes(msg)) {
                                failed = true
                            }
                        })
                    }
                    if (failed) {
                        cy.groupedLog(`Expecting ${JSON.stringify(expectingMessages)} messages, data suggested ${JSON.stringify(dbExpectedMessages)} should be expected.`)
                    }
                }

                expectedSnsMessages.forEach((expectedSnsMessage) => {
                    cy.groupedLog(`* ${expectedSnsMessage.messageType}`)
                    const actualSnsMessage = getLastActualSnsMessage(actualSnsMessages, expectedSnsMessage.messageType)
                    if (actualSnsMessage == null) {
                        failed = true
                        cy.groupedLog(`Expected ${expectedSnsMessage.messageType} message not found`)
                    } else if (actualSnsMessage.messageSubject != expectedSnsMessage.messageSubject) {
                        failed = true
                        cy.groupedLog(`Expected subject: ${expectedSnsMessage.messageSubject}, got: ${actualSnsMessage.messageSubject}`)
                    }
                    else {
                        cy.groupedLog(JSON.stringify(actualSnsMessage))
                        if (validateSNS(expectedSnsMessage, actualSnsMessage)) {
                            failed = true
                        }
                        else {
                            cy.groupedLog(`Passed`)
                        }
                    }
                    cy.groupedLog('')
                })
                // Check for unexpected messages in the database
                actualSnsMessages.forEach((actualSnsMessage) => {
                    if (expectedSnsMessages.filter(m => m.messageType == actualSnsMessage.messageType).length == 0) {
                        failed = true
                        cy.groupedLog(`Found ${actualSnsMessage.messageType} message not expected`)
                    }
                })
            })
        }

    }).then(() => {
        cy.groupedLogEnd().then(() => {
            if (failed) {
                throw new Error('Error testing SNS messages')
            }
        })
    })

}

function getAssessment(crn: string, type: AssessmentOrRsr, resultAlias: string) {

    if (type == 'assessment') {
        oasys.Db.getData(DbAssessmentOrRsr.assessmentQuery(crn), 'dbAssessmentData')
    } else {
        oasys.Db.getData(DbAssessmentOrRsr.rsrQuery(crn), 'dbAssessmentData')
    }
    cy.get<string[][]>('@dbAssessmentData').then((assessmentData) => {
        if (assessmentData.length == 0) {
            cy.wrap(null).as(resultAlias)
        } else {
            cy.wrap(new DbAssessmentOrRsr(assessmentData[0], type)).as(resultAlias)
        }
    })
}

function buildExpectedMessages(assessment: DbAssessmentOrRsr, crn: string): SnsMessage[] {

    const expectedSnsMessages: SnsMessage[] = []
    const excludedAssessmentTypes = ['Risk of Harm Assessment', 'TSP Assessment', 'RSR Only']

    if (assessment.type == 'assessment'
        && assessment.completedDate != null
        && (assessment.roshaRiskAssessmentCompleted || !excludedAssessmentTypes.includes(assessment.purposeOfAssessment))) {
        expectedSnsMessages.push(new SnsMessage(assessment, crn, 'AssSumm'))
    }
    if (assessment.ogrs1yr != null && (assessment.status == 'SIGNED' || assessment.countersignedDate == null)) {  // OGRS message on signing or completion if no countersigning required
        expectedSnsMessages.push(new SnsMessage(assessment, crn, 'OGRS'))
    }
    if (assessment.type == 'assessment' && assessment.status == 'COMPLETE' && (assessment.opdResult == 'SCREEN IN' || (assessment.opdResult == 'SCREEN OUT' && assessment.opdOverride == 'YES'))) {
        expectedSnsMessages.push(new SnsMessage(assessment, crn, 'OPD'))
    }
    if (assessment.rsrScore != null && (assessment.status == 'SIGNED' || assessment.countersignedDate == null)) {  // RSR message on signing or completion if no countersigning required
        expectedSnsMessages.push(new SnsMessage(assessment, crn, 'RSR'))
    }

    return expectedSnsMessages
}

function getLastActualSnsMessage(actualSnsMessages: DbSns[], messageType: SnsMessageType): DbSns {

    const filtered = actualSnsMessages.filter(m => m.messageType == messageType)
    return filtered.length == 0 ? null : filtered[0]
}

function validateSNS(expected: object, received: object): boolean {

    if (expected == undefined && received == undefined) return false
    if (expected == undefined || received == undefined) return true

    let failed = false

    // Flatten out to a single object using the library linked above.
    // Each property of this object has a multi-level key (e.g. messageData.occurredAt) plus the value
    const expectedElements = flatten(expected)
    const actualElements = flatten(received)

    // Check that all expected elements have been received and are correct
    Object.keys(expectedElements).forEach((key) => {
        if (Object.keys(actualElements).includes(key)) {
            if (key != 'messageData.occurredAt' && expectedElements[key] != actualElements[key]) {
                cy.groupedLog(`Incorrect value for ${key}: expected '${expectedElements[key]}', received '${actualElements[key]}'`)
                failed = true
            }
        }
        else {
            cy.groupedLog(`Expected element not received: ${key} with value '${expectedElements[key]}'`)
            failed = true
        }
    })

    // Check that there are no extra elements received
    Object.keys(actualElements).forEach((key) => {
        if (!Object.keys(expectedElements).includes(key)) {
            cy.groupedLog(`Received element not expected: ${key} with value '${actualElements[key]}'`)
            failed = true
        }
    })

    return failed
}