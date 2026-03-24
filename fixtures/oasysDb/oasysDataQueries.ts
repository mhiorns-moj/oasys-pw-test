import { Temporal } from '@js-temporal/polyfill'
import { expect } from '@playwright/test'

import * as lib from 'lib'
import { OasysDateTime } from 'lib/dateTime'
import { OasysDb } from './oasysDb'


export class OasysDataQueries {

    constructor(readonly oasysDb: OasysDb) { }


    async checkAnswers(assessmentPk: number, expectedAnswers: OasysAnswer[], suppressLog = false): Promise<boolean> {

        let failed = false

        // Filter the expected answers to get a list of OASys sections to check
        const sections = expectedAnswers.map((answer) => answer.section).filter(onlyUnique)
        let expectedVictims: Victim[] = []

        // Then check the answers section by section.  Pull out the victims stuff to check separately.
        for (let section of sections) {
            const sectionAnswers = expectedAnswers.filter((answer) => answer.section == section)
            if (section.startsWith('victim')) {
                const age = sectionAnswers.filter((answer) => answer.q == 'age')[0].a
                const gender = sectionAnswers.filter((answer) => answer.q == 'gender')[0].a
                const ethnicCat = sectionAnswers.filter((answer) => answer.q == 'ethnicCat')[0].a
                const relationship = sectionAnswers.filter((answer) => answer.q == 'relationship')[0].a
                if (age != null || gender != null || ethnicCat != null || relationship != null) {
                    expectedVictims.push({ age: age, gender: gender, ethnicCat: ethnicCat, relationship: relationship })
                }
            } else {
                const sectionFailed = await this.checkSectionAnswers(assessmentPk, section, sectionAnswers, suppressLog)
                if (sectionFailed) {
                    failed = true
                }
            }
        }

        const victimsFailed = await this.checkVictims(assessmentPk, expectedVictims, suppressLog)
        if (victimsFailed) {
            failed = true
        }

        return failed

    }

    /**
     * Check expected answers in a single section in the OASys database, returns a boolean failure status.
     */
    async checkSectionAnswers(assessmentPk: number, section: string, expectedAnswers: OasysAnswer[], suppressLog = false): Promise<boolean> {

        let failed = false
        lib.log('', `Checking section ${section} answers`)

        const data = await this.oasysDb.getData(sectionQuery(assessmentPk, section))

        for (let answerToCheck of expectedAnswers) {
            let actualResult: string = null
            const dataRow = data.filter((row) => row[0] == answerToCheck.q)
            const answerType = getAnswerType(answerToCheck.q)  // NOTE check the answer types below if no value is returned, as not all questions have been listed here
            let expectedAnswer = answerToCheck.a
            if (dataRow.length > 0) {
                if (answerType == 'multipleRefAnswer') {
                    actualResult = ''
                    dataRow.forEach(r => { actualResult += `${r[1]},` })
                    if (actualResult == 'null,') { actualResult = null }
                } else {
                    actualResult = answerType == 'refAnswer' ? dataRow[0][1] : answerType == 'freeFormat' ? dataRow[0][2] : dataRow[0][3]
                }
            }
            const match = actualResult?.replaceAll('\r\n', '\n') == expectedAnswer?.replaceAll('\r\n', '\n')
            const failureMessage = match ? '          ' : 'FAILED    '

            const expDisplayString = expectedAnswer == null ? '' : expectedAnswer.length > 50 ? expectedAnswer.substring(0, 50) + '...' : expectedAnswer
            const actDisplayString = actualResult == null ? '' : actualResult.length > 50 ? actualResult.substring(0, 50) + '...' : actualResult
            if (!match || !suppressLog) {
                lib.log(`    ${failureMessage}${answerToCheck.q} - expected '${expDisplayString}', actual '${actDisplayString}'`)
            }
            if (!match) { failed = true }
        }

        if (failed) {
            console.log(`Section ${section} failed`)
        }
        return failed
    }

    async checkVictims(assessmentPk: number, expectedVictims: Victim[], suppressLog = false): Promise<boolean> {

        let failed = false
        const query = `select age_of_victim_elm, gender_elm, ethnic_category_elm, victim_relation_elm from eor.victim where oasys_set_pk = ${assessmentPk} order by create_date desc`
        const data = await this.oasysDb.getData(query)

        if (!suppressLog || expectedVictims.length > 0) {
            lib.log('', `Checking victims`)
        }

        if (expectedVictims.length == 0 && data.length == 0) {
            return false
        }
        if (expectedVictims.length != data.length) {
            lib.log(`Victims FAILED - Expected ${expectedVictims.length} victims, found ${data.length}`)
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
                if (!match || !suppressLog) {
                    lib.log(`    ${failureMessage}Expected '${expectedVictimsConcatenated[i]}', actual '${actualVictimsConcatenated[i]}'`)
                }
                if (!match) { failed = true }
            }
        }

        if (failed) {
            console.log(`victims failed`)
        }
        return failed
    }
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
    async checkDbValues(table: string, where: string, values: { [keys: string]: string | Temporal.PlainDateTime }) {

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

        const data = await this.oasysDb.getData(query)
        lib.log('', `Checking database values`)
        lib.log(`Table: ${table}, where: ${where}`)
        lib.log(`Expected values: ${JSON.stringify(values)}`)

        if (data.length != 1) {
            lib.log(`Error in query - expected 1 row, got ${data.length}`)
            failed = true
        } else if (data[0].length != expectedValues.length) {
            lib.log(`Error in query - expected ${expectedValues.length} columns, got ${data[0].length}`)
            failed = true
        } else {
            for (let col = 0; col < expectedValues.length; col++) {
                if (!expectedValues[col] || typeof expectedValues[col] == 'string') {
                    const actual = data[0][col]
                    const expected = expectedValues[col]
                    if (actual != expected) {
                        lib.log(`Expected ${columnNames[col]} to be '${expected}', got '${actual}'`)
                        failed = true
                    }
                } else {
                    const actual = OasysDateTime.stringToTimestamp(data[0][col])
                    if (Math.abs(OasysDateTime.timestampDiff(actual, expectedValues[col] as Temporal.PlainDateTime)) > 15000) {
                        lib.log(`Expected ${columnNames[col]} to be ${expectedValues[col].toLocaleString()}, got ${actual}`)
                        failed = true
                    }
                }
            }
        }

        expect(failed).toBeFalsy()
    }

    /**
     * Checks that a set of OASys sections (string[] of section refs) have been cloned from one assessment to another, fails if there are any mismatches in any of the sections.
     */
    // async checkCloning(newPk: number, oldPk: number, sections: string[]) {

    //     cy.log(`Checking cloning from ${oldPk} to ${newPk}`)
    //     cy.wrap(false).as('failed')
    //     sections.forEach((section) => {
    //         checkSectionCloning(newPk, oldPk, section, 'failed')
    //     })
    //     cy.get<boolean>('@failed').then((failed) => expect(failed).equal(false))
    // }

    // /**
    //  * Checks that a set of OASys sections (string[] of section refs) have not been cloned from one assessment to another, fails if everything has cloned.
    //  */
    // async checkCloningExpectMismatch(newPk: number, oldPk: number, sections: string[]) {

    //     cy.log(`Checking cloning from ${oldPk} to ${newPk}`)
    //     sections.forEach((section) => {
    //         cy.wrap(false).as('failed')
    //         checkSectionCloning(newPk, oldPk, section, 'failed')
    //         cy.get<boolean>('@failed').then((failed) => expect(failed).equal(true))
    //     })
    // }

    // async checkSectionCloning(newPk: number, oldPk: number, section: string, resultAlias: string) {

    //     let failed = false
    //     cy.task('getData', sectionQuery(newPk, section)).then((result: DbResponse) => {
    //         if (result.error != null) { // database error
    //             throw new Error(result.error)
    //         } else {
    //             const newData = result.data as string[][]
    //             cy.task('getData', sectionQuery(oldPk, section)).then((result: DbResponse) => {
    //                 if (result.error != null) { // database error
    //                     throw new Error(result.error)
    //                 } else {
    //                     const oldData = result.data as string[][]
    //                     lib.logStart(`Checking cloning for new PK ${newPk}, old PK ${oldPk}, section ${section}`)
    //                     if (newData.length != oldData.length) {
    //                         lib.log(`New count: ${newData.length ?? 0}, old count: ${oldData.length ?? 0}`)
    //                         failed = true
    //                     } else {
    //                         for (let i = 0; i < newData.length; i++) {
    //                             const newQ = JSON.stringify(newData[i])
    //                             const oldQ = JSON.stringify(oldData[i])
    //                             if (newQ != oldQ) {
    //                                 lib.log(`New question: ${newQ}, old question: ${oldQ}`)
    //                                 failed = true
    //                             }
    //                         }
    //                     }

    //                     lib.logEnd()

    //                     cy.get<boolean>(`@${resultAlias}`).then((aliasValue) => {  // Need to refresh the alias even if not changing to indicate completion
    //                         const newValue = failed ? true : aliasValue
    //                         cy.wrap(newValue).as(resultAlias)
    //                     })
    //                 }
    //             })
    //         }
    //     })
    // }


    /**
     * Checks that the given OASYS_SET pk is deleted (i.e. deleted_date is not null)
     */
    // async checkDeleted(pk: number) {

    //     checkIfDeleted(pk, true)
    // }

    /**
     * Checks that the given OASYS_SET pk is NOT deleted (i.e. deleted_date is null)
     */
    // async checkNotDeleted(pk: number) {

    //     checkIfDeleted(pk, false)
    // }

    // async checkIfDeleted(pk: number, expectDeleted: boolean) {

    //     this.oasys.Db.getData(`select deleted_date from eor.oasys_set where oasys_set_pk = ${pk}`, 'data')
    //     cy.get<string[][]>('@data').then((data) => {
    //         if (expectDeleted) {
    //             expect(data[0][0]).to.not.be.null
    //             lib.log(`Checked that assessment ${pk} has been deleted`)
    //         } else {
    //             expect(data[0][0]).to.be.null
    //             lib.log(`Checked that assessment ${pk} is NOT deleted`)
    //         }
    //     })
    // }
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

// Identify any OASys answers that are not the default refAnswer type.  NOTE this list is not complete and will need updating.  // TODO
function getAnswerType(answer: string): AnswerType {

    const answerType = answerTypes[answer]
    return answerType ?? 'refAnswer'
}

const answerTypes: { [keys: string]: AnswerType } = {
    '1.32': 'freeFormat',
    '1.40': 'freeFormat',
    '1.29': 'freeFormat',
    '1.38': 'freeFormat',
    '2.1': 'additionalNote',
    '2.3': 'multipleRefAnswer',
    '2.4.1': 'additionalNote',
    '2.4.2': 'additionalNote',
    '2.5': 'additionalNote',
    '2.7.3': 'additionalNote',
    '2.8': 'additionalNote',
    '2.9.t_V2': 'additionalNote',
    '2.11.t': 'additionalNote',
    '2.12': 'additionalNote',
    '2.98': 'additionalNote',
    '4.7.1': 'multipleRefAnswer',
    '8.2.14.t': 'additionalNote',
    '9.1.t': 'additionalNote',
    'SC0': 'freeFormat',
    'SC1.t': 'additionalNote',
    'SC2.t': 'additionalNote',
    'SC3.t': 'additionalNote',
    'SC4.t': 'additionalNote',
    'SC7.t': 'additionalNote',
    'SC8.t': 'additionalNote',
    'SC9.t': 'additionalNote',
    'SC10.t': 'additionalNote',
    '3.97': 'additionalNote',
    '4.94': 'additionalNote',
    '5.97': 'additionalNote',
    '6.97': 'additionalNote',
    '7.97': 'additionalNote',
    '8.97': 'additionalNote',
    '9.97': 'additionalNote',
    '10.97': 'additionalNote',
    '11.97': 'additionalNote',
    '12.97': 'additionalNote',
    'SAN_CRIM_NEED_SCORE': 'freeFormat',

}


// Filter used to get a list of OASys sections from a list of questions
function onlyUnique(value, index, array) {
    return array.indexOf(value) === index
}