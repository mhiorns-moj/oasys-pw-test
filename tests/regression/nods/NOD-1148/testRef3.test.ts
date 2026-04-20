import { test } from 'fixtures'


/**
    Create a new Male probation offender in a SAN Pilot probation area
    Administrator flags the offender as LAO and grants access to this offender for an Assessor who has the SAN Service role
 */

test('OGRS regression test ref 3', async ({ oasys, offender, assessment, sections, risk, sns, signing, ogrs }) => {

    await oasys.login(oasys.users.probHeadPdu)
    const offender1 = await offender.createProbFromStandardOffender()
    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })

    await sections.roshaPredictors.goto()
    await sections.roshaPredictors.save.click() // generate a calculation
    await ogrs.checkOgrsInOasysSet(pk1)

    await sections.roshaPredictors.populateFull()
    await risk.populateFull({ layer: 'Layer 1V2' })

    await sections.roshaPredictors.goto()
    const ogrsResult = await ogrs.checkOgrsInOasysSet(pk1)
    await sections.roshaPredictors.arpText.checkValue(ogrsResult.result.arpText)
    await sections.roshaPredictors.vrpText.checkValue(ogrsResult.result.vrpText)
    await sections.roshaPredictors.svrpText.checkValue(ogrsResult.result.svrpText)
    await sections.roshaPredictors.dcSrpBand.checkValue(ogrsResult.result.dcSrpBand)
    await sections.roshaPredictors.iicSrpBand.checkValue(ogrsResult.result.iicSrpBand)
    await sections.roshaPredictors.csrpBand.checkValue(ogrsResult.result.csrpBand)
    await sections.roshaPredictors.csrpType.checkValue(ogrsResult.result.csrpType)
    await sections.roshaPredictors.csrpScore.checkValue(ogrsResult.result.csrpScore)

    await risk.summary.goto()
    await risk.summary.dcSrpBand.checkValue(ogrsResult.result.dcSrpBand)
    await risk.summary.iicSrpBand.checkValue(ogrsResult.result.iicSrpBand)
    await risk.summary.csrpBand.checkValue(ogrsResult.result.csrpBand)
    await risk.summary.csrpType.checkValue(ogrsResult.result.csrpType)
    await risk.summary.csrpScore.checkValue(ogrsResult.result.csrpScore)


    await signing.signAndLock({ page: 'rmp', expectRsrScore: true })
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

    await oasys.logout()
})

