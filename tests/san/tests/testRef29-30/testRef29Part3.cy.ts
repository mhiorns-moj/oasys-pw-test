import * as oasys from 'oasys'
import * as testData from '../../data/testRef29'

describe('SAN integration - test ref 29/30', () => {

    it('Test ref 29/30 part 3', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender2').then((offenderData) => {

            log(`Find an offender who already has at least one OASys assessment in the latest period of supervision
                Ensure the latest assessment is a completed OASYS-SAN with a SARA also completed`)

            const offender2 = JSON.parse(offenderData as string)

            await oasys.login(oasys.users.probSanPo)
            await offender.searchAndSelectByPnc(offender2.pnc)

            // Create and complete assessment and SARA
            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
            // Complete section 1
            await assessment.offendingInformation.populateMinimal()

            await assessment.predictors.goto(true)
            await assessment.predictors.dateFirstSanction.setValue({ years: -2 })
            await assessment.predictors.o1_30.setValue('Yes')
            await assessment.predictors.o1_41.setValue('No')
            await assessment.predictors.o1_32.setValue(2)
            await assessment.predictors.o1_40.setValue(0)
            await assessment.predictors.o1_29.setValue({ months: -1 })
            await assessment.predictors.o1_33.setValue({ months: -6 })
            await assessment.predictors.o1_34.setValue(1)
            await assessment.predictors.o1_45.setValue(1)
            await assessment.predictors.o1_46.setValue(1)
            await assessment.predictors.o1_38.setValue({ months: -1 })
            await assessment.predictors.o1_37.setValue(1)

            await san.gotoSan()
            await san.populateSanSections('TestRef29 complete SAN', testData.sanPopulation)
            await san.returnToOASys()
            await oasys.clickButton('Next')
            await oasys.clickButton('Next')
            await oasys.clickButton('Create')

            oasys.Populate.Sara.sara('Low', 'Low')
            const sara = new oasys.Pages.Sara.Sara()
            sara.signAndLock.click()
            sara.confirmSignAndLock.click()

            await oasys.history(offender2, 'Start of Community Order')
            oasys.Populate.RoshPages.RoshScreeningSection1.noRisks()
            oasys.Populate.RoshPages.RoshScreeningSection2to4.noRisks(true)
            await risk.populateWithSpecificRiskLevel('High')
            oasys.Populate.RoshPages.RiskManagementPlan.minimalWithTextFields()
            await oasys.clickButton('Save')

            oasys.ArnsSp.runScript('populateTwoGoals')

            new oasys.Pages.SentencePlan.SentencePlanService().goto()
            await signing.signAndLock({ expectCountersigner: true, countersigner: oasys.users.probSanHeadPdu, countersignComment: 'Sending test ref 20 for countersigning' })

            // Countersign
            await oasys.logout()
            await oasys.login(oasys.users.probSanHeadPdu)
            await signing.countersign({ offender: offender2 })
            await oasys.logout()

            log(`Log into the SAN Pilot area as an Administrator
                    Search for the offender and open up the SARA
                    From the Admin menu select 'Delete SARA - enter in a reason for the deletion and then click on OK
                    Check that a Delete API has NOT been sent to the SAN Service`)

            oasys.Db.getLatestSetPkByPnc(offender2.pnc, 'pk')

            cy.get<number>('@pk').then((pk) => {

                oasys.Db.getData(`select oasys_set_pk from eor.oasys_set where parent_oasys_set_pk = ${pk}`, 'saraData')
                cy.get<string[][]>('@saraData').then((saraData) => {
                    const saraPk = Number.parseInt(saraData[0][0])
                    log(`SARA PK: ${saraPk}`)

                    await oasys.login(oasys.users.admin, oasys.users.probationSan)
                    await offender.searchAndSelectByPnc(offender2.pnc)
                    oasys.Assessment.open(2)  // SARA is second on the list
                    const deleteSara = new oasys.Pages.Sara.DeleteSara().goto(true)
                    deleteSara.reasonForDeletion.setValue('Testing')
                    deleteSara.ok.click()

                    oasys.Assessment.checkDeleted(saraPk)
                    oasys.Assessment.checkSigningRecord(saraPk, ['SARA_DEL_SIGNING', 'SARA_SIGNING'])
                    await san.checkNoSanCall(saraPk)

                    log(`Now open up the OASys-SAN assessment
                    From the Admin menu select 'Delete assessment' - enter in a reason for the deletion and then click on OK
                        The OASYS_SET record for the OASys-SAN assessment has the field DELETED_DATE set to system date and time the deletion took place
                        An OASYS_SIGNING record has been created for the deletion 'ASSMT_DEL_SIGNING'
                        A Delete API has been sent to the SAN Service - check the parameters are the OASYS_SET_PK, Admins User ID and Name - a 200 response has been received back`)

                    await oasys.history(offender2)
                    await assessment.deleteLatest()
                    await san.queries.checkSanDeleteCall(pk, oasys.users.admin)
                    oasys.Assessment.checkDeleted(pk)
                    oasys.Assessment.checkSigningRecord(pk, ['ASSMT_DEL_SIGNING', 'COUNTERSIGNING', 'SIGNING'])


                    log(`Test ref 30 - reverse deletion test`)
                    oasys.Assessment.reverseDeletion(offender2, 'Assessment', 'Start', 'Test ref 30 part 3 deletion reversal')

                    oasys.Assessment.checkNotDeleted(pk)
                    oasys.Assessment.checkSigningRecord(pk, ['ASS_DEL_RESTORE', 'ASSMT_DEL_SIGNING', 'COUNTERSIGNING', 'SIGNING'])
                    await san.queries.checkSanUndeleteCall(pk, oasys.users.admin)
                    oasys.Assessment.checkNotDeleted(saraPk)
                    oasys.Assessment.checkSigningRecord(saraPk, ['SARA_DEL_RESTORE', 'SARA_DEL_SIGNING', 'SARA_SIGNING'])
                    await san.checkNoSanCall(saraPk)

                    await oasys.logout()
                })
            })
        })
    })

})
