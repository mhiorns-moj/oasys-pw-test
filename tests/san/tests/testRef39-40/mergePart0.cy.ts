import * as oasys from 'oasys'

const offender1: OffenderDef = {

    forename1: 'MergeOne',
    gender: 'Male',
    dateOfBirth: { years: -20 },
}

const offender2: OffenderDef = {

    forename1: 'MergeTwo',
    gender: 'Male',
    dateOfBirth: { years: -20 },
}

describe('SAN integration - tests 39-40 part 0', () => {
    /**
     * Merge - where BOTH offenders have OASys-SAN assessments
     * Merge two offenders where BOTH of the offenders have OASys-SAN assessments - check it posts the correct MERGE API
     * 
     * De-merge - where BOTH offenders have OASys-SAN assessments
     * Using the offender who was previously merged in this situation, create and complete a new OASys-SAN assessment.
     * The carry out a De-merge - check it posts the correct MERGE API
     * 
     * Check they end up with the correct SAN assessment - set some text to identify which is which
     */

    it('Create offenders', () => {

        oasys.login(oasys.Users.probSanUnappr)

        oasys.Offender.createProb(offender1, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender1', value: JSON.stringify(offender) })
        })
        oasys.Offender.createProb(offender2, 'offender2')
        cy.get<OffenderDef>('@offender2').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender2', value: JSON.stringify(offender) })
        })
        oasys.logout()

    })
})