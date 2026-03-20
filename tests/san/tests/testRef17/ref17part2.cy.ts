import * as oasys from 'oasys'


describe('SAN integration - test ref 17 part 2', () => {

    it('Test ref 17 part 2 - Check countersigning overview', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            cy.log(`Log out and log back in as the countersigner to the probation area	
                        Take a note of what is in the OASYS_SET record for fields 'LASTUPD_FROM_SAN', 'SAN_ASSESSMENT_VERSION_NO' and
                         'SSP_PLAN_VERSION_NO' (should have been set from the response to the SIGN API)	
                        Open up the countersigning task and then open up the assessment	
                        Countersigner shown the correct 'Countersigning Overview' screen:	
                            Assessor's Comment: {text from the CSIGN task}
                            This is the first assessment in the Offender's period of supervision.
                            The following factors determine why the assessment has been presented for countersignature:
                            • Offender has been assessed as Medium risk
                            • Risks to identifiable children (R7)
                            • Integrated Offender Management (IOM)
                        Return back to the assessment - now on the last screen for the Initial Sentence Plan`)

            oasys.login(oasys.Users.probSanPo)
            oasys.Task.openAssessmentFromCountersigningTaskByName(offender.surname)
            const countersigningOverview = new oasys.Pages.Signing.CountersigningOverview()
            countersigningOverview.header.checkStatus('visible')
            countersigningOverview.details.checkValue('Signing test 17', true)
            countersigningOverview.details.checkValue('Offender has been assessed as Medium risk', true)
            countersigningOverview.details.checkValue('Risks to identifiable children (R7)', true)

            // TODO restore IOM
            // countersigningOverview.details.checkValue('Integrated Offender Management (IOM)', true)

            countersigningOverview.returnToAssessment.click()
            new oasys.Pages.SentencePlan.SentencePlanService().checkCurrent()

            oasys.logout()

            const sanColumnsQuery = `select LASTUPD_FROM_SAN, SAN_ASSESSMENT_VERSION_NO, SSP_PLAN_VERSION_NO from eor.oasys_set where cms_prob_number = '${offender.probationCrn}'`
            oasys.Db.getData(sanColumnsQuery, 'oasysSetData')
            cy.get<string[][]>('@oasysSetData').then((sanColumnsQuery1) => {

                // Save the oasys_set details for use in later test
                cy.task('storeValue', { key: 'sanColumnsQuery1', value: JSON.stringify(sanColumnsQuery1) })
            })
        })
    })
})