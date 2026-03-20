import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefFifteen',
    gender: 'Male',
    dateOfBirth: { years: -30 },
    event: {
        eventDetails: {
            sentenceType: 'Custody (1 to 4 yrs - ACR)',
            sentenceDate: { months: -6 },
            sentenceMonths: 24,
        },
        offences:
        {
            offence: '028',
            subcode: '01',
        },
    },
}

describe('SAN integration - test ref 15 part 0', () => {

    it('Test ref 15 part 0 - create offender', () => {

        oasys.login(oasys.Users.prisSanCAdm)

        oasys.Offender.createPris(offender, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })

            oasys.logout()
        })
    })

})