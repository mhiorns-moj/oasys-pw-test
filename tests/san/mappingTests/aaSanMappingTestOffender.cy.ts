import * as oasys from 'lib'
import { mappingTestOffenderFile } from './xMappingTest'

/**
 * Creates an offender and writes the details to a local file.  This should be run before running any of the mapping tests.
 */

const initialOffenderDetails: OffenderDef = {

    forename1: 'MappingTest',
    gender: 'Male',
    dateOfBirth: { years: -40 },
}

describe('SAN mapping tests', () => {

    it('Create offender for SAN mapping tests', () => {

        oasys.login(oasys.Users.probSanUnappr)
        oasys.Offender.createProb(initialOffenderDetails, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {
            cy.writeFile(mappingTestOffenderFile, JSON.stringify(offender))
            oasys.logout()
        })
    })
})
