import * as lib from 'lib'
import { test } from 'fixtures'


test('Example test - create a prison offender and a SAN 3.2 assessment', async ({ oasys, offender, assessment }) => {

    await oasys.login(oasys.users.probSanHeadPdu)

    await offender.createProb(offender.offenders.Probation.Male.burglary)
    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
    await assessment.populateMinimal({ layer: 'Layer 3V2' })
    // await oasys.Populate.fullyPopulated({layer: 'Layer 1',provider: 'pris', newSp: true, maxStrings: false })

    await assessment.signing.signAndLock({ expectRsrWarning: true })

    await oasys.logout()

})
