import * as oasys from 'oasys'


describe('SAN integration - test ref 15 part 3', () => {

    it('Test ref 15 part 3 - Countersign SAN assessment (twice)', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.users.prisSanPom)
            await offender.searchAndSelectByPnc(offender.pnc)
            await assessment.openLatest()

            log(`Countersign the assessment - Check that the countersigning option NO LONGER include 'Send for sentence board comments' 
                Continue to countersign - asks for a second countersign - accept default and continue to countersign - check that the COUNTERSIGN API has been posted 
                    with contents correct (outcome = 'AWAITING_DOUBLE_COUNTERSIGN' along with first countersigners ID and name)`)

            new oasys.Pages.SentencePlan.SentencePlanService().goto().countersign.click()
            const countersigning = new oasys.Pages.Signing.Countersigning()
            countersigning.selectAction.checkOptions(['', 'Countersign', 'Reject for Rework'])
            countersigning.selectAction.setValue('Countersign')

            countersigning.comments.setValue('Countersigning test ref 15')
            countersigning.ok.click()
            const nextCountersigner = new oasys.Pages.Signing.CountersignatureRequired()
            nextCountersigner.comments.setValue('Sending for second countersignature')
            nextCountersigner.confirm.click()
            new oasys.Pages.Tasks.TaskManager().checkCurrent()

            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk')
            cy.get<number>('@pk').then((pk) => {

                await san.checkSanCountersigningCall(pk, oasys.users.prisSanPom, 'AWAITING_DOUBLE_COUNTERSIGN')

                oasys.logout()

                log(`Log in as the second countersigner - countersign the assessment, is now fully completed - check the COUNTERSIGN API has been posted with 
                    contents correct (outcome = 'DOUBLE_COUNTERSIGNED' along with second countersigners ID and  name)
                    OASys-SAN assessment now in read only mode - Print the whole of the assessment.  Ensure the printout is correct to the screens.`)

                oasys.login(oasys.users.prisSanHomds)
                await offender.searchAndSelectByPnc(offender.pnc)
                await assessment.openLatest()
                oasys.Assessment.countersign({ page: oasys.Pages.SentencePlan.SentencePlanService, comment: 'Countersigning test ref 15 second time' })

                await san.checkSanCountersigningCall(pk, oasys.users.prisSanHomds, 'DOUBLE_COUNTERSIGNED')

                oasys.Nav.history()
                await san.gotoSanReadOnly('Accommodation', 'information')
                await san.checkSanEditMode(false)
                await san.returnToOASys()

                oasys.ArnsSp.runScript('checkReadOnly')

            })
        })
    })
})

