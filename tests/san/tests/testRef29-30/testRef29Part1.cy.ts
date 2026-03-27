import * as oasys from 'oasys'

describe('SAN integration - test ref 29/30', () => {

    it('Test ref 29/30 part 1', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender1').then((offenderData) => {

            const offender1: OffenderDef = JSON.parse(offenderData as string)

            await oasys.login(oasys.users.probSanHeadPdu)

            log(`Create an offender whose latest assessment is a fully completed OASYS-SAN`)

            await offender.searchAndSelectByPnc(offender1.pnc)

            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender1.pnc, 'pk')

            cy.get<number>('@pk').then((pk) => {

                await san.gotoSan()
                await san.populateSanSections('Test ref 29', oasys.Populate.San.ExampleTest.sanPopulation1)
                await san.returnToOASys()

                await sentencePlan.populateMinimal()

                // Complete section 1
                await sections.offendingInformation.populateMinimal()

                await sections.predictors.goto(true)
                await sections.predictors.dateFirstSanction.setValue({ years: -2 })
                await sections.predictors.o1_32.setValue(2)
                await sections.predictors.o1_40.setValue(0)
                await sections.predictors.o1_29.setValue({ months: -1 })
                await sections.predictors.o1_30.setValue('No')
                await sections.predictors.o1_38.setValue({})

                await risk.screeningNoRisks(true)

                new oasys.Pages.SentencePlan.SentencePlanService().goto()

                await signing.signAndLock()

                await oasys.logout()

                log(`Log into the SAN Pilot area as an Administrator
                    Search for the offender and open up the readonly OASys-SAN assessment
                    From the Admin menu select 'Delete assessment' - enter in a reason for the deletion and then click on OK
                    The OASYS_SET record for the OASys-SAN assessment has the field DELETED_DATE set to system date and time the deletion took place
                    An OASYS_SIGNING record has been created for the deletion 'ASSMT_DEL_SIGNING'
                    A Delete API has been sent to the SAN Service - check the parameters are the OASYS_SET_PK, Admins User ID and Name - a 200 response has been received back`)

                await oasys.login(oasys.users.admin, oasys.users.probationSan)
                await offender.searchAndSelectByPnc(offender1.pnc)
                await assessment.deleteLatest()
                oasys.Assessment.checkDeleted(pk)
                oasys.Assessment.checkSigningRecord(pk, ['ASSMT_DEL_SIGNING', 'SIGNING'])
                await san.queries.checkSanDeleteCall(pk, oasys.users.admin)

                log(`Test ref 30 - reverse deletion test`)
                oasys.Assessment.reverseDeletion(offender1, 'Assessment', 'Start of Community Order', 'Test ref 30 part 1 deletion reversal')

                oasys.Assessment.checkNotDeleted(pk)
                oasys.Assessment.checkSigningRecord(pk, ['ASS_DEL_RESTORE', 'ASSMT_DEL_SIGNING', 'SIGNING'])
                await san.queries.checkSanUndeleteCall(pk, oasys.users.admin)

                await oasys.logout()
            })
        })
    })

})
