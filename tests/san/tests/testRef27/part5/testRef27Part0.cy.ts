import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefTwentySeven-Five',
    gender: 'Male',
    dateOfBirth: { years: -40 },

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

describe('SAN integration - test ref 27', () => {

    it('Test ref 27 part 5 - create offender', () => {

        log(`Lock Incomplete a prison OASys-SAN assessment when the Offender has been discharged from Prison (WIP guillotines immediately)`)

        await oasys.login(oasys.users.probHeadPdu)

        oasys.Offender.createProb(offender, 'offender')
        await oasys.logout()

        await oasys.login(oasys.users.prisSanUnappr)
        oasys.Offender.createReceptionEvent('@offender')
        await oasys.logout()
        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })
        })
    })
})