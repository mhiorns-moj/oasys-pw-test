import { Ogrs4CalcResult } from 'lib/ogrs'
import * as oasys from 'lib'

describe('OGRS regression test ref 3', () => {

    it('Test ref 3 part 1', () => {

        oasys.login(oasys.Users.probHeadPdu)

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender: OffenderDef = JSON.parse(offenderData as string)

            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })

            const predictors = new oasys.Pages.Assessment.RoshaPredictors().goto()
            predictors.save.click() // generate a calculation
            oasys.Ogrs.checkOgrs4CalcsOffender(offender, 'ogrs')
            
            oasys.Populate.RoshaPages.RoshaPredictors.fullyPopulated()
            oasys.Populate.Rosh.screeningFullyPopulated({layer: 'Layer 1V2'})
            oasys.Populate.Rosh.fullAnalysisFullyPopulated({layer: 'Layer 1V2'})

            predictors.goto()

            oasys.Ogrs.checkOgrs4CalcsOffender(offender, 'ogrs')
            cy.get<Ogrs4CalcResult>('@ogrs').then((ogrs) => {
                predictors.arpText.checkValue(ogrs.arpText)
                predictors.vrpText.checkValue(ogrs.vrpText)
                predictors.svrpText.checkValue(ogrs.svrpText)
                predictors.dcSrpBand.checkValue(ogrs.dcSrpBand)
                predictors.iicSrpBand.checkValue(ogrs.iicSrpBand)
                predictors.csrpBand.checkValue(ogrs.csrpBand)
                predictors.csrpType.checkValue(ogrs.csrpType)
                predictors.csrpScore.checkValue(ogrs.csrpScore)

                const roshSummary = new oasys.Pages.Rosh.RoshSummary().goto()
                roshSummary.dcSrpBand.checkValue(ogrs.dcSrpBand)
                roshSummary.iicSrpBand.checkValue(ogrs.iicSrpBand)
                roshSummary.csrpBand.checkValue(ogrs.csrpBand)
                roshSummary.csrpType.checkValue(ogrs.csrpType)
                roshSummary.csrpScore.checkValue(ogrs.csrpScore)


                oasys.Assessment.signAndLock({ page: oasys.Pages.Rosh.RiskManagementPlan, expectRsrScore: true })
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

                oasys.logout()
            })
        })
    })

})
