import * as oasys from 'oasys'
import * as testData from '../../data/mergeTest'

describe('SAN integration - tests 39-40', () => {
    /**
     * Merge - where BOTH offenders have OASys-SAN assessments
     * Merge two offenders where BOTH of the offenders have OASys-SAN assessments - check it posts the correct MERGE API
     * 
     * De-merge - where BOTH offenders have OASys-SAN assessments
     * Using the offender who was previously merged in this situation, create and complete a new OASys-SAN assessment.
     * The carry out a De-merge - check it posts the correct MERGE API
     */

    it('Merge tests part 1 - create and complete 3.2 assessment on offender 1', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender1').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            await oasys.login(oasys.users.probSanHeadPdu)  // Senior user so no countersigning for this test
            await offender.searchAndSelectByPnc(offender.pnc)

            // Create assessment
            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            // Complete section 1
            await assessment.offendingInformation.goto()
            offendingInformation.offence.setValue('030')
            offendingInformation.subcode.setValue('01')
            offendingInformation.count.setValue(1)
            offendingInformation.offenceDate.setValue({ months: -6 })
            offendingInformation.sentence.setValue('Fine')
            offendingInformation.sentenceDate.setValue({ months: -1 })

            await assessment.predictors.goto(true)
            await assessment.predictors.dateFirstSanction.setValue({ years: -2 })
            await assessment.predictors.o1_32.setValue(2)
            await assessment.predictors.o1_40.setValue(0)
            await assessment.predictors.o1_29.setValue({ months: -1 })
            await assessment.predictors.o1_30.setValue('No')
            await assessment.predictors.o1_38.setValue({})

            await san.gotoSan()
            await san.populateSanSections('Merge test', testData.sanPopulation)
            await san.returnToOASys()

            await risk.screeningNoRisks(true)

            // Sign and lock
            // Complete SP, then sign and lock
            await sentencePlan.populateMinimal()

            new oasys.Pages.SentencePlan.SentencePlanService().goto()
            await signing.signAndLock()
            await oasys.logout()
        })
    })
})
