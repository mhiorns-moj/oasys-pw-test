import * as fs from 'fs-extra'

import * as lib from 'lib'
import { test } from 'fixtures'
import { mappingTestOffenderFile } from './xMappingTest'

/**
 * Creates an offender and writes the details to a local file.  This should be run before running any of the mapping tests.
 */

const initialOffenderDetails: OffenderDef = {

    forename1: 'MappingTest',
    gender: 'Male',
    dateOfBirth: { years: -40 },
}


test('Create offender for SAN mapping tests', async ({ oasys, offender }) => {

    await oasys.login(oasys.users.probSanHeadPdu)
    const offender1 = await offender.createProb(initialOffenderDetails)

    await fs.writeFile(mappingTestOffenderFile, JSON.stringify(offender1))
    await oasys.logout()
})


