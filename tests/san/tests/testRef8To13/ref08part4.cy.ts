import * as oasys from 'lib'

describe('SAN integration - test ref 08 part 4', () => {

    it('Test ref 8 part 4 - Check countersigning overview', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            cy.log(`Log out and log back in as the countersigner to the probation area
                Take a note of what is in the OASYS_SET record for fields 'LASTUPD_FROM_SAN' and 'SAN_ASSESSMENT_VERSION_NO' (should have been set from the response to the SIGN API)
                Open up the countersigning task and then open up the assessment
                Countersigner shown the correct 'Countersigning Overview' screen
                Return back to the assessment - now on the first Initial Sentence Plan screen`)

            oasys.login(oasys.Users.probSanHeadPdu)
            oasys.Task.openAssessmentFromCountersigningTaskByName(offender.surname)
            const countersigningOverview = new oasys.Pages.Signing.CountersigningOverview()
            countersigningOverview.header.checkStatus('visible')
            countersigningOverview.details.checkValue('3.2 assessment needs countersigning', true)
            countersigningOverview.details.checkValue(`Countersigning required, Assessor's role at time of signing the assessment was 'Unapproved'`, true)
            const today = oasys.OasysDateTime.testStartDate.toLocaleString()
            countersigningOverview.details.checkValue(`The previous assessment was countersigned for the same risk attributes by ${oasys.Users.probSanHeadPdu.forenameSurname} on the ${today}`, true)

            countersigningOverview.returnToAssessment.click()
            new oasys.Pages.SentencePlan.IspSection52to8().checkCurrent()

            oasys.logout()

        })
    })
})