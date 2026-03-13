import * as oasys from 'oasys'

describe('SAN integration - test ref 23', () => {

    it('Test ref 23 part 2', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender: OffenderDef = JSON.parse(offenderData as string)


            cy.log(`Log out and log back in again as an Administrator
                Open up the Offender record and open up the OASys-SAN assessment which is all read only.  No data is updated from SAN.
                From the Admin menu click on 'Rollback assessment' and follow the instructions to roll the assessment back
                Offender's OASys-SAN assessment is now WIP again and editable by the assessor
                Check that an OASYS_SIGNING record has been created for 'ROLLBACK'
                Ensure that the Rollback API is sent to the SAN service detailing the OASYS_SET_PK for parameter 'oasysAssessmentPk', the OASYS_SET.SAN_ASSESSMENT_VERSION_NO 
                    for parameter 'sanVersionNumber', the OASYS_SET.SSP_PLAN_VERSION_NO fo parameter 'sentencePlanVersionNumber' along with user ID and name
                After the call has been sent ensure that OASYS_SET.SAN_ASSESSMENT_VERSION_NO and OASYS_SET.SSP_PLAN_VERSION_NO have been nulled out due to becoming editable again
                Check that a new 'Assessment Work in Progress' task has been created`)

            oasys.login(oasys.Users.admin, oasys.Users.probationSan)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            oasys.Assessment.openLatest()

            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk')

            cy.get<number>('@pk').then((pk) => {

                oasys.Assessment.rollBack()
                oasys.Assessment.checkSigningRecord(pk, ['ROLLBACK', 'SIGNING'])
                oasys.San.checkSanRollbackCall(pk, oasys.Users.admin)

                oasys.logout()

                cy.log(`Log out and log back in again as the Assessor
                    Assessment opens to the Case ID landing page - ensure that the navigation menu is now showing a full analysis with sections 6.1 and 6.2 in it -
                       invoked via the SAN data
                    Complete entry of the full analysis etc. in the OASys part of the assessment 
                    Sign and lock the assessment - no countersigner required.`)

                oasys.login(oasys.Users.probSanHeadPdu)
                oasys.Nav.history(offender)
                oasys.Assessment.openLatest()

                new oasys.Pages.Rosh.RoshFullAnalysisSection62().checkIsOnMenu()
                oasys.Populate.RoshPages.RoshSummary.specificRiskLevel('Low')
                oasys.Populate.RoshPages.RiskManagementPlan.minimal()

                new oasys.Pages.SentencePlan.SentencePlanService().goto()

                oasys.Assessment.signAndLock()

                cy.log(`Ensure the Sign API is sent to the SAN service and the parameters are correct
                    Ensure we get back a 200 response from the Sign API and that OASYS_SET.SAN_ASSESSMENT_VERSION_NO and OASYS_SET.SPP_PLAN_VERSION_NO have been populated
                        and they differ from the version numbers logged at the time of the initial S&L
                    Ensure an 'AssSumm' SNS Message has been created containing a ULR link for 'asssummsan'`)

                oasys.San.checkSanSigningCall(pk, oasys.Users.probSanHeadPdu, 'SELF')
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
            })
        })
    })
})
