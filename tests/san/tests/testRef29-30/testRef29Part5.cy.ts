import * as oasys from 'oasys'

describe('SAN integration - test ref 29/30', () => {

    it('Test ref 29/30 part 5', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender1').then((offenderData) => {

            const offender: OffenderDef = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)

            cy.log(`Create an offender whose latest assessment is a locked incomplete OASYS-SAN`)

            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk')

            cy.get<number>('@pk').then((pk) => {

                oasys.Nav.clickButton('Close')
                oasys.Assessment.lockIncomplete()

                oasys.logout()

                cy.log(`Log into the SAN Pilot area as an Administrator
                    Search for the offender and open up the readonly OASys-SAN assessment
                    From the Admin menu select 'Delete assessment' - enter in a reason for the deletion and then click on OK
                    The OASYS_SET record for the OASys-SAN assessment has the field DELETED_DATE set to system date and time the deletion took place
                    An OASYS_SIGNING record has been created for the deletion 'ASSMT_DEL_SIGNING'
                    A Delete API has been sent to the SAN Service - check the parameters are the OASYS_SET_PK, Admins User ID and Name - a 200 response has been received back`)

                oasys.login(oasys.Users.admin, oasys.Users.probationSan)
                oasys.Offender.searchAndSelectByPnc(offender.pnc)
                oasys.Assessment.deleteLatest()
                oasys.Assessment.checkDeleted(pk)
                oasys.Assessment.checkSigningRecord(pk, ['ASSMT_DEL_SIGNING', 'LOCKED_INCOMPLETE'])
                oasys.San.checkSanDeleteCall(pk, oasys.Users.admin)


                cy.log(`Test ref 30 - reverse deletion test`)
                oasys.Assessment.reverseDeletion(offender, 'Assessment', 'Start', 'Test ref 30 part 5 deletion reversal')

                oasys.Assessment.checkNotDeleted(pk)
                oasys.Assessment.checkSigningRecord(pk, ['ASS_DEL_RESTORE', 'ASSMT_DEL_SIGNING', 'LOCKED_INCOMPLETE'])
                oasys.San.checkSanUndeleteCall(pk, oasys.Users.admin)

                oasys.logout()
            })
        })
    })

})
