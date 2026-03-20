import * as oasys from 'oasys'

const offender1: OffenderDef = {

    forename1: 'TestTwentyOneOffenderOne',
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

const offender2: OffenderDef = {

    forename1: 'TestTwentyOneOffenderTwo',
    gender: 'Male',
    dateOfBirth: { years: -20 },
    event: {
        eventDetails: {
            sentenceType: 'Fine',
            sentenceDate: { months: -1 },
        },
        offences:
        {
            offence: '030',
            subcode: '01',
        },
    },
}

describe('SAN integration - test ref 21 part 0', () => {
    /**
        MERGE -1st offender just has ONE 3.1 assessment (created before the 2nd offender's assessments).  
        2nd offender has combination of assessments (L1, 3.1 and 3.2).  
        They merge - check the merge API sends the parameters correctly.  
        Check the NEW OASYS_SET records have the 'clone from' field updated to the newly created OASYS_SET records.
     */

    it('Create offenders', () => {

        oasys.login(oasys.Users.probHeadPdu)

        oasys.Offender.createProb(offender1, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender1', value: JSON.stringify(offender) })
        })
        oasys.logout()

        oasys.login(oasys.Users.probSanHeadPdu)
        oasys.Offender.createProb(offender2, 'offender2')
        cy.get<OffenderDef>('@offender2').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender2', value: JSON.stringify(offender) })
            oasys.logout()

            oasys.login(oasys.Users.probHeadPdu)
            oasys.Offender.addProbationOffenderToStub(offender)
            oasys.logout()
        })
    })
})