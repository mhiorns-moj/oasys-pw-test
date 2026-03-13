import * as oasys from 'lib'
import * as testData from '../../data/testRef29'

describe('SAN integration - test ref 29/30', () => {

    it('Test ref 29/30 part 3', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender2').then((offenderData) => {

            cy.log(`Find an offender who already has at least one OASys assessment in the latest period of supervision
                Ensure the latest assessment is a completed OASYS-SAN with a SARA also completed`)

            const offender2 = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanPo)
            oasys.Offender.searchAndSelectByPnc(offender2.pnc)

            // Create and complete assessment and SARA
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
            // Complete section 1
            new oasys.Pages.Assessment.OffendingInformation().goto().count.setValue(1)

            const predictors = new oasys.Pages.Assessment.Predictors().goto(true)
            predictors.dateFirstSanction.setValue({ years: -2 })
            predictors.o1_30.setValue('Yes')
            predictors.o1_41.setValue('No')
            predictors.o1_32.setValue(2)
            predictors.o1_40.setValue(0)
            predictors.o1_29.setValue({ months: -1 })
            predictors.o1_33.setValue({ months: -6 })
            predictors.o1_34.setValue(1)
            predictors.o1_45.setValue(1)
            predictors.o1_46.setValue(1)
            predictors.o1_38.setValue({ months: -1 })
            predictors.o1_37.setValue(1)

            oasys.San.gotoSan()
            oasys.San.populateSanSections('TestRef29 complete SAN', testData.sanPopulation)
            oasys.San.returnToOASys()
            oasys.Nav.clickButton('Next')
            oasys.Nav.clickButton('Next')
            oasys.Nav.clickButton('Create')

            oasys.Populate.Sara.sara('Low','Low')
            const sara = new oasys.Pages.Sara.Sara()
            sara.signAndLock.click()
            sara.confirmSignAndLock.click()

            oasys.Nav.history(offender2, 'Start of Community Order')
            oasys.Populate.RoshPages.RoshScreeningSection1.noRisks()
            oasys.Populate.RoshPages.RoshScreeningSection2to4.noRisks(true)
            oasys.Populate.RoshPages.RoshSummary.specificRiskLevel('High')
            oasys.Populate.RoshPages.RiskManagementPlan.minimalWithTextFields()
            oasys.Nav.clickButton('Save')

            oasys.ArnsSp.runScript('populateTwoGoals')

            new oasys.Pages.SentencePlan.SentencePlanService().goto()
            oasys.Assessment.signAndLock({ expectCountersigner: true, countersigner: oasys.Users.probSanHeadPdu, countersignComment: 'Sending test ref 20 for countersigning' })

            // Countersign
            oasys.logout()
            oasys.login(oasys.Users.probSanHeadPdu)
            oasys.Assessment.countersign({ offender: offender2 })
            oasys.logout()

            cy.log(`Log into the SAN Pilot area as an Administrator
                    Search for the offender and open up the SARA
                    From the Admin menu select 'Delete SARA - enter in a reason for the deletion and then click on OK
                    Check that a Delete API has NOT been sent to the SAN Service`)

            oasys.Db.getLatestSetPkByPnc(offender2.pnc, 'pk')

            cy.get<number>('@pk').then((pk) => {

                oasys.Db.getData(`select oasys_set_pk from eor.oasys_set where parent_oasys_set_pk = ${pk}`, 'saraData')
                cy.get<string[][]>('@saraData').then((saraData) => {
                    const saraPk = Number.parseInt(saraData[0][0])
                    cy.log(`SARA PK: ${saraPk}`)

                    oasys.login(oasys.Users.admin, oasys.Users.probationSan)
                    oasys.Offender.searchAndSelectByPnc(offender2.pnc)
                    oasys.Assessment.open(2)  // SARA is second on the list
                    const deleteSara = new oasys.Pages.Sara.DeleteSara().goto(true)
                    deleteSara.reasonForDeletion.setValue('Testing')
                    deleteSara.ok.click()

                    oasys.Assessment.checkDeleted(saraPk)
                    oasys.Assessment.checkSigningRecord(saraPk, ['SARA_DEL_SIGNING', 'SARA_SIGNING'])
                    oasys.San.checkNoSanCall(saraPk)

                    cy.log(`Now open up the OASys-SAN assessment
                    From the Admin menu select 'Delete assessment' - enter in a reason for the deletion and then click on OK
                        The OASYS_SET record for the OASys-SAN assessment has the field DELETED_DATE set to system date and time the deletion took place
                        An OASYS_SIGNING record has been created for the deletion 'ASSMT_DEL_SIGNING'
                        A Delete API has been sent to the SAN Service - check the parameters are the OASYS_SET_PK, Admins User ID and Name - a 200 response has been received back`)

                    oasys.Nav.history(offender2)
                    oasys.Assessment.deleteLatest()
                    oasys.San.checkSanDeleteCall(pk, oasys.Users.admin)
                    oasys.Assessment.checkDeleted(pk)
                    oasys.Assessment.checkSigningRecord(pk, ['ASSMT_DEL_SIGNING', 'COUNTERSIGNING', 'SIGNING'])


                    cy.log(`Test ref 30 - reverse deletion test`)
                    oasys.Assessment.reverseDeletion(offender2, 'Assessment', 'Start', 'Test ref 30 part 3 deletion reversal')

                    oasys.Assessment.checkNotDeleted(pk)
                    oasys.Assessment.checkSigningRecord(pk, ['ASS_DEL_RESTORE', 'ASSMT_DEL_SIGNING', 'COUNTERSIGNING', 'SIGNING'])
                    oasys.San.checkSanUndeleteCall(pk, oasys.Users.admin)
                    oasys.Assessment.checkNotDeleted(saraPk)
                    oasys.Assessment.checkSigningRecord(saraPk, ['SARA_DEL_RESTORE', 'SARA_DEL_SIGNING', 'SARA_SIGNING'])
                    oasys.San.checkNoSanCall(saraPk)

                    oasys.logout()
                })
            })
        })
    })

})
