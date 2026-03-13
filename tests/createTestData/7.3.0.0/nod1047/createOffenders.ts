import * as oasys from 'lib'
import * as offenders from './offenderList'

const baseOffenderProb: OffenderDef = {

    forename1: 'Offender',
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

const baseOffenderPris: OffenderDef = {

    forename1: 'Offender',
    gender: 'Male',
    dateOfBirth: { years: -20 },
    dischargeAddressLine1: 'Discharge address line 1',
    dischargeAddressLine2: 'Discharge address line 2',
    dischargeAddressLine3: 'Discharge address line 3',
    dischargeAddressLine4: 'Discharge address line 4',
    dischargeAddressLine5: 'Discharge address line 5',
    dischargePostcode: 'W1A 1AA',
    dischargeTelephoneNumber: '01234567890',

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

describe('NOD1042', () => {

    it('Create test data - probation offenders', () => {

        oasys.login(oasys.Users.probHeadPdu)

        for (let set = 1; set <= 2; set++) {
            const offenderSet = set == 1 ? offenders.offendersSet1 : offenders.offendersSet2
            for (let i = 0; i < 6; i++) {
                const offender = JSON.parse(JSON.stringify(baseOffenderProb)) as OffenderDef
                offender.surname = offenderSet[i].surname
                offender.forename1 = offenderSet[i].forename
                oasys.Offender.createProb(offender, 'offender')
            }
        }
        oasys.logout()
    })

    it('Create test data - probation SAN offender', () => {

        oasys.login(oasys.Users.probSanHeadPdu)

        for (let set = 1; set <= 2; set++) {
            const offenderSet = set == 1 ? offenders.offendersSet1 : offenders.offendersSet2
            const offender = JSON.parse(JSON.stringify(baseOffenderProb)) as OffenderDef
            offender.surname = offenderSet[6].surname
            offender.forename1 = offenderSet[6].forename
            oasys.Offender.createProb(offender, 'offender')
        }
        oasys.logout()
    })

    it('Create test data - prison offenders', () => {

        oasys.login(oasys.Users.prisHomds)

        for (let set = 1; set <= 2; set++) {
            const offenderSet = set == 1 ? offenders.offendersSet1 : offenders.offendersSet2
            for (let i = 7; i < 13; i++) {
                const offender = JSON.parse(JSON.stringify(baseOffenderPris)) as OffenderDef
                offender.surname = offenderSet[i].surname
                offender.forename1 = offenderSet[i].forename
                oasys.Offender.createPris(offender, 'offender')
            }
        }
        oasys.logout()
    })

    it('Create test data - prison SAN offender', () => {


        oasys.login(oasys.Users.prisSanHomds)

        for (let set = 1; set <= 2; set++) {
            const offenderSet = set == 1 ? offenders.offendersSet1 : offenders.offendersSet2
            const offender = JSON.parse(JSON.stringify(baseOffenderPris)) as OffenderDef
            offender.surname = offenderSet[13].surname
            offender.forename1 = offenderSet[13].forename
            oasys.Offender.createPris(offender, 'offender')
        }
        oasys.logout()
    })

})
