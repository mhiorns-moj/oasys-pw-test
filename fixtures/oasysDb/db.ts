var oracledb = require('oracledb')

import { testEnvironment } from 'localSettings'


export class Db {

    connection: any

    /** 
     * Connect to the Oracle database using parameters configured in environments.ts and localSettings.ts, returns a null string for success, or an error for failure.
     * 
     * This is used by the other functions in this module, only when required.
     */
    async connect(): Promise<string> {

        try {
            oracledb.fetchAsString = [oracledb.CLOB]

        }
        catch (e) {
            console.log(`Oracle init error: ${e}`)
        }
        try {
            this.connection = await oracledb.getConnection({
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

    async closeConnection() {

        if (this.connection != null) {
            this.connection.close()
        }
    }

    /** 
     * Executes an Oracle query to get a single string value, returns a DbResponse type object including the return string and error text or null.
     * 
     * This function is called via cypress.config.ts using `cy.task('selectSingleValue', query)`
     */
    async selectSingleValue(query: string): Promise<DbResponse> {

        if (this.connection == null) {
            const connectError = await this.connect()
            if (connectError != null) return { data: null, error: connectError }
        }

        try {
            let result = await this.connection.execute(query)
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
    async selectCount(query: string): Promise<DbResponse> {

        if (this.connection == null) {
            const connectError = await this.connect()
            if (connectError != null) return { data: null, error: connectError }
        }

        try {
            let result = await this.connection.execute(query)
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
    async selectData(query: string): Promise<DbResponse> {

        if (this.connection == null) {
            const connectError = await this.connect()
            if (connectError != null) return { data: null, error: connectError }
        }

        try {
            const result = await this.connection.execute(query, [], { resultSet: true })
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

    async callOracleFunction(functionCall: string): Promise<DbResponse> {

        if (this.connection == null) {
            const connectError = await this.connect()
            if (connectError != null) return null
        }

        try {

            const result = await this.connection.execute(functionCall, { ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 10000 } })

            return { data: result.outBinds.ret, error: null }
        }
        catch (e) {
            return { data: null, error: `Error running function '${functionCall}': ${e}` }
        }
    }

}
