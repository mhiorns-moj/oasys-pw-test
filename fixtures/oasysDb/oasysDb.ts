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
 *  > &nbsp;&nbsp;&nbsp;&nbsp;`log(count.toString())`  
 *  > &nbsp;&nbsp;&nbsp;&nbsp;`if (count > 1) {`  
 *  > &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`....`  
 *  > &nbsp;&nbsp;&nbsp;&nbsp;`}`  
 *  > `})`
 * 
 * @module Database
*/

import { Temporal } from '@js-temporal/polyfill'
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
     * Generic async to run a query and return data as a 2-d string array.  Errors result in a null return with an error message written to the log.
     * The returned data is accessed using `cy.get<string[][]>(alias)` with the provided alias.
     */
    async getData(query: string): Promise<string[][]> {

        const result = await this.db.selectData(query)

        expect(result.error).toBeNull()
        return result.data as string[][]
    }

    // /**
    //  * Set the password for a given user
    //  */
    // async setPassword(username: string, password: string) {

    //     cy.task('setPassword', { username: username, password: password }).then((result: DbResponse) => {
    //         if (result.error != null) {
    //             log(result.error)
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
    //                 log(`Checking answer: section ${section} question ${questionRef} - expected '${expectedResult}', actual '${actualResult}'${failureMessage}`)
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
     * Runs a count query and returns the count.
     */
    async selectCount(query: string): Promise<number> {

        const result = await this.db.selectCount(query)

        expect(result.error).toBeNull()
        return result.data as number
    }

    /**
     * Runs a query and returns the single return value as a number
     */
    async getSingleNumericValue(query: string): Promise<number> {

        const result = await this.db.selectSingleValue(query)

        expect(result.error).toBeNull()
        return result.data as number
    }

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
        const versionData = await this.db.selectData(`select version_number, to_char(release_date, '${oasysDateTime.oracleTimestampFormat}')
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
            result.appVersions[version[0]] = oasysDateTime.stringToTimestamp(version[1])
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

    async closeConnection() {

        await this.db.closeConnection()
    }

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