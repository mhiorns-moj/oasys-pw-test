import * as oasys from 'lib'

// Define an offender like this: (CTRL-click on 'OffenderDef' below to see the fields available).
// nomisId, probationCrn, pnc and surname can all be included, but unique values will be generated if they are missing or null.

const offender1: OffenderDef = {

    forename1: 'Autotest',
    gender: 'Male',
    dateOfBirth: { years: -25 },    // Dates can be a fixed string in the correct format (e.g. '21/01/2025')
    // or an offset object to calculate based on today's date (plus or minus days, weeks, months and/or years).

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

// ... or select one from the library like this:
const offender2 = oasys.OffenderLib.Prison.Male.burglary

describe('NODxxxx', () => {

    it('Create test data', () => {

        // Predefined users (oasys.users....) can be replaced with 'username', 'password'.  In either case, add a provider (e.g. 'Kent') if the user has multiple profiles.
        oasys.login(oasys.Users.probHeadPdu)

        // Create the offenders
        oasys.Offender.createProb(offender1, 'offender1') // Second parameter creates a Cypress alias for later use
        oasys.Offender.createProb(offender2, 'offender2')

        // Do stuff with an offender using the reference alias, for example:
        oasys.Offender.searchAndSelect('@offender1')
        oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
        oasys.Populate.minimal({ layer: 'Layer 1' })
        oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan })

        oasys.logout()
    })

})
