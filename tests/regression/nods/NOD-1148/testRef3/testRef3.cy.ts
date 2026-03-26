import { Ogrs4CalcResult } from 'lib/ogrs'

describe('OGRS regression test ref 3', () => {

    it('Test ref 3 part 1', () => {

        await oasys.login(oasys.users.probHeadPdu)

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender: OffenderDef = JSON.parse(offenderData as string)

            await offender.searchAndSelectByPnc(offender.pnc)
            await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })

            const predictors = new oasys.Pages.Assessment.RoshaPredictors().goto()
            await assessment.predictors.save.click() // generate a calculation
            oasys.Ogrs.checkOgrs4CalcsOffender(offender, 'ogrs')

            oasys.Populate.RoshaPages.RoshaPredictors.fullyPopulated()
            oasys.Populate.Rosh.screeningFullyPopulated({ layer: 'Layer 1V2' })
            oasys.Populate.Rosh.fullAnalysisFullyPopulated({ layer: 'Layer 1V2' })

            await assessment.predictors.goto()

            oasys.Ogrs.checkOgrs4CalcsOffender(offender, 'ogrs')
            cy.get<Ogrs4CalcResult>('@ogrs').then((ogrs) => {
                await assessment.predictors.arpText.checkValue(ogrs.arpText)
                await assessment.predictors.vrpText.checkValue(ogrs.vrpText)
                await assessment.predictors.svrpText.checkValue(ogrs.svrpText)
                await assessment.predictors.dcSrpBand.checkValue(ogrs.dcSrpBand)
                await assessment.predictors.iicSrpBand.checkValue(ogrs.iicSrpBand)
                await assessment.predictors.csrpBand.checkValue(ogrs.csrpBand)
                await assessment.predictors.csrpType.checkValue(ogrs.csrpType)
                await assessment.predictors.csrpScore.checkValue(ogrs.csrpScore)

                const roshSummary = new oasys.Pages.Rosh.RoshSummary().goto()
                roshSummary.dcSrpBand.checkValue(ogrs.dcSrpBand)
                roshSummary.iicSrpBand.checkValue(ogrs.iicSrpBand)
                roshSummary.csrpBand.checkValue(ogrs.csrpBand)
                roshSummary.csrpType.checkValue(ogrs.csrpType)
                roshSummary.csrpScore.checkValue(ogrs.csrpScore)


                await signing.signAndLock({ page: oasys.Pages.Rosh.RiskManagementPlan, expectRsrScore: true })
                await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

                await oasys.logout()
            })
        })
    })

})
