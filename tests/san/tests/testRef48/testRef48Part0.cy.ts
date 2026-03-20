import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefFortyEight',
    gender: 'Male',
    dateOfBirth: { years: -20 },
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

describe('SAN integration - test ref 48', () => {

    /**
        Offender has a previous historic period of supervision where latest assessment is a 3.1 classic OASys
        Has a current period of supervision where the only assessment is a Layer 1 V1
        Assessor creates a 3.2 assessment - does NOT get asked whether they wish to clone section 3 to 13 and sentence plan question (improved cloning)
    */

    it('Test ref 48 part 0 - create offender', () => {

        oasys.login(oasys.Users.probSanHeadPdu)

        oasys.Offender.createProb(offender, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })
        })
    })
})