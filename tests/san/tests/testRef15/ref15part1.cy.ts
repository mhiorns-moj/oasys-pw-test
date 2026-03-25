import * as oasys from 'oasys'

describe('SAN integration - test ref 15 part 1', () => {

    it('Test ref 15 part 1 - Create a 3.2 assessment', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.users.prisSanCAdm)
            await offender.searchAndSelectByPnc(offender.pnc)

            log(`Log in as a prison user who has the Case Admin role but DOES NOT have the SAN function.
                Open up the offender record.
                Create a Start Custody, layer 3, initial sentence plan.  At select Assessor select an Assessor who does have the SAN function and has the framework role 
                'Unpproved' with a default csigner who has the 'Approved Prison POM….' role.
                Now the new SAN question appears asking if they want to 'Include strengths and needs sections' which has defaulted to 'Yes' 
                Create the assessment - navigation menu does not show section 2 to 13 or the SAQ.  There is a menu option for 'Strengths and Needs'
                There is  menu option for 'Sentence Plan Service' and the 'Initial Sentence Plan' menu has ONE option below it for 'Section 5.2 to 8'
                Check the database - ensure the OASYS_SET.SAN_ASSESSMENT_LINKED_IND = 'Y'
                Check that a CreateAssessment API post was sent off with the correct details in it (the OASYS_SET_PK of the newly created record, the parameter for
                     previous PK is null, and the user ID and name are correct and the planType is INITIAL)
                With the introduction of the sentence plan service ensure that the CREATE API also now includes a parameter of 'planType' that is set to 'INITIAL'
                Check that we get a '200' response back from the API - the response contains parameters back and now includes sentence plan data
                Ensure that we have NOT stored down any SAN version number OR Sentence Plan version number on the OASYS_SET record`)

            await assessment.createPris({ purposeOfAssessment: 'Start custody', selectAssessor: oasys.users.prisSanUnappr.lovLookup })
            await san.checkLayer3Menu(true)

            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')
            cy.get<number>('@result').then((pk) => {
                await san.checkSanCreateAssessmentCall(pk, null, oasys.users.prisSanCAdm, oasys.users.prisonSanCode, 'INITIAL')
                await san.checkSanGetAssessmentCall(pk, 0)

                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    CLONED_FROM_PREV_OASYS_SAN_PK: null,
                    SAN_ASSESSMENT_VERSION_NO: null,
                    SSP_PLAN_VERSION_NO: null,
                })

                log(`Complete sections Case ID and Section 1 with a non-sexual offence`)

                new oasys.Pages.Assessment.OffendingInformation().goto().count.setValue(1)
                const predictors = new oasys.Pages.Assessment.Predictors().goto()
                predictors.dateFirstSanction.setValue({ years: -3 })
                predictors.o1_32.setValue(2)
                predictors.o1_40.setValue(0)
                predictors.o1_29.setValue({ months: -6 })
                predictors.o1_30.setValue('No')
                predictors.o1_38.setValue({ months: -1 })
                predictors.markCompleteAndCheck()

                oasys.logout()

            })
        })
    })
})
