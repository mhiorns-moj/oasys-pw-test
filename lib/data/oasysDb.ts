var oracledb = require('oracledb')

import { testEnvironment, userSuffix } from '../../localSettings'
import { appVersions, currentVersion, OasysDateTime, setCurrentVersion } from 'lib/dateTime'

var connection
export let offences = {}

/** 
 * Connect to the Oracle database using parameters configured in environments.ts and localSettings.ts, returns a null string for success, or an error for failure.
 * 
 * This is used by the other functions in this module, only when required.
 */
async function connect(): Promise<string> {

    let db = testEnvironment.database

    try {
        oracledb.fetchAsString = [oracledb.CLOB]

    }
    catch (e) {
        console.log(`Oracle init error: ${e}`)
    }
    try {
        connection = await oracledb.getConnection({
            user: testEnvironment.database.user,
            password: testEnvironment.database.password,
            connectString: testEnvironment.database.connection
        })
        return null
    }
    catch (e) {
        return `Error connecting to database: ${e}`
    }
}

export async function closeConnection() {

    if (connection != null) {
        connection.close()
    }
    return null
}

/** 
 * Executes an Oracle query to get a single string value, returns a DbResponse type object including the return string and error text or null.
 * 
 * This function is called via cypress.config.ts using `cy.task('selectSingleValue', query)`
 */
export async function selectSingleValue(query: string): Promise<DbResponse> {

    if (connection == null) {
        const connectError = await connect()
        if (connectError != null) return { data: null, error: connectError }
    }

    try {
        let result = await connection.execute(query)
        return { data: result['rows'][0].toString(), error: null }
    }
    catch (e) {
        return { data: null, error: `Error running query '${query}': ${e}` }
    }
}

/** 
 * Executes an Oracle query to get a row count, returns a DbResponse type object including the number of rows and error text or null.
 * 
 * This function is called via cypress.config.ts using `cy.task('selectCount', query)`
 */
export async function selectCount(query: string): Promise<DbResponse> {

    if (connection == null) {
        const connectError = await connect()
        if (connectError != null) return { data: null, error: connectError }
    }

    try {
        let result = await connection.execute(query)
        return { data: parseInt(result['rows'][0].toString()), error: null }
    }
    catch (e) {
        return { data: null, error: `Error running query '${query}': ${e}` }
    }

}

/** 
 * Generic function to execute an Oracle query to get some results.
 * Returns a DbResponse type object, with a 2-d string array for data, and a string (or null) for errors.
 * 
 * Should be called from cy.task, e.g. `cy.task('getData', query).as('data').then((data: string[][]) => {})`
 */
export async function selectData(query: string): Promise<DbResponse> {

    if (connection == null) {
        const connectError = await connect()
        if (connectError != null) return { data: null, error: connectError }
    }

    try {
        const result = await connection.execute(query, [], { resultSet: true })
        const returnVal: string[][] = []

        const rs = result.resultSet
        let row: object[]

        while (row = await rs.getRow() as object[]) {

            let rowStrings: string[] = []
            row.forEach((col) => {
                rowStrings.push(col?.toString() ?? null)
            })
            returnVal.push(rowStrings)
        }
        await rs.close()

        return { data: returnVal, error: null }
    }
    catch (e) {
        return { data: null, error: `Error running query '${query}': ${e}` }
    }
}

/** 
 * Get the application config items and offence codes.  Returns an AppConfig object
 */
export async function getAppConfig(): Promise<AppConfig> {

    const configData = await selectSingleValue(`select system_parameter_value from eor.system_parameter_mv where system_parameter_code ='PROB_FORCE_CRN'`)
    const offencesData = await selectData('select offence_group_code || sub_code, rsr_category_desc from eor.ct_offence order by 1')
    const versionData = await selectData(`select version_number, to_char(release_date, '${OasysDateTime.oracleTimestampFormat}')
                                            from eor.system_config where cm_release_type_elm = 'APPLICATION' order by release_date desc`)

    if (configData.error != null || offencesData.error != null || versionData.error != null) {
        console.log(configData.error)
        console.log(offencesData.error)
        console.log(versionData.error)
        return null
    }

    (offencesData.data as string[][]).forEach(offence => {
        offences[offence[0]] = offence[1]
    })

    const versions = versionData.data as string[][]
    versions.forEach((version) => {
        appVersions[version[0]] = OasysDateTime.stringToTimestamp(version[1])
    })
    setCurrentVersion(versions[0][0])

    return {
        probForceCrn: (configData.data as string) == 'Y',
        offences: offences,
        appVersions: appVersions,
        currentVersion: currentVersion,
    }
}

let lastElogTimeAtStart: string = null
let unprocEventTimeAtStart: string = null

export async function getLatestElogAndUnprocEventTime(mode: 'store' | 'check') {

    const elogQuery = `select to_char(time_stamp, 'YYYY-MM-DD HH24:MI:SS') from eor.elog 
                        where error_stack not like '%STUB:%'
                        and (username like 'AUTO%${userSuffix}' or username = 'EOR')
                        order by time_stamp desc fetch first 1 row only`

    const unprocEventQuery = `select to_char(create_date, 'YYYY-MM-DD HH24:MI:SS') from eor.san_unprocessed_events 
                        where create_user like 'AUTO%${userSuffix}'
                        order by create_date desc fetch first 1 row only`

    let result = await selectData(elogQuery)
    if (result.error != null) { // database error
        throw new Error(result.error)
    } else {
        const data = result.data as string[][]
        const lastElogTime = data.length == 0 ? '' : data[0][0]
        if (mode == 'store') {
            lastElogTimeAtStart = lastElogTime
        } else {
            if (lastElogTime != lastElogTimeAtStart && lastElogTimeAtStart != null) {
                throw new Error(`Error checking eLog - last entry was ${lastElogTimeAtStart} at start, now ${lastElogTime}`)
            }
        }
    }

    result = await selectData(unprocEventQuery)

    if (result.error != null) { // database error
        if (!result.error.includes('table or view does not exist')) {    // Ignore this check if unprocessed events table does not exist
            throw new Error(result.error)
        }
    } else {
        const data = result.data as string[][]
        const lastEventTime = data.length == 0 ? '' : data[0][0]
        if (mode == 'store') {
            unprocEventTimeAtStart = lastEventTime
        } else {
            if (lastEventTime != unprocEventTimeAtStart && unprocEventTimeAtStart != null) {
                throw new Error(`Error checking unprocessed events table - last entry was ${unprocEventTimeAtStart} at start, now ${lastEventTime}`)
            }
        }
    }

}

/** 
 * Executes an Oracle update to set a password for a given user.
 * 
 * This function is called via cypress.config.ts using `cy.task('setPassword', {username: 'user', password: 'password'})`
 */
export async function setPassword(username: string, password: string): Promise<DbResponse> {

    if (connection == null) {
        const connectError = await connect()
        if (connectError != null) return { data: null, error: connectError }
    }

    const update = `BEGIN
                        update eor.oasys_user set password_encrypted = eor.authentication_pkg.encrypt_password('${password}'), 
                            password_change_date = sysdate, user_status_elm = 'ACTIVE' where oasys_user_code = '${username}';
                        COMMIT;
                    END;`

    try {
        let result = await connection.execute(update)
        return { data: null, error: null }
    }
    catch (e) {
        return { data: null, error: `Error running password update '${update}': ${e}` }
    }
}

/**
 * Check expected answers in a single section in the OASys database, using an alias to return a boolean failure status.
 */
export async function checkSectionAnswers(parameters: { assessmentPk: number, section: string, expectedAnswers: OasysAnswer[] }): Promise<CheckDbSectionResponse> {

    const query = sectionQuery(parameters.assessmentPk, parameters.section)

    const result = await selectData(query)
    if (result.error) {
        throw new Error(result.error)
    }

    let failed = false
    const data = result.data as string[][]
    const report: string[] = []

    parameters.expectedAnswers.forEach((answerToCheck) => {
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
        report.push(`    ${failureMessage}${answerToCheck.q} - expected '${expDisplayString}', actual '${actDisplayString}'`)
        if (!match) { failed = true }
    })

    return { failed: failed, report: report }
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
