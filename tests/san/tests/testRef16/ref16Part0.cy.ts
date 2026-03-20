import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefSixteen',
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

describe('SAN integration - test ref 16 part 0', () => {
    /*
    New Male offender in PRISON which is a SAN prison area and the CMS stub has a custodial sentence on it for when the reception event takes place.  Age is >18.
    Create new OASys-SAN assessment. 
    Test will check the reassigning of the WIP task - drop down only comprises of those users who have the SAN Function.
    Also incorporates check of Male OPD calculation AND Learning Screening Tool (data taken from the SAN assessment).
    */

    it('Test ref 16 part 0 - create offender', () => {

        oasys.login(oasys.Users.prisSanUnappr)

        oasys.Offender.createPris(offender, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })

            oasys.logout()
        })
    })

})