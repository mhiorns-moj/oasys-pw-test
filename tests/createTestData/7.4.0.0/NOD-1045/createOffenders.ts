import * as oasys from 'lib'

import { baseOffenderProb, baseOffenderPris, probNonSanOffenders, probSanOffenders, prisonOffenders, sets, getSurname } from './parameters'

let crnsForIom: string[] = []

describe('NOD1045 offenders', () => {


    for (let set = 1; set <= sets; set++) {

        it(`Create test data - probation offenders set ${set}`, () => {


            oasys.login(oasys.Users.probHeadPdu)

            probNonSanOffenders.forEach((o) => {
                const offender = JSON.parse(JSON.stringify(baseOffenderProb)) as OffenderDef
                offender.surname = getSurname(set)
                offender.forename1 = o.forename
                offender.gender = o.gender
                if (o.offence) offender.event.offences['offence'] = o.offence
                if (o.subcode) offender.event.offences['subcode'] = o.subcode

                oasys.Offender.createProb(offender, 'offender')

                if (o.forename == probNonSanOffenders[0].forename) {    // First one needs IOM stub, so grab the crn

                    cy.get<OffenderDef>('@offender').then((createdOffender) => {
                        crnsForIom.push(createdOffender.probationCrn)
                    })
                }
            })
            oasys.logout()

        })
    }

    for (let set = 1; set <= sets; set++) {

        it(`Create test data - probation SAN offender set ${set}`, () => {

            oasys.login(oasys.Users.probSanHeadPdu)

            probSanOffenders.forEach((o) => {
                const offender = JSON.parse(JSON.stringify(baseOffenderProb)) as OffenderDef
                offender.surname = getSurname(set, true)
                offender.forename1 = o.forename
                offender.gender = o.gender
                if (o.offence) offender.event.offences['offence'] = o.offence
                if (o.subcode) offender.event.offences['subcode'] = o.subcode

                oasys.Offender.createProb(offender, 'offender')
            })
            oasys.logout()
        })
    }

    for (let set = 1; set <= sets; set++) {

        it(`Create test data - prison offenders set ${set}`, () => {

            oasys.login(oasys.Users.prisHomds)

            prisonOffenders.forEach((o) => {
                const offender = JSON.parse(JSON.stringify(baseOffenderPris)) as OffenderDef
                offender.surname = getSurname(set)
                offender.forename1 = o.forename
                offender.gender = o.gender
                if (o.offence) offender.event.offences['offence'] = o.offence
                if (o.subcode) offender.event.offences['subcode'] = o.subcode

                oasys.Offender.createPris(offender, 'offender')
            })
            oasys.logout()

        })
    }


    it('Add offenders to IOM stub', () => {
        crnsForIom.forEach((crnForIom) => {
            oasys.Offender.createIomStub(crnForIom, 'N', 1, 'OK', 'Y')
        })
    })

})
