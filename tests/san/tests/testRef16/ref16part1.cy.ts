import * as oasys from 'oasys'

describe('SAN integration - test ref 16 part 1', () => {

    it('Test ref 16 part 1 - Create a 3.2 assessment and re-assign task', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)


            cy.log(`Log in an Assessor who can complete SAN assessments.
                Open up the Offender record, create a new OASys-SAN assessment
                Close out of the OASys-SAN assessment and navigate to the Task Manager`)

            oasys.login(oasys.Users.prisSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Assessment.createPris({ purposeOfAssessment: 'Start custody' })
            oasys.Nav.clickButton('Close')
            new oasys.Pages.Tasks.TaskManager().goto()

            cy.log(`Open up the Assessment WIP task for this assessment
                Click on the <Reassign to User> drop down field
                Ensure that ALL the users SHOWN HAVE the 'Use SAN Service' function in their role(s).
                You should NOT be able to reassign this assessment to a NON SAN service user.
                Pick one of the SAN users and reassign the task to them.`)

            oasys.Task.search({ taskName: 'Assessment Work in Progress', offenderName: offender.surname })
            oasys.Task.selectFirstTask()

            const task = new oasys.Pages.Tasks.AssessmentWipTask()
            task.reassignToUser.checkOptionNotPresent(oasys.Users.prisSanCAdm.lovLookup)  // Case admin user doesn't have the SAN service so shouldn't be in the list
            task.reassignToUser.setValue(oasys.Users.prisSanPom.lovLookup)
            task.save.click()

            oasys.logout()

        })
    })
})
