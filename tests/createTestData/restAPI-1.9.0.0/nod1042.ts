import * as oasys from 'lib'

const offender1: OffenderDef = {

    forename1: 'NOD1042',
    gender: 'Male',
    dateOfBirth: { years: -17 },

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

    forename1: 'NOD1042',
    gender: 'Male',
    dateOfBirth: { years: -25 },

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
const offender3: OffenderDef = {

    forename1: 'NOD1042',
    gender: 'Female',
    dateOfBirth: { years: -25 },

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

describe('NOD1042', () => {

    it('Create test data', () => {

        oasys.login('BROB_SUPPORT03', 'Pa55word1')

        oasys.Offender.createProb(offender1, 'offender1')
        oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'No' })
        oasys.Populate.minimal({ layer: 'Layer 3' })
        oasys.Nav.clickButton('Close')

        oasys.Offender.createProb(offender2, 'offender2')
        oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'No' })
        oasys.Populate.minimal({ layer: 'Layer 3' })
        oasys.Nav.clickButton('Close')

        oasys.Offender.createProb(offender3, 'offender3')
        oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'No' })
        oasys.Populate.minimal({ layer: 'Layer 3' })
        oasys.Nav.clickButton('Close')

        oasys.logout()
    })

})
