import { test } from 'fixtures'

// Test for incorrect missing questions result in PNI endpoint

test('NOD-1228', async ({ oasysDb, oasys, offender, assessment, sections, signing, api }) => {

    await oasys.login(oasys.users.probHeadPdu)

    // Offender 1
    const offender1 = await offender.createProbFromStandardOffender()

    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
    await assessment.populateMinimal({ layer: 'Layer 3', populate6_11: 'No', sentencePlan: 'isp' })

    await sections.section6.goto()
    await sections.section6.o6_1.setValue('Missing')

    await signing.signAndLock({ expectRsrWarning: true, page: 'isp' })

    const failed = await api.testOneOffender(offender1.probationCrn, 'prob', false, true, oasysDb)
    expect(failed).toBeFalsy()

    await oasys.logout()
})
