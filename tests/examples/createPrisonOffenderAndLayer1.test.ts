import * as lib from 'lib'
import { test } from 'fixtures'

test('Example test - create a prison offender and a layer 1 assessment', async ({ oasys, offender, assessment }) => {

    await oasys.login(oasys.users.prisHomds)

    await offender.createPris(offender.offenders.Prison.Male.burglary)
    await assessment.createPris({ purposeOfAssessment: 'Transfer in from non England / Wales Court', assessmentLayer: 'Basic (Layer 1)' })

    // Use one of the following two lines to populate the assessment.  maxStrings parameter can be set to populate text fields to maximum length
    await assessment.populateMinimal({ layer: 'Layer 1', provider: 'pris' })
    // await oasys.Populate.fullyPopulated({ layer: 'Layer 1', provider: 'pris', maxStrings: true })

    await assessment.signing.signAndLock({ page: 'basic' })

    await oasys.logout()

})
