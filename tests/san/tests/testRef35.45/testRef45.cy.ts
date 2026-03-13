import * as oasys from 'oasys'

describe('SAN integration - test ref 45', () => {

    it('Test ref 45', () => {
        /*
            Check the functionality when navigating to SAN via the new buttons on the offender record and the offender's latest assessment is a WIP classic 3.1
        */

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            cy.log(`Find an offender whose latest assessment is a fully completed 3.2`)

            const offender: OffenderDef = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)
            oasys.Nav.history(offender)

            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk')

            cy.get<number>('@pk').then((pk) => { // pk of the latest 3.2 assessment

                // Complete the WIP 3.2 from test 35
                oasys.Assessment.openLatest()
                oasys.Populate.RoshPages.RoshSummary.specificRiskLevel('Low')
                new oasys.Pages.SentencePlan.SentencePlanService().goto()
                oasys.Assessment.signAndLock()

                cy.log(`As the assessor create a new assessment BUT make it a classic 3.1 assessment, say 'No' to the SAN question
                        Close the WIP 3.1`)

                oasys.Nav.history(offender)
                oasys.Assessment.createProb({ purposeOfAssessment: 'Review', includeSanSections: 'No' })

                oasys.Nav.clickButton('Close')

                cy.log(`From the offender record click on the <Open S&N> button
                    Navigates out to the SAN Assessment which should be shown in READ ONLY mode - check the OTL access mode parameter for SAN
                    Return back to OASys`)

                oasys.Nav.clickButton('Open S&N')
                oasys.San.checkSanEditMode(false)

                oasys.San.checkSanOtlCall(pk, {
                    'crn': offender.probationCrn,
                    'pnc': offender.pnc,
                    'nomisId': null,
                    'givenName': offender.forename1,
                    'familyName': offender.surname,
                    'dateOfBirth': offender.dateOfBirth,
                    'gender': '1',
                    'location': 'COMMUNITY',
                    'sexuallyMotivatedOffenceHistory': 'NO',
                }, {
                    'displayName': oasys.Users.probSanHeadPdu.forenameSurname,
                    'accessMode': 'READ_ONLY',
                },
                    'san', null
                )

                oasys.San.returnToOASys()

                cy.log(`From the offender record click on the <Open SP> button
                    Navigates out to the Sentence Plan which should be shown in READ WRITE mode - check the OTL access mode parameter for SP
                    Return back to OASys`)

                oasys.ArnsSp.runScript('openAndReturn', { openFromOffender: true })

                oasys.San.checkSanOtlCall(pk, {
                    'crn': offender.probationCrn,
                    'pnc': offender.pnc,
                    'nomisId': null,
                    'givenName': offender.forename1,
                    'familyName': offender.surname,
                    'dateOfBirth': offender.dateOfBirth,
                    'gender': '1',
                    'location': 'COMMUNITY',
                    'sexuallyMotivatedOffenceHistory': 'NO',
                }, {
                    'displayName': oasys.Users.probSanHeadPdu.forenameSurname,
                    'planAccessMode': 'READ_WRITE',
                },
                    'sp', null
                )

                oasys.logout()
            })
        })
    })
})
