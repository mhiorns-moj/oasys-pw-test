import * as oasys from 'lib'
import { sets, getSurname } from '../parameters'

describe('NOD1045 probation non-SAN completed assessments', () => {

    it('Test ref 23', () => { // MALE Offender whose last assessment is a COMPLETED ROSHA L1 V2 assessment 

        oasys.login(oasys.Users.probHeadPdu)

        for (let set = 1; set <= sets; set++) {

            oasys.Offender.searchAndSelectByName(getSurname(set), 'TestRef23')
            oasys.Assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })

            const predictors = new oasys.Pages.Assessment.RoshaPredictors()
            predictors.goto(true)
            predictors.dateFirstSanction.setValue({ years: -2 })
            predictors.o1_32.setValue('5')
            predictors.o1_40.setValue('0')
            predictors.o1_29.setValue({ weeks: -1 })
            predictors.o1_30.setValue('No')
            predictors.o1_38.setValue({ months: 18 })
            predictors.o1_39.setValue('No')

            oasys.Populate.Rosh.screeningNoRisks()

            oasys.Assessment.signAndLock({ expectRsrScore: true })
        }
    })

})
