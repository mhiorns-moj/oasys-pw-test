import * as lib from 'lib'
import { test } from 'fixtures'

test('Example test - create a probation offender and a layer 1 assessment', async ({ oasys, offender, assessment }) => {

    await oasys.login(oasys.users.probHeadPdu)

    await offender.createProb(offender.offenders.Probation.Male.burglary)
    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })

    // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
    await assessment.populateMinimal({ layer: 'Layer 1' })
    // await oasys.Populate.fullyPopulated({layer: 'Layer 1', maxStrings: false })

    await assessment.signing.signAndLock({ page: 'basic' })

    await oasys.logout()

})
