import * as oasys from 'oasys'

describe('SAN integration - test ref 24', () => {

    it('Test ref 24 part 1', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender: OffenderDef = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)

            log(`Open up the Offender record - assessor has full editable rights to the offender
                At this point there is NO button on the banner for 'Open S&N'
                At this point there is NO button on the banner for 'Open SP'`)

            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            const offenderDetails = new oasys.Pages.Offender.OffenderDetails()
            offenderDetails.pnc.checkStatus('enabled')
            offenderDetails.openSan.checkStatus('notVisible')
            offenderDetails.openSp.checkStatus('notVisible')

            log(`Create a new OASys-SAN assessment (3.2) - this will push a CreateAssessment API to the SAN Service
                Close out of the assessment, reverts back to the Offender record - now there is a button for 'Open S&N' and 'Open SP'`)

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk')

            cy.get<number>('@pk').then((pk) => {
                oasys.San.checkSanCreateAssessmentCall(pk, null, oasys.Users.probSanHeadPdu, oasys.Users.probationSanCode, 'INITIAL')
                oasys.Nav.clickButton('Close')
                offenderDetails.openSan.checkStatus('enabled')
                offenderDetails.openSp.checkStatus('enabled')

                log(`Click on the <Open S&N> button from the offender record - uses the OTL to open up the SAN Assessment
                    Complete entry of the SAN assessment with whatever you want
                    Return back to the Offender record`)

                oasys.San.gotoSanFromOffender()
                oasys.San.populateSanSections('Test ref 24', oasys.Populate.San.ExampleTest.sanPopulation1)
                oasys.San.returnToOASys()

                log(`Click on the <Open SSP> button from the offender record - uses the OTL to open up the Sentence Plan Service
                    Complete entry of the Sentence Plan with whatever you want but ensure you agree the plan
                    Return back to the Offender record`)

                oasys.ArnsSp.runScript('populateMinimal', { openFromOffender: true })

                log(`Check the database for the OASys-SAN assessment - at this point there will be nothing in it from the SAN assessment`)

                oasys.San.checkNoQuestionsCreated(pk)

                log(`Open up the OASys - SAN assessment - keep on the Case ID landing page - check the database, now data has been populated from the SAN assessment
                    Complete entry of the remaining non - populated OASys questions.If a full analysis has been invoked complete it.
                    Sign and lock the OASys - SAN assessment including countersigning if required - check the relevant APIs have gone to the SAN Service
                    Log out`)

                oasys.Assessment.openLatest()
                new oasys.Pages.Assessment.SanSections().checkCompletionStatus(true)

                // Complete section 1
                new oasys.Pages.Assessment.OffendingInformation().goto().count.setValue(1)

                const predictors = new oasys.Pages.Assessment.Predictors().goto(true)
                predictors.dateFirstSanction.setValue({ years: -2 })
                predictors.o1_32.setValue(2)
                predictors.o1_40.setValue(0)
                predictors.o1_29.setValue({ months: -1 })
                predictors.o1_30.setValue('No')
                predictors.o1_38.setValue({})

                oasys.Populate.Rosh.screeningNoRisks(true)

                new oasys.Pages.SentencePlan.SentencePlanService().goto()

                oasys.Assessment.signAndLock()
                oasys.San.checkSanSigningCall(pk, oasys.Users.probSanHeadPdu, 'SELF')

                oasys.logout()
            })
        })
    })

})
