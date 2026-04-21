import * as fs from 'fs-extra'

import { Oasys, Offender, Assessment, Sections, San } from 'fixtures'

/**
 * Test script used by all of the mapping tests.  Need to run the aaSanMappingTestOffender script first to create an offender and store the details in a local file.
 */

export const mappingTestOffenderFile = 'tests/data/local/mappingTestsOffender'

export async function mappingTest(oasys: Oasys, offender: Offender, assessment: Assessment, sections: Sections, san: San, script: SanScript, reset130: boolean = false) {

    const mappingTestOffender = await getMappingTestOffender()

    await oasys.login(oasys.users.admin, oasys.users.probationSan)
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
    await assessment.deleteAll(mappingTestOffender.surname, mappingTestOffender.forename1)
    await oasys.logout()

    await oasys.login(oasys.users.probSanHeadPdu)
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)

    const assessmentPk = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    const failed = await san.runScript(assessmentPk, script, reset130, sections.predictors)
    expect(failed).toBeFalsy()

    await oasys.logout()
}

export async function getMappingTestOffender(): Promise<OffenderDef> {

    const testProcess = Number.parseInt(process.env.TEST_PARALLEL_INDEX)
    const offenderDetails = await fs.readFile(`${mappingTestOffenderFile}${testProcess}`)
    return JSON.parse(offenderDetails.toString()) as OffenderDef
}