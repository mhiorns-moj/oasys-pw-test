import * as oasys from 'lib'

describe('SAN integration - test ref 22 part 3', () => {

    it('Test ref 22 part 3 - check offender 2', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender2').then((offenderData) => {
            const offender2 = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)
            oasys.Offender.searchAndSelectByPnc(offender2.pnc)

            oasys.Db.getAllSetPksByPnc(offender2.pnc, 'pks', true)
            cy.get<number>('@pks').then((pks) => {

                const assessmentsTab = new oasys.Pages.Offender.AssessmentsTab()
                assessmentsTab.assessments.checkCount(7)

                // 3rd assessment
                assessmentsTab.assessments.clickNthRow(5)
                checkAssessment(offender2, pks[4], 0, 0, 'Homeowner')
                oasys.Nav.clickButton('Close')

                // 4th assessment
                assessmentsTab.assessments.clickNthRow(3)
                checkAssessment(offender2, pks[2], 1, 2, 'Living with friends or family')
                oasys.Nav.clickButton('Close')

                // 6th assessment
                assessmentsTab.assessments.clickNthRow(2)
                checkAssessment(offender2, pks[1], 2, 4, 'Renting privately')
                oasys.Nav.clickButton('Close')

                // 7th assessment
                assessmentsTab.assessments.clickNthRow(1)
                checkAssessment(offender2, pks[0], 3, 6, 'Renting from social, local authority or other')
                oasys.Nav.clickButton('Close')

                oasys.logout()
            })
        })
    })
})


function checkAssessment(offender: OffenderDef, pk: number, assessmentVersion: number, spVersion: number, accommodation: string) {

    cy.log(`Checking assessment pk ${pk}`)
    oasys.San.gotoSanReadOnly('Accommodation','information')
    oasys.San.checkSanOtlCall(pk,
        {
            'crn': offender.probationCrn,
            'pnc': offender.pnc,
            'nomisId': null,
            'givenName': offender.forename1,
            'familyName': offender.surname,
            'dateOfBirth': offender.dateOfBirth,
            'gender': '1',
            'location': 'COMMUNITY',
            'sexuallyMotivatedOffenceHistory': null,
        },
        { 'displayName': oasys.Users.probSanHeadPdu.forenameSurname, 'accessMode': 'READ_ONLY', },
        'san', assessmentVersion
    )
    oasys.San.checkSanEditMode(false)

    cy.get('#main-content').then((container) => {
        expect(container.find('.summary__answer:contains("Settled"):visible').length).equal(1)
        expect(container.find(`.summary__answer--secondary:contains("${accommodation}"):visible`).length).equal(1)

        oasys.San.returnToOASys()

        oasys.ArnsSp.runScript('checkReadOnly')
        oasys.San.checkSanOtlCall(pk,
            {
                'crn': offender.probationCrn,
                'pnc': offender.pnc,
                'nomisId': null,
                'givenName': offender.forename1,
                'familyName': offender.surname,
                'dateOfBirth': offender.dateOfBirth,
                'gender': '1',
                'location': 'COMMUNITY',
                'sexuallyMotivatedOffenceHistory': null,
            },
            { 'displayName': oasys.Users.probSanHeadPdu.forenameSurname, 'planAccessMode': 'READ_ONLY', },
            'sp', spVersion
        )

    })
}