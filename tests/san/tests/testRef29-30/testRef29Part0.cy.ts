import * as oasys from 'oasys'

const offender1: OffenderDef = {

    forename1: 'TestRefTwentyOffOne',
    gender: 'Male',
    dateOfBirth: { years: -40 },
    event: {
        eventDetails: {
            sentenceType: 'Fine',
            sentenceDate: { months: -6 },
        },
        offences:
        {
            offence: '028',
            subcode: '01',
        },
    },
}

const offender2: OffenderDef = {

    forename1: 'TestRefTwentyOffTwo',
    gender: 'Male',
    dateOfBirth: { years: -40 },
    event: {
        eventDetails: {
            sentenceType: 'Fine',
            sentenceDate: { months: -6 },
        },
        offences:
        {
            offence: '028',
            subcode: '01',
        },
    },
}

describe('SAN integration - test ref 29', () => {
    /**
        Check 'Soft Deleting' OASys-SAN assessments in various states sends a notification to the SAN Service
     */

    it('Test ref 29 part 0 - create offender', () => {

        oasys.login(oasys.Users.probSanHeadPdu)  // No countersigning for this test

        oasys.Offender.createProb(offender1, 'offender1')
        oasys.Offender.createProb(offender2, 'offender2')

        cy.get<OffenderDef>('@offender1').then((offender1) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender1', value: JSON.stringify(offender1) })
            cy.get<OffenderDef>('@offender2').then((offender2) => {

                cy.task('storeValue', { key: 'offender2', value: JSON.stringify(offender2) })

                oasys.logout()
            })
        })
    })
})