import * as lib from 'lib'
import { test } from 'fixtures'

test('Example test - create a prison offender and a layer 1 assessment', async ({ oasys, offender, assessment }) => {

    await oasys.login(lib.Users.prisHomds)

    const offender1 = await offender.createPris(lib.OffenderLib.Prison.Male.burglary)

    await assessment.createPris({ purposeOfAssessment: 'Transfer in from non England / Wales Court', assessmentLayer: 'Basic (Layer 1)' })
    await assessment.populateMinimal()
    await oasys.clickButton('Save')
    // // // Use one of the following two lines to populate the assessment.  maxStrings parameter can be set to populate text fields to maximum length
    // // oasys.Populate.minimal({ layer: 'Layer 1', provider: 'pris' })
    // // // oasys.Populate.fullyPopulated({ layer: 'Layer 1', provider: 'pris', maxStrings: true })

    // assessment.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan })

    await oasys.logout()

})
