import * as lib from 'lib'
import { test } from 'fixtures'


test('Example test - create a probation offender and a layer 1 assessment using new SP service', async ({ oasys, offender, assessment }) => {

    await oasys.login(oasys.users.probSpHeadPdu)

    await offender.createProb(offender.offenders.Probation.Male.burglary)
    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })

    // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
    await assessment.populateMinimal({ layer: 'Layer 1', newSp: true })
    // await oasys.Populate.fullyPopulated({layer: 'Layer 1', maxStrings: false })

    await assessment.signing.signAndLock()

    await oasys.logout()

})