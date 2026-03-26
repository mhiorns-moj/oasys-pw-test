import { Page, TestInfo, expect } from '@playwright/test'
import { flatten } from 'flat' // https://www.npmjs.com/package/flat

import { assessment, Oasys, OasysDb } from 'fixtures'
import { DbAssessmentOrRsr, DbSns } from './dbClasses'
import { SnsMessage } from './snsClasses'

export class Sns {

    constructor(readonly page: Page, readonly oasys: Oasys, readonly oasysDb: OasysDb) { }


    /** 
     * Test all SNS messages for the latest assessment or standalone RSR for a given offender.
     * This async should be called immediately after completing the assessment/RSR, or immediately after countersigning.
     * 
     * It determines which messages should be in the message table, and checks the message content for each against OASys data.
     * The test will fail if there are any mismatches.
     * 
     * The third optional parameter can be a list of expected message types, allowing confirmation that the data is in the right state to generate those messages.
     */
    async testSnsMessageData(crn: string, type: AssessmentOrRsr, expectingMessages?: ('AssSumm' | 'OGRS' | 'OPD' | 'RSR')[]) {

        let failed = false
        const actualSnsMessages: DbSns[] = []

        log('', `Testing SNS messages for latest ${type} for offender ${crn}`)

        // Get latest assessment or RSR from the database and build the expected SNS messages.
        const assessment = await this.getAssessment(crn, type)

        if (assessment == null) {
            log(`No ${type} found`)
            failed = true
        } else {
            // For RoSHA assessments - check if risk assessment has been completed.
            if (type == 'assessment' && assessment.purposeOfAssessment == 'Risk of Harm Assessment') {
                const roshaQuestionData = await this.oasysDb.getData(DbAssessmentOrRsr.roshaQuestionQuery(assessment.pk))
                if (roshaQuestionData.length > 0) {
                    assessment.roshaRiskAssessmentCompleted = roshaQuestionData[0][0] == 'YES'
                }
            }

            // Get SNS messages from the database for the assessment - limit to last 5 seconds
            const snsData = await this.oasysDb.getData(DbSns.query(assessment.pk, type, 5))
            for (let sns of snsData) {
                actualSnsMessages.push(new DbSns(sns))
            }
            // Check all expected messages against actuals
            const expectedSnsMessages = this.buildExpectedMessages(assessment, crn)

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
                    log(`Expecting ${JSON.stringify(expectingMessages)} messages, data suggested ${JSON.stringify(dbExpectedMessages)} should be expected.`)
                }
            }

            for (let expectedSnsMessage of expectedSnsMessages) {

                const actualSnsMessage = this.getLastActualSnsMessage(actualSnsMessages, expectedSnsMessage.messageType)
                if (actualSnsMessage == null) {
                    failed = true
                    log(`FAILED - Expected ${expectedSnsMessage.messageType} message not found`)
                } else if (actualSnsMessage.messageSubject != expectedSnsMessage.messageSubject) {
                    failed = true
                    log(`FAILED - Expected subject: ${expectedSnsMessage.messageSubject}, got: ${actualSnsMessage.messageSubject}`)
                } else {
                    if (this.validateSNS(expectedSnsMessage, actualSnsMessage)) {
                        log(`FAILED - ${expectedSnsMessage.messageType}`)
                        log(JSON.stringify(actualSnsMessage))
                        failed = true
                    }
                    else {
                        log(`* ${expectedSnsMessage.messageType} - passed`)
                    }
                }
                log('')

                // Check for unexpected messages in the database
                actualSnsMessages.forEach((actualSnsMessage) => {
                    if (expectedSnsMessages.filter(m => m.messageType == actualSnsMessage.messageType).length == 0) {
                        failed = true
                        log(`FAILED - Found ${actualSnsMessage.messageType} message not expected`)
                    }
                })
            }
        }

        expect(failed).toBeFalsy()

    }

    async getAssessment(crn: string, type: AssessmentOrRsr): Promise<DbAssessmentOrRsr> {

        const query = type == 'assessment' ? DbAssessmentOrRsr.assessmentQuery(crn) : DbAssessmentOrRsr.rsrQuery(crn)
        const assessmentData = await this.oasysDb.getData(query)

        if (assessmentData.length == 0) {
            return null
        } else {
            return new DbAssessmentOrRsr(assessmentData[0], type)
        }
    }

    buildExpectedMessages(assessment: DbAssessmentOrRsr, crn: string): SnsMessage[] {

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

    getLastActualSnsMessage(actualSnsMessages: DbSns[], messageType: SnsMessageType): DbSns {

        const filtered = actualSnsMessages.filter(m => m.messageType == messageType)
        return filtered.length == 0 ? null : filtered[0]
    }

    validateSNS(expected: object, received: object): boolean {

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
                    log(`Incorrect value for ${key}: expected '${expectedElements[key]}', received '${actualElements[key]}'`)
                    failed = true
                }
            }
            else {
                log(`Expected element not received: ${key} with value '${expectedElements[key]}'`)
                failed = true
            }
        })

        // Check that there are no extra elements received
        Object.keys(actualElements).forEach((key) => {
            if (!Object.keys(expectedElements).includes(key)) {
                log(`Received element not expected: ${key} with value '${actualElements[key]}'`)
                failed = true
            }
        })

        return failed
    }
}