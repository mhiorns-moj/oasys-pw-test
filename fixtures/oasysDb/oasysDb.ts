/**
 * __oasys.Db.*async*__  
 * 
 * Functions for checking and retrieving database values.
 * 
 * Querying the Oracle database during a test in Cypress is relatively complex due to timing considerations and the fact that the Javascript test code is executed in the
 * browser and cannot access the database.
 * 
 * The actual database interaction is in cypress/support/oasysDb.ts, called via cy.task asyncs defined in cypress.config.ts; this module provides a set of asyncs to
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

import { expect } from '@playwright/test'
import { Temporal } from '@js-temporal/polyfill'
import { OasysDateTime } from 'lib'
import { Db } from './data/db'
import { userSuffix } from 'localSettings'

export class OasysDb {

    private db = new Db()
    private lastElogTimeAtStart: string = null
    private unprocEventTimeAtStart: string = null


    /**
     * Replaces null offender identifiers (surname, Probation CRN, Nomis ID and PNC) with generated unique values.
     * Returns true for success, false if there is an error doing database checks
     */
    async populateAutoData(offender: OffenderDef): Promise<boolean> {

        if (!offender.surname) {
            offender.surname = await this.generateSurname()
            if (offender.surname == null) {
                return false
            }
        }
        if (!offender.probationCrn) {
            offender.probationCrn = await this.generateCrn()
            if (offender.probationCrn == null) {
                return false
            }
        }
        if (!offender.pnc) {
            offender.pnc = await this.generatePnc()
            if (offender.pnc == null) {
                return false
            }
        }
        if (!offender.nomisId) {
            offender.nomisId = await this.generateNomisId()
            if (offender.nomisId == null) {
                return false
            }
        }
        return true
    }

    /**
     * Creates a unique surname based on the local user suffix and some random letters.
     */
    async generateSurname(): Promise<string> {

        // return `Auto${userSuffix} ${dayjs().format('DD-MM-YY HH-mm-ss')}`  Preferred option would be to revert to using a timestamp but SAN currently blocks this

        let surname = ''
        let count = 1

        do {
            surname = `Auto${userSuffix} `

            for (var i = 0; i < 5; i++) {
                surname += getRandomChar()
            }

            count = await this.selectCount(`select count(*) from eor.offender where family_name = '${surname}'`)

        } while (count > 0)

        return surname
    }

    /** 
     * Creates a random PNC.  The year part is in the range 41 to 61, the main numeric part is 1000 to 9999999.
     * The database is checked in case the PNC exists already, with retries until a new one is found.
     */
    async generatePnc(): Promise<string> {

        const check_digits = "ZABCDEFGHJKLMNPQRTUVWXY"

        let pnc = ''
        let count = 1

        do {
            let pnc_year = getRandomInt(41, 62)
            let pnc_number = getRandomInt(1000, 10000000)
            let check_val = ((pnc_year * 10000000) + pnc_number) % 23
            pnc = `${pnc_year}/${pnc_number}${check_digits[check_val]}`

            count = await this.selectCount(`select count(*) from eor.offender where pnc = '${pnc}'`)

        } while (count > 0)

        return pnc
    }

    /**
     * Creates a random probation CRN of 7 upper-case letters - first letter is Z for all automated tests.
     * The database is checked in case the CRN exists already, with retries until a new one is found.
     */
    async generateCrn(): Promise<string> {

        let crn = ''
        let count = 1

        do {
            crn = 'Z'
            for (var i = 0; i < 6; i++) {
                crn += getRandomChar()
            }

            count = await this.selectCount(`select count(*) from eor.offender where cms_prob_number = '${crn}'`)

        } while (count > 0)

        return crn
    }

    /**
     * Creates a random NOMIS Id of 1 upper-case letter, 4 digits and 2 upper-case letters - first letter is Z for all automated tests.
     * The database is checked in case the Id exists already, with retries until a new one is found.
     */
    async generateNomisId(): Promise<string> {

        let nomisID = ''
        let count = 1

        do {
            nomisID = 'Z'

            nomisID += getRandomInt(0, 9999).toString().padStart(4, '0')
            nomisID += getRandomChar() + getRandomChar()

            count = await this.selectCount(`select count(*) from eor.offender where cms_pris_number = '${nomisID}'`)

        } while (count > 0)

        return nomisID
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
    // async checkDbValues(table: string, where: string, values: { [keys: string]: string | Temporal.PlainDateTime }) {

    //     var query = 'select '
    //     var firstCol = true
    //     const columnNames: string[] = []
    //     const expectedValues: (string | Temporal.PlainDateTime)[] = []
    //     var failed = false

    //     Object.keys(values).forEach(name => {
    //         if (firstCol) {
    //             firstCol = false
    //         } else {
    //             query += ', '
    //         }
    //         const stringType = !values[name] || typeof values[name] == 'string'
    //         query += stringType ? name : `to_char(${name}, '${OasysDateTime.oracleTimestampFormat}')`
    //         columnNames.push(name)
    //         expectedValues.push(values[name])
    //     })

    //     query += ` from eor.${table} where ${where}`

    //     cy.task('getData', query).then((result: DbResponse) => {
    //         cy.groupedLogStart(`Checking database values`)
    //         cy.groupedLog(`Table: ${table}, where: ${where}`)
    //         cy.groupedLog(`Expected values: ${JSON.stringify(values)}`)

    //         const data = result.data as string[][]
    //         if (result.error != null) { // database error
    //             throw new Error(result.error)
    //         } else if (data.length != 1) {
    //             cy.groupedLog(`Error in query - expected 1 row, got ${data.length}`)
    //             failed = true
    //         } else if (data[0].length != expectedValues.length) {
    //             cy.groupedLog(`Error in query - expected ${expectedValues.length} columns, got ${data[0].length}`)
    //             failed = true
    //         } else {
    //             for (let col = 0; col < expectedValues.length; col++) {
    //                 if (!expectedValues[col] || typeof expectedValues[col] == 'string') {
    //                     const actual = data[0][col]
    //                     const expected = expectedValues[col]
    //                     if (actual != expected) {
    //                         cy.groupedLog(`Expected ${columnNames[col]} to be '${expected}', got '${actual}'`)
    //                         failed = true
    //                     }
    //                 } else {
    //                     const actual = OasysDateTime.stringToTimestamp(data[0][col])
    //                     if (Math.abs(OasysDateTime.timestampDiff(actual, expectedValues[col] as Temporal.PlainDateTime)) > 15000) {
    //                         cy.groupedLog(`Expected ${columnNames[col]} to be ${expectedValues[col].toLocaleString()}, got ${actual}`)
    //                         failed = true
    //                     }
    //                 }
    //             }
    //         }
    //         cy.groupedLogEnd().then(() => {
    //             if (failed) {
    //                 throw new Error('Failed checking database values')
    //             }
    //         })
    //     })

    // }

    /**
     * Generic async to run a query and return data as a 2-d string array.  Errors result in a null return with an error message written to the log.
     * The returned data is accessed using `cy.get<string[][]>(alias)` with the provided alias.
     */
    async getData(query: string): Promise<string[][]> {

        const result = await this.db.selectCount(query)

        expect(result.error).toBeNull()
        return result.data as string[][]
    }

    // /**
    //  * Set the password for a given user
    //  */
    // async setPassword(username: string, password: string) {

    //     cy.task('setPassword', { username: username, password: password }).then((result: DbResponse) => {
    //         if (result.error != null) {
    //             cy.log(result.error)
    //         }
    //     })
    // }



    // /**
    //  * Checks the value of a specified assessment question - by assessmentPk, section ref and question ref.
    //  *
    //  * An optional failedAlias parameter can be provided to return a true/false failure status.  If this is not provided, the test will halt on failure.
    //  * 
    //  * If used, the alias should already have been created with a boolean value, with the name passed without the @ symbol.
    //  * Its value will be set to true in the case of failure, but left unchanged if the test passes.
    //  * If logText is provided, pushes failure details into the array rather than reporting all passes and failures.
    //  */
    // async checkSingleAnswer(assessmentPk: number, section: string, questionRef: string, answerType: AnswerType, expectedResult: string,
    //     failedAlias: string = null, logText: string[] = null, testCase: number = null) {

    //     const answerSelect = answerType == 'refAnswer' ? 'a.ref_answer_code' : answerType == 'freeFormat' ? 'q.free_format_answer' : 'q.additional_note'
    //     const query = `select ${answerSelect} from eor.oasys_set st, eor.oasys_section s, eor.oasys_question q, eor.oasys_answer a
    //                 where st.oasys_set_pk = s.oasys_set_pk
    //                 and s.oasys_section_pk = q.oasys_section_pk
    //                 and q.oasys_question_pk = a.oasys_question_pk(+)
    //                 and s.ref_section_code = '${section}'
    //                 and q.ref_question_code = '${questionRef}'
    //                 and st.oasys_set_pk = ${assessmentPk}`

    //     cy.task('getData', query).then((result: DbResponse) => {
    //         if (result.error != null) { // database error
    //             throw new Error(result.error)
    //         } else {
    //             const data = result.data as string[][]
    //             const actualResult = data.length == 0 ? '' : data[0][0]
    //             const failureMessage = actualResult == expectedResult ? '' : ' *** FAILED ***'
    //             if (logText == null) {
    //                 cy.log(`Checking answer: section ${section} question ${questionRef} - expected '${expectedResult}', actual '${actualResult}'${failureMessage}`)
    //             } else if (actualResult != expectedResult) {
    //                 logText.push(`Test case ${testCase}: section ${section} question ${questionRef} - expected '${expectedResult}', actual '${actualResult}'${failureMessage}`)
    //             }
    //             if (failedAlias == null) {
    //                 expect(actualResult).to.equal(expectedResult)
    //             } else {
    //                 cy.get<boolean>(`@${failedAlias}`).then((aliasValue) => {
    //                     const newValue = actualResult == expectedResult ? aliasValue : true
    //                     cy.wrap(newValue).as(failedAlias)
    //                 })
    //             }
    //         }
    //     })

    // }

    /**
     * Runs a count query and returns the count in the specified result alias.
     */
    async selectCount(query: string): Promise<number> {

        const result = await this.db.selectCount(query)

        expect(result.error).toBeNull()
        return result.data as number
    }

    // async checkAnswers(assessmentPk: number, expectedAnswers: OasysAnswer[], failedAlias: string, initialiseAlias: boolean = false) {

    //     if (initialiseAlias) {
    //         cy.wrap(false).as(failedAlias)
    //     }

    //     // Filter the expected answers to get a list of OASys sections to check
    //     const sections = expectedAnswers.map((answer) => answer.section).filter(onlyUnique)

    //     let expectedVictims: Victim[] = []
    //     // Then check the answers section by section.  Pull out the victims stuff to check separately.
    //     sections.forEach((section) => {
    //         const sectionAnswers = expectedAnswers.filter((answer) => answer.section == section)
    //         if (section.length > 6 && section.substring(0, 6) == 'victim') {
    //             const age = sectionAnswers.filter((answer) => answer.q == 'age')[0].a
    //             const gender = sectionAnswers.filter((answer) => answer.q == 'gender')[0].a
    //             const ethnicCat = sectionAnswers.filter((answer) => answer.q == 'ethnicCat')[0].a
    //             const relationship = sectionAnswers.filter((answer) => answer.q == 'relationship')[0].a
    //             if (age != null || gender != null || ethnicCat != null || relationship != null) {
    //                 expectedVictims.push({ age: age, gender: gender, ethnicCat: ethnicCat, relationship: relationship })
    //             }
    //         } else {
    //             checkSectionAnswers(assessmentPk, section, sectionAnswers, failedAlias)
    //         }
    //     })
    //     checkVictims(assessmentPk, expectedVictims, failedAlias)
    // }

    // async checkVictims(assessmentPk: number, expectedVictims: Victim[], failedAlias: string) {

    //     const query = `select age_of_victim_elm, gender_elm, ethnic_category_elm, victim_relation_elm from eor.victim where oasys_set_pk = ${assessmentPk} order by create_date desc`

    //     cy.task('getData', query).then((result: DbResponse) => {
    //         if (result.error != null) { // database error
    //             throw new Error(result.error)
    //         } else {
    //             let failed = false
    //             cy.groupedLogStart(`Checking victims:`)

    //             const data = result.data as string[][]
    //             if (expectedVictims.length == 0 && data.length == 0) {
    //                 return
    //             }
    //             if (expectedVictims.length != data.length) {
    //                 cy.groupedLog(`Expected ${expectedVictims.length} victims, found ${data.length}`)
    //                 failed = true
    //             } else {
    //                 let expectedVictimsConcatenated: string[] = []
    //                 let actualVictimsConcatenated: string[] = []
    //                 for (let i = 0; i < expectedVictims.length; i++) {
    //                     expectedVictimsConcatenated.push(`Age: ${expectedVictims[i].age}, Gender: ${expectedVictims[i].gender}, Ethnic category: ${expectedVictims[i].ethnicCat}, Relationship: ${expectedVictims[i].relationship}`)
    //                     actualVictimsConcatenated.push(`Age: ${data[i][0]}, Gender: ${data[i][1]}, Ethnic category: ${data[i][2]}, Relationship: ${data[i][3]}`)
    //                 }
    //                 expectedVictimsConcatenated.sort()
    //                 actualVictimsConcatenated.sort()

    //                 for (let i = 0; i < expectedVictimsConcatenated.length; i++) {
    //                     const match = expectedVictimsConcatenated[i] == actualVictimsConcatenated[i]
    //                     const failureMessage = match ? '          ' : 'FAILED    '
    //                     cy.groupedLog(`    ${failureMessage}Expected '${expectedVictimsConcatenated[i]}', actual '${actualVictimsConcatenated[i]}'`)
    //                     if (!match) { failed = true }
    //                 }
    //             }
    //             cy.groupedLogEnd()

    //             cy.get<boolean>(`@${failedAlias}`).then((aliasValue) => {  // Need to refresh the alias even if not changing to indicate completion
    //                 const newValue = failed ? true : aliasValue
    //                 cy.wrap(newValue).as(failedAlias)
    //                 if (failed) {
    //                     cy.task('consoleLog', `victims failed`)
    //                 }
    //             })
    //         }
    //     })

    // }

    // Filter used to get a list of OASys sections from a list of questions
    async onlyUnique(value, index, array) {
        return array.indexOf(value) === index
    }


    // /**
    //  * Checks that a set of OASys sections (string[] of section refs) have been cloned from one assessment to another, fails if there are any mismatches in any of the sections.
    //  */
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
    //                     cy.groupedLogStart(`Checking cloning for new PK ${newPk}, old PK ${oldPk}, section ${section}`)
    //                     if (newData.length != oldData.length) {
    //                         cy.groupedLog(`New count: ${newData.length ?? 0}, old count: ${oldData.length ?? 0}`)
    //                         failed = true
    //                     } else {
    //                         for (let i = 0; i < newData.length; i++) {
    //                             const newQ = JSON.stringify(newData[i])
    //                             const oldQ = JSON.stringify(oldData[i])
    //                             if (newQ != oldQ) {
    //                                 cy.groupedLog(`New question: ${newQ}, old question: ${oldQ}`)
    //                                 failed = true
    //                             }
    //                         }
    //                     }

    //                     cy.groupedLogEnd()

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
     * Get the application config items and offence codes.  Returns an AppConfig object
     */
    async getAppConfig(): Promise<AppConfig> {

        const result: AppConfig = {
            probForceCrn: false,
            offences: [],
            appVersions: [],
            currentVersion: '',
        }

        const configData = await this.db.selectSingleValue(`select system_parameter_value from eor.system_parameter_mv where system_parameter_code ='PROB_FORCE_CRN'`)
        const offencesData = await this.db.selectData('select offence_group_code || sub_code, rsr_category_desc from eor.ct_offence order by 1')
        const versionData = await this.db.selectData(`select version_number, to_char(release_date, '${OasysDateTime.oracleTimestampFormat}')
                                                from eor.system_config where cm_release_type_elm = 'APPLICATION' order by release_date desc`)

        if (configData.error != null || offencesData.error != null || versionData.error != null) {
            console.log(configData.error)
            console.log(offencesData.error)
            console.log(versionData.error)
            return null
        }

        (offencesData.data as string[][]).forEach(offence => {
            result.offences[offence[0]] = offence[1]
        })

        const versions = versionData.data as string[][]
        versions.forEach((version) => {
            result.appVersions[version[0]] = OasysDateTime.stringToTimestamp(version[1])
        })
        result.currentVersion = versions[0][0]

        return result
    }

    async getLatestElogAndUnprocEventTime(mode: 'store' | 'check') {

        const elogQuery = `select to_char(time_stamp, 'YYYY-MM-DD HH24:MI:SS') from eor.elog 
                        where error_stack not like '%STUB:%'
                        and (username like 'AUTO%${userSuffix}' or username = 'EOR')
                        order by time_stamp desc fetch first 1 row only`

        const unprocEventQuery = `select to_char(create_date, 'YYYY-MM-DD HH24:MI:SS') from eor.san_unprocessed_events 
                        where create_user like 'AUTO%${userSuffix}'
                        order by create_date desc fetch first 1 row only`

        let result = await this.db.selectData(elogQuery)
        if (result.error != null) { // database error
            throw new Error(result.error)
        } else {
            const data = result.data as string[][]
            const lastElogTime = data.length == 0 ? '' : data[0][0]
            if (mode == 'store') {
                this.lastElogTimeAtStart = lastElogTime
            } else {
                if (lastElogTime != this.lastElogTimeAtStart && this.lastElogTimeAtStart != null) {
                    throw new Error(`Error checking eLog - last entry was ${this.lastElogTimeAtStart} at start, now ${lastElogTime}`)
                }
            }
        }

        result = await this.db.selectData(unprocEventQuery)

        if (result.error != null) { // database error
            if (!result.error.includes('table or view does not exist')) {    // Ignore this check if unprocessed events table does not exist
                throw new Error(result.error)
            }
        } else {
            const data = result.data as string[][]
            const lastEventTime = data.length == 0 ? '' : data[0][0]
            if (mode == 'store') {
                this.unprocEventTimeAtStart = lastEventTime
            } else {
                if (lastEventTime != this.unprocEventTimeAtStart && this.unprocEventTimeAtStart != null) {
                    throw new Error(`Error checking unprocessed events table - last entry was ${this.unprocEventTimeAtStart} at start, now ${lastEventTime}`)
                }
            }
        }

    }

    // /**
    //  * Check expected answers in a single section in the OASys database, using an alias to return a boolean failure status.
    //  */
    // async checkSectionAnswers(parameters: { assessmentPk: number, section: string, expectedAnswers: OasysAnswer[] }): Promise<CheckDbSectionResponse> {

    //     const query = this.sectionQuery(parameters.assessmentPk, parameters.section)

    //     const result = await this.selectData(query)
    //     if (result.error) {
    //         throw new Error(result.error)
    //     }

    //     let failed = false
    //     const data = result.data as string[][]
    //     const report: string[] = []

    //     parameters.expectedAnswers.forEach((answerToCheck) => {
    //         let actualResult: string = null
    //         const dataRow = data.filter((row) => row[0] == answerToCheck.q)
    //         const answerType = this.getAnswerType(answerToCheck.q)  // NOTE check the answer types below if no value is returned, as not all questions have been listed here
    //         let expectedAnswer = answerToCheck.a
    //         if (dataRow.length > 0) {
    //             if (answerType == 'multipleRefAnswer') {
    //                 actualResult = ''
    //                 dataRow.forEach(r => { actualResult += `${r[1]},` })
    //                 if (actualResult == 'null,') { actualResult = null }
    //             } else {
    //                 actualResult = answerType == 'refAnswer' ? dataRow[0][1] : answerType == 'freeFormat' ? dataRow[0][2] : dataRow[0][3]
    //             }
    //         }
    //         const match = actualResult?.replaceAll('\r\n', '\n') == expectedAnswer?.replaceAll('\r\n', '\n')
    //         const failureMessage = match ? '          ' : 'FAILED    '

    //         const expDisplayString = expectedAnswer == null ? '' : expectedAnswer.length > 50 ? expectedAnswer.substring(0, 50) + '...' : expectedAnswer
    //         const actDisplayString = actualResult == null ? '' : actualResult.length > 50 ? actualResult.substring(0, 50) + '...' : actualResult
    //         report.push(`    ${failureMessage}${answerToCheck.q} - expected '${expDisplayString}', actual '${actDisplayString}'`)
    //         if (!match) { failed = true }
    //     })

    //     return { failed: failed, report: report }
    // }


    // /**
    //  * Check expected answers in a single section in the OASys database, using an alias to return a boolean failure status.
    //  */
    // async checkSectionAnswers(assessmentPk: number, section: string, expectedAnswers: OasysAnswer[], failedAlias: string) {

    //     cy.task('checkSectionAnswers', { assessmentPk: assessmentPk, section: section, expectedAnswers: expectedAnswers }).then((result: CheckDbSectionResponse) => {

    //         cy.groupedLogStart(`Checking section ${section} answers:`)
    //         result.report.forEach((line) => cy.groupedLog(line))
    //         cy.groupedLogEnd()

    //         cy.get<boolean>(`@${failedAlias}`).then((aliasValue) => {  // Need to refresh the alias even if not changing to indicate completion
    //             const newValue = result.failed ? true : aliasValue
    //             cy.wrap(newValue).as(failedAlias)
    //             if (result.failed) {
    //                 cy.task('consoleLog', `${section} failed`)
    //             }
    //         })
    //     })
    // }

    // Identify any OASys answers that are not the default refAnswer type.  NOTE this list is not complete and will need updating.  // TODO
    getAnswerType(answer: string): AnswerType {

        const answerType = answerTypes[answer]
        return answerType ?? 'refAnswer'
    }

    sectionQuery(pk: number, section: string): string {

        return `select q.ref_question_code, a.ref_answer_code, q.free_format_answer, q.additional_note
                    from eor.oasys_set st, eor.oasys_section s, eor.oasys_question q, eor.oasys_answer a
                    where st.oasys_set_pk = s.oasys_set_pk
                    and s.oasys_section_pk = q.oasys_section_pk
                    and q.oasys_question_pk = a.oasys_question_pk(+)
                    and s.ref_section_code = '${section}'
                    and st.oasys_set_pk = ${pk} 
                    order by q.ref_question_code, a.ref_answer_code`
    }

    async closeConnection() {

        await this.db.closeConnection()
    }

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


/**
 * Returns a random integer between min and max values (inclusive)
 */
function getRandomInt(min: number, max: number): number {

    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Returns a random capital letter
 */
function getRandomChar(): string {

    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[getRandomInt(0, 25)]
}