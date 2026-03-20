import { Page, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import { Oasys, Cms, OasysDb } from 'fixtures'
import * as pages from './pages'
import * as offenders from './offenders'


export class Offender {

    constructor(public readonly page: Page, public readonly testInfo: TestInfo, readonly oasys: Oasys, readonly cms: Cms, readonly oasysDb: OasysDb) { }

    readonly offenderSearch = new pages.OffenderSearch(this.page)
    readonly offenderDetails = new pages.OffenderDetails(this.page)
    readonly rfi = new pages.Rfi(this.page)

    readonly offenders = offenders

    /**
     * Create a probation offender using the details provided in an Offender type object.
     * 
     * Any '#auto...' data items will be generated and updated in the object (without affecting the original instance of that object).
     * A Cypress alias is required to allow the test to refer to the updated object to access the generated data.
     * 
     * The object needs to include all mandatory items for a probation offender, but if there is no CRN property, a new one will be generated.
     * If there is a NOMIS ID this will be ignored.
     * 
     * Address lines 4 and 5 are automatically populated with the OASys version and test script name respectively.
     * 
     * The Cypress alias should be a string such as `offender1` but subsequent use requires the following code,
     * where the values are only available within a `cy.get().then()` structure (note the `@` symbol):
     * 
     * > `cy.get('@offender1').then((result:object) => {`  
     * > &nbsp;&nbsp;&nbsp;&nbsp;`let offender = result as lib.Offender`  
     * > &nbsp;&nbsp;&nbsp;&nbsp;`oasys.log(offender.probationCrn)`  
     * > `})`
     */
    async createProb(source: OffenderDef): Promise<OffenderDef> {

        // Get a copy of the offender data (to avoid changing it for other offenders in the same test based on the same source offender),
        let offender = JSON.parse(JSON.stringify(source)) as OffenderDef

        // Populate any null key fields (PNC, CRN, NOMIS ID and Surname).
        await this.oasysDb.populateAutoData(offender)
        offender.dateOfBirth = lib.OasysDateTime.oasysDateAsString(offender.dateOfBirth) // Calculate date if a # value has been specified

        // Delete the NOMIS Id if there is one to avoid attempting to populate it on the stub screen
        let nomisId: string
        if (offender.nomisId != undefined) {
            nomisId = offender.nomisId
            delete offender.nomisId
        }

        await this.cms.createProbStub(offender)

        // Now create the offender record in OASys
        await this.offenderSearch.goto(true)
        await this.offenderSearch.search.click()
        await this.offenderSearch.searchCms.setValue('Yes')
        await this.offenderSearch.probationCrn.setValue(offender.probationCrn)
        await this.offenderSearch.search.click()

        await this.cms.cmsOffenderSearch()

        lib.log(`Created offender with PNC: ${offender.pnc}, surname: '${offender.surname}', forename: '${offender.forename1}', CRN: ${offender.probationCrn}, date of birth: ${offender.dateOfBirth}`)

        // Reinstate the NOMIS ID on the offender object
        if (nomisId != undefined) {
            offender.nomisId = nomisId
        }
        return offender
    }

    /**
     * Create a prison offender using the details provided in an Offender type object.
     * 
     * Any '#auto...' data items will be evaluated and updated in the object (without affecting the original instance of that object).
     * A Cypress alias is required to allow the test to refer to the updated object to access the evaluated data.
     * 
     * The object needs to include all mandatory items for a probation offender, but if there is no NOMISId property, a new one will be generated.
     * If there is a probation CRN this will be ignored.
     *  
     * Address lines 4 and 5 are automatically populated with the OASys version and test script name respectively.
     * 
     * The Cypress alias should be a string such as `offender1` but subsequent use requires the following code,
     * where the values are only available within a `cy.get().then()` structure (note the `@` symbol):
     * 
     * > `cy.get<Offender>('@offender1').then((offender) => {`  
     * > &nbsp;&nbsp;&nbsp;&nbsp;`oasys.log(offender.probationCrn)`  
     * > `})`
     */
    async createPris(source: OffenderDef): Promise<OffenderDef> {

        // Get a copy of the offender data (to avoid changing it for other offenders in the same test based on the same source offender),
        let offender = JSON.parse(JSON.stringify(source)) as OffenderDef

        // Populate any null key fields (PNC, CRN, NOMIS ID and Surname).
        await this.oasysDb.populateAutoData(offender)
        offender.dateOfBirth = lib.OasysDateTime.oasysDateAsString(offender.dateOfBirth) // Calculate date if a # value has been specified

        // Delete the probation CRN if there is one to avoid attempting to populate it on the stub screen
        let probationCrn: string
        if (offender.probationCrn != undefined) {
            probationCrn = offender.probationCrn
            delete offender.probationCrn
        }

        await this.cms.enterPrisonStubDetailsAndCreateReceptionEvent(offender)
        await this.searchAndSelectByNomisId(offender.nomisId, true)

        lib.log(`Created offender with PNC: ${offender.pnc}, surname: '${offender.surname}', forename: '${offender.forename1}', NOMISId: ${offender.nomisId}, date of birth: ${offender.dateOfBirth}`, 'Offender')

        // Reinstate the probation CRN on the offender object
        if (probationCrn != undefined) {
            offender.probationCrn = probationCrn
        }
        return offender
    }

    /**
     * Navigate to the Offender Search page, then search and select an offender by PNC.
     * 
     * Selects the first result if the search returns multiple rows.
     */
    async searchAndSelectByPnc(pnc: string, provider?: string) {

        const params = { pnc: pnc }
        if (provider != undefined) {
            params['provider'] = provider
        }
        await this.offenderSearchAndSelect(params)
    }

    /**
     * Navigate to the Offender Search page, then search and select an offender by NOMIS Id.
     * 
     * Selects the first result if the search returns multiple rows.
     */
    async searchAndSelectByNomisId(nomisId: string, suppressLog: Boolean = false) {

        await this.offenderSearchAndSelect({ prisonNomisNumber: nomisId }, suppressLog)
    }

    /**
     * Navigate to the Offender Search page, then search and select an offender by Probation CRN.
     * 
     * Selects the first result if the search returns multiple rows.
     */
    async searchAndSelectByCrn(crn: string) {

        await this.offenderSearchAndSelect({ probationCrn: crn })
    }

    /**
     * Navigate to the Offender Search page, then search and select an offender by surname and optional first name.
     * 
     * Selects the first result if the search returns multiple rows.
     */
    async searchAndSelectByName(surname: string, forename: string = '') {

        await this.offenderSearchAndSelect({ surname: surname, forename: forename })
    }

    /**
     * Navigate to the Offender Search page, search for the specified offender then select the first row in the result table.
     * 
     * Parameter can be either:
     * 
     * - a pre-defined Offender object, referred to by an alias name '@...'.  In this case it uses (in order of preference) the PNC, Probation CRN or NOMIS Id
     *     on the assumption that at least one of these has been set and is unique.
     * - a Values object containing name/value pairs, using the element names defined for the Offender Search page
     *
     * Selects the first result if the search returns multiple rows.
     */
    async searchAndSelect(alias: string): Promise<void>
    async searchAndSelect(data: PageData): Promise<void>
    async searchAndSelect(p1: string | PageData) {

        if (typeof p1 == 'string') {

            // cy.get<OffenderDef>(p1).then((offender) => {

            //     if (offender.pnc != null) {
            //         offenderSearchAndSelect({ pnc: offender.pnc })
            //     }
            //     else if (offender.probationCrn != null) {
            //         offenderSearchAndSelect({ probationCrn: offender.probationCrn })
            //     }
            //     else if (offender.nomisId != null) {
            //         offenderSearchAndSelect({ prisonNomisNumber: offender.nomisId })
            //     }
            // })
        }
        else {
            await this.offenderSearchAndSelect(p1)
        }
    }

    async offenderSearchAndSelect(data: PageData, suppressLog: Boolean = false) {

        await this.offenderSearch.goto(true)

        await this.offenderSearch.setValues(data, true)
        await this.offenderSearch.search.click()
        await this.offenderSearch.surnameColumn.clickFirstRow()

        if (!suppressLog) lib.log(`Search and select offender: ${JSON.stringify(data)}`)
    }

    /**
     * Add a record in the IOM stub (using the configured address for the current environment). Sets the following values:
     *  - probation CRN
     *  - IOM (Y or N)
     *  - number of records
     *  - error type (OK/Record is not found/Forbidden/Internal Server Error)
     *  - MAPPA (Y or N)
     */
    // export function createIomStub(probationCrn: string, isIom: 'Y' | 'N', records: number,
    //     error: 'OK' | 'Record is not found' | 'Forbidden' | 'Internal Server Error', mappa: 'Y' | 'N' | '') {

    //     cy.visit(testEnvironment.iomStub)
    //     cy.wait(5000)
    //     const stub = new oasys.Pages.Offender.IomStub()
    //     stub.probationCrn.setValue(probationCrn)
    //     stub.isIom.setValue(isIom)
    //     stub.records.setValue(records.toString())
    //     stub.error.setValue(error)
    //     stub.mappa.setValue(mappa)

    //     stub.add.click()
    //     oasys.log(`Added offender to IOM stub - CRN: ${probationCrn}, IOM: ${isIom}, number of records: ${records}, error code: ${error}, mappa: ${mappa}`)
    // }
}
