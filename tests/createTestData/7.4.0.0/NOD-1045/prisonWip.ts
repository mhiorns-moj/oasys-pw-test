import * as oasys from 'lib'
import { sets, getSurname } from './parameters'

describe('NOD1045 prison WIP assessments', () => {

    it('Test ref 12', () => { // MALE Offender with a WIP L3 V1 Start Custody assessment with an Initial SP

        oasys.login(oasys.Users.prisHomds)

        for (let set = 1; set <= sets; set++) {

            oasys.Offender.searchAndSelectByName(getSurname(set), 'TestRef12')
            oasys.Assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)' })

            oasys.Nav.clickButton('Close')

        }
    })


    it('Test ref 13', () => { // MALE Offender with a WIP L3 V1 Review assessment with a Review SP

        oasys.login(oasys.Users.prisHomds)

        for (let set = 1; set <= sets; set++) {

            oasys.Offender.searchAndSelectByName(getSurname(set), 'TestRef13')
            oasys.Assessment.createPris({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', sentencePlanType: 'Review' })

            oasys.Nav.clickButton('Close')

        }
    })

})
