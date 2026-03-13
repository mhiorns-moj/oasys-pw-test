/**
 * __oasys.Db.*function*__  
 * 
 * Functions for checking and retrieving database values.
 * 
 * Querying the Oracle database during a test in Cypress is relatively complex due to timing considerations and the fact that the Javascript test code is executed in the
 * browser and cannot access the database.
 * 
 * The actual database interaction is in cypress/support/oasysDb.ts, called via cy.task functions defined in cypress.config.ts; this module provides a set of functions to
 * handle the cy.task calls.  Most either fail the test if checks find the wrong values, or require the use of Cypress aliases to get results back, e.g.
 * 
 *  > `oasys.Db.selectCount(``select count(*) from eor.offender where family_name = '${surname}'``, 'count')`  
 *  > `cy.get<number>('@count').then((count) => {`  
 *  > &nbsp;&nbsp;&nbsp;&nbsp;`cy.log(count.toString())`  
 *  > &nbsp;&nbsp;&nbsp;&nbsp;`if (count > 1) {`  
 *  > &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`....`  
 *  > &nbsp;&nbsp;&nbsp;&nbsp;`}`  
 *  > `})`
 * 
 * @module Database
*/

import { Temporal } from '@js-temporal/polyfill'
import { OasysDateTime } from 'lib'

/**
 * Checks a set of values against the result of a single-row database query, test fails if there are any mismatches.  Parameters are:
 *   - table name
 *   - where clause
 *   - object containing pairs of column names and expected values.  Expected values can be string or date (Temporal PlainDateTime) types.
 * 
 * e.g. `checkDbValues('oasys_set', 'oasys_set_pk = 123456', { family_name: 'Smith', forename_1: 'John' })`
 * 
 * Fails if more than one row is returned.
 */
export function checkDbValues(table: string, where: string, values: { [keys: string]: string | Temporal.PlainDateTime }) {

    var query = 'select '
    var firstCol = true
    const columnNames: string[] = []
    const expectedValues: (string | Temporal.PlainDateTime)[] = []
    var failed = false

    Object.keys(values).forEach(name => {
        if (firstCol) {
            firstCol = false
        } else {
            query += ', '
        }
        const stringType = !values[name] || typeof values[name] == 'string'
        query += stringType ? name : `to_char(${name}, '${OasysDateTime.oracleTimestampFormat}')`
        columnNames.push(name)
        expectedValues.push(values[name])
    })

    query += ` from eor.${table} where ${where}`

    cy.task('getData', query).then((result: DbResponse) => {
        cy.groupedLogStart(`Checking database values`)
        cy.groupedLog(`Table: ${table}, where: ${where}`)
        cy.groupedLog(`Expected values: ${JSON.stringify(values)}`)

        const data = result.data as string[][]
        if (result.error != null) { // database error
            throw new Error(result.error)
        } else if (data.length != 1) {
            cy.groupedLog(`Error in query - expected 1 row, got ${data.length}`)
            failed = true
        } else if (data[0].length != expectedValues.length) {
            cy.groupedLog(`Error in query - expected ${expectedValues.length} columns, got ${data[0].length}`)
            failed = true
        } else {
            for (let col = 0; col < expectedValues.length; col++) {
                if (!expectedValues[col] || typeof expectedValues[col] == 'string') {
                    const actual = data[0][col]
                    const expected = expectedValues[col]
                    if (actual != expected) {
                        cy.groupedLog(`Expected ${columnNames[col]} to be '${expected}', got '${actual}'`)
                        failed = true
                    }
                } else {
                    const actual = OasysDateTime.stringToTimestamp(data[0][col])
                    if (Math.abs(OasysDateTime.timestampDiff(actual, expectedValues[col] as Temporal.PlainDateTime)) > 15000) {
                        cy.groupedLog(`Expected ${columnNames[col]} to be ${expectedValues[col].toLocaleString()}, got ${actual}`)
                        failed = true
                    }
                }
            }
        }
        cy.groupedLogEnd().then(() => {
            if (failed) {
                throw new Error('Failed checking database values')
            }
        })
    })

}

/**
 * Generic function to run a query and return data as a 2-d string array.  Errors result in a null return with an error message written to the log.
 * The returned data is accessed using `cy.get<string[][]>(alias)` with the provided alias.
 */
export function getData(query: string, alias: string) {

    cy.task('getData', query).then((result: DbResponse) => {
        if (result.error != null) {
            cy.log(result.error)
        }
        cy.wrap(result.data as string[][]).as(alias)
    })

}

/**
 * Set the password for a given user
 */
export function setPassword(username: string, password: string) {

    cy.task('setPassword', { username: username, password: password }).then((result: DbResponse) => {
        if (result.error != null) {
            cy.log(result.error)
        }
    })
}

/**
 * Finds the latest non-deleted oasys_set record for a given offender, referenced using a Cypress alias e.g. '@offender1'.
 * Uses the PNC stored in oasys_set, so doesn't account for merges etc.
 * 
 * Returns the pk using the resultAlias.
 */
export function getLatestSetPk(offenderAlias: string, resultAlias: string) {

    cy.get<OffenderDef>(offenderAlias).then((offender) => {

        const query = `select oasys_set_pk from eor.oasys_set where pnc = '${offender.pnc}' and deleted_date is null order by initiation_date desc`
        getPk(query, resultAlias)
    })
}

/**
 * Finds the latest non-deleted oasys_set record for a given offender surname and forename.
 * 
 * Returns the pk using the resultAlias.
 */
export function getLatestSetPkByName(surname: string, forename: string, resultAlias: string) {

    const query = `select oasys_set_pk from eor.oasys_set where family_name = '${surname}' and forename_1 = '${forename}' and deleted_date is null order by initiation_date desc`
    getPk(query, resultAlias)
}

/**
 * Finds the latest non-deleted oasys_set record for a given offender PNC.
 * 
 * Returns the pk using the resultAlias.
 */
export function getLatestSetPkByPnc(pnc: string, resultAlias: string) {

    const query = `select oasys_set_pk from eor.oasys_set where pnc = '${pnc}' and deleted_date is null order by create_date desc`
    getPk(query, resultAlias)
}

/**
 * Finds all oasys_set records for a given offender PNC (including deleted, unless optional parameter is true).
 * 
 * Returns the pks as a number[] (most recent first) using the resultAlias.
 */
export function getAllSetPksByPnc(pnc: string, resultAlias: string, ignoreDeleted: boolean = false) {

    const query = ignoreDeleted ?
        `select oasys_set_pk from eor.oasys_set where pnc = '${pnc}' and deleted_date is null order by initiation_date desc`
        : `select oasys_set_pk from eor.oasys_set where pnc = '${pnc}' order by initiation_date desc`
    getPk(query, resultAlias, true)
}

/**
 * Finds all oasys_set records for a given offender CRN (including deleted, unless optional parameter is true).
 * 
 * Returns the pks as a number[] (most recent first) using the resultAlias.
 */
export function getAllSetPksByProbationCrn(probationCrn: string, resultAlias: string, ignoreDeleted: boolean = false) {

    const query = ignoreDeleted ?
        `select oasys_set_pk from eor.oasys_set where cms_prob_number = '${probationCrn}' and deleted_date is null order by create_date desc`
        : `select oasys_set_pk from eor.oasys_set where cms_prob_number = '${probationCrn}' order by create_date desc`
    getPk(query, resultAlias, true)
}

function getPk(query: string, resultAlias: string, returnAll: boolean = false) {

    cy.task('getData', query).then((result: DbResponse) => {
        if (result.error != null) {
            throw new Error(result.error)
        }
        const data = result.data as string[][]
        if (data.length > 0) {
            if (returnAll) {
                const pks: number[] = []
                data.forEach((pk) => pks.push(Number.parseInt(pk[0])))
                cy.wrap(pks).as(resultAlias)
                cy.log(`Assessment pks: ${JSON.stringify(pks)}`)
            } else {
                const pk = Number.parseInt(data[0][0])
                cy.wrap(pk).as(resultAlias)
                cy.log(`Assessment pk: ${pk}`)
            }
        } else {
            cy.wrap(null).as(resultAlias)
        }
    })
}

/**
 * Checks the value of a specified assessment question - by assessmentPk, section ref and question ref.
 *
 * An optional failedAlias parameter can be provided to return a true/false failure status.  If this is not provided, the test will halt on failure.
 * 
 * If used, the alias should already have been created with a boolean value, with the name passed without the @ symbol.
 * Its value will be set to true in the case of failure, but left unchanged if the test passes.
 * If logText is provided, pushes failure details into the array rather than reporting all passes and failures.
 */
export function checkSingleAnswer(assessmentPk: number, section: string, questionRef: string, answerType: AnswerType, expectedResult: string,
    failedAlias: string = null, logText: string[] = null, testCase: number = null) {

    const answerSelect = answerType == 'refAnswer' ? 'a.ref_answer_code' : answerType == 'freeFormat' ? 'q.free_format_answer' : 'q.additional_note'
    const query = `select ${answerSelect} from eor.oasys_set st, eor.oasys_section s, eor.oasys_question q, eor.oasys_answer a
                    where st.oasys_set_pk = s.oasys_set_pk
                    and s.oasys_section_pk = q.oasys_section_pk
                    and q.oasys_question_pk = a.oasys_question_pk(+)
                    and s.ref_section_code = '${section}'
                    and q.ref_question_code = '${questionRef}'
                    and st.oasys_set_pk = ${assessmentPk}`

    cy.task('getData', query).then((result: DbResponse) => {
        if (result.error != null) { // database error
            throw new Error(result.error)
        } else {
            const data = result.data as string[][]
            const actualResult = data.length == 0 ? '' : data[0][0]
            const failureMessage = actualResult == expectedResult ? '' : ' *** FAILED ***'
            if (logText == null) {
                cy.log(`Checking answer: section ${section} question ${questionRef} - expected '${expectedResult}', actual '${actualResult}'${failureMessage}`)
            } else if (actualResult != expectedResult) {
                logText.push(`Test case ${testCase}: section ${section} question ${questionRef} - expected '${expectedResult}', actual '${actualResult}'${failureMessage}`)
            }
            if (failedAlias == null) {
                expect(actualResult).to.equal(expectedResult)
            } else {
                cy.get<boolean>(`@${failedAlias}`).then((aliasValue) => {
                    const newValue = actualResult == expectedResult ? aliasValue : true
                    cy.wrap(newValue).as(failedAlias)
                })
            }
        }
    })

}

/**
 * Runs a count query and returns the count in the specified result alias.
 */
export function selectCount(query: string, alias: string) {

    cy.task('selectCount', query).then((result: DbResponse) => {
        if (result.error != null) {
            cy.log(result.error)
        }
        cy.wrap(result.data as number).as(alias)
    })

}

export function checkAnswers(assessmentPk: number, expectedAnswers: OasysAnswer[], failedAlias: string, initialiseAlias: boolean = false) {

    if (initialiseAlias) {
        cy.wrap(false).as(failedAlias)
    }

    // Filter the expected answers to get a list of OASys sections to check
    const sections = expectedAnswers.map((answer) => answer.section).filter(onlyUnique)

    let expectedVictims: Victim[] = []
    // Then check the answers section by section.  Pull out the victims stuff to check separately.
    sections.forEach((section) => {
        const sectionAnswers = expectedAnswers.filter((answer) => answer.section == section)
        if (section.length > 6 && section.substring(0, 6) == 'victim') {
            const age = sectionAnswers.filter((answer) => answer.q == 'age')[0].a
            const gender = sectionAnswers.filter((answer) => answer.q == 'gender')[0].a
            const ethnicCat = sectionAnswers.filter((answer) => answer.q == 'ethnicCat')[0].a
            const relationship = sectionAnswers.filter((answer) => answer.q == 'relationship')[0].a
            if (age != null || gender != null || ethnicCat != null || relationship != null) {
                expectedVictims.push({ age: age, gender: gender, ethnicCat: ethnicCat, relationship: relationship })
            }
        } else {
            checkSectionAnswers(assessmentPk, section, sectionAnswers, failedAlias)
        }
    })
    checkVictims(assessmentPk, expectedVictims, failedAlias)
}

export function checkVictims(assessmentPk: number, expectedVictims: Victim[], failedAlias: string) {

    const query = `select age_of_victim_elm, gender_elm, ethnic_category_elm, victim_relation_elm from eor.victim where oasys_set_pk = ${assessmentPk} order by create_date desc`

    cy.task('getData', query).then((result: DbResponse) => {
        if (result.error != null) { // database error
            throw new Error(result.error)
        } else {
            let failed = false
            cy.groupedLogStart(`Checking victims:`)

            const data = result.data as string[][]
            if (expectedVictims.length == 0 && data.length == 0) {
                return
            }
            if (expectedVictims.length != data.length) {
                cy.groupedLog(`Expected ${expectedVictims.length} victims, found ${data.length}`)
                failed = true
            } else {
                let expectedVictimsConcatenated: string[] = []
                let actualVictimsConcatenated: string[] = []
                for (let i = 0; i < expectedVictims.length; i++) {
                    expectedVictimsConcatenated.push(`Age: ${expectedVictims[i].age}, Gender: ${expectedVictims[i].gender}, Ethnic category: ${expectedVictims[i].ethnicCat}, Relationship: ${expectedVictims[i].relationship}`)
                    actualVictimsConcatenated.push(`Age: ${data[i][0]}, Gender: ${data[i][1]}, Ethnic category: ${data[i][2]}, Relationship: ${data[i][3]}`)
                }
                expectedVictimsConcatenated.sort()
                actualVictimsConcatenated.sort()

                for (let i = 0; i < expectedVictimsConcatenated.length; i++) {
                    const match = expectedVictimsConcatenated[i] == actualVictimsConcatenated[i]
                    const failureMessage = match ? '          ' : 'FAILED    '
                    cy.groupedLog(`    ${failureMessage}Expected '${expectedVictimsConcatenated[i]}', actual '${actualVictimsConcatenated[i]}'`)
                    if (!match) { failed = true }
                }
            }
            cy.groupedLogEnd()

            cy.get<boolean>(`@${failedAlias}`).then((aliasValue) => {  // Need to refresh the alias even if not changing to indicate completion
                const newValue = failed ? true : aliasValue
                cy.wrap(newValue).as(failedAlias)
                if (failed) {
                    cy.task('consoleLog', `victims failed`)
                }
            })
        }
    })

}

// Filter used to get a list of OASys sections from a list of questions
function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

/**
 * Check expected answers in a single section in the OASys database, using an alias to return a boolean failure status.
 */
export function checkSectionAnswers(assessmentPk: number, section: string, expectedAnswers: OasysAnswer[], failedAlias: string) {

    cy.task('checkSectionAnswers', { assessmentPk: assessmentPk, section: section, expectedAnswers: expectedAnswers }).then((result: CheckDbSectionResponse) => {

        cy.groupedLogStart(`Checking section ${section} answers:`)
        result.report.forEach((line) => cy.groupedLog(line))
        cy.groupedLogEnd()

        cy.get<boolean>(`@${failedAlias}`).then((aliasValue) => {  // Need to refresh the alias even if not changing to indicate completion
            const newValue = result.failed ? true : aliasValue
            cy.wrap(newValue).as(failedAlias)
            if (result.failed) {
                cy.task('consoleLog', `${section} failed`)
            }
        })
    })
}

/**
 * Checks that a set of OASys sections (string[] of section refs) have been cloned from one assessment to another, fails if there are any mismatches in any of the sections.
 */
export function checkCloning(newPk: number, oldPk: number, sections: string[]) {

    cy.log(`Checking cloning from ${oldPk} to ${newPk}`)
    cy.wrap(false).as('failed')
    sections.forEach((section) => {
        checkSectionCloning(newPk, oldPk, section, 'failed')
    })
    cy.get<boolean>('@failed').then((failed) => expect(failed).equal(false))
}

/**
 * Checks that a set of OASys sections (string[] of section refs) have not been cloned from one assessment to another, fails if everything has cloned.
 */
export function checkCloningExpectMismatch(newPk: number, oldPk: number, sections: string[]) {

    cy.log(`Checking cloning from ${oldPk} to ${newPk}`)
    sections.forEach((section) => {
        cy.wrap(false).as('failed')
        checkSectionCloning(newPk, oldPk, section, 'failed')
        cy.get<boolean>('@failed').then((failed) => expect(failed).equal(true))
    })
}

function checkSectionCloning(newPk: number, oldPk: number, section: string, resultAlias: string) {

    let failed = false
    cy.task('getData', sectionQuery(newPk, section)).then((result: DbResponse) => {
        if (result.error != null) { // database error
            throw new Error(result.error)
        } else {
            const newData = result.data as string[][]
            cy.task('getData', sectionQuery(oldPk, section)).then((result: DbResponse) => {
                if (result.error != null) { // database error
                    throw new Error(result.error)
                } else {
                    const oldData = result.data as string[][]
                    cy.groupedLogStart(`Checking cloning for new PK ${newPk}, old PK ${oldPk}, section ${section}`)
                    if (newData.length != oldData.length) {
                        cy.groupedLog(`New count: ${newData.length ?? 0}, old count: ${oldData.length ?? 0}`)
                        failed = true
                    } else {
                        for (let i = 0; i < newData.length; i++) {
                            const newQ = JSON.stringify(newData[i])
                            const oldQ = JSON.stringify(oldData[i])
                            if (newQ != oldQ) {
                                cy.groupedLog(`New question: ${newQ}, old question: ${oldQ}`)
                                failed = true
                            }
                        }
                    }

                    cy.groupedLogEnd()

                    cy.get<boolean>(`@${resultAlias}`).then((aliasValue) => {  // Need to refresh the alias even if not changing to indicate completion
                        const newValue = failed ? true : aliasValue
                        cy.wrap(newValue).as(resultAlias)
                    })
                }
            })
        }
    })
}

function sectionQuery(pk: number, section: string): string {

    return `select q.ref_question_code, a.ref_answer_code, q.free_format_answer, q.additional_note
                    from eor.oasys_set st, eor.oasys_section s, eor.oasys_question q, eor.oasys_answer a
                    where st.oasys_set_pk = s.oasys_set_pk
                    and s.oasys_section_pk = q.oasys_section_pk
                    and q.oasys_question_pk = a.oasys_question_pk(+)
                    and s.ref_section_code = '${section}'
                    and st.oasys_set_pk = ${pk} 
                    order by q.ref_question_code, a.ref_answer_code`
}
