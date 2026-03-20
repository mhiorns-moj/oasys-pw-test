import * as oasys from 'oasys'
import * as testData from '../../data/testRef16'

describe('SAN integration - test ref 16 part 2', () => {

    it('Test ref 16 part 2 - Edit the assessment', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)


            cy.log(`Log out and log back in as the newly assigned assessor.
                        Open up the Offender record and open the WIP OASys-SAN assessment - ensure the assessment is in full edit mode
                        Navigate to the RoSH screening Section 1 and set R1.2 'Aggravated Burglary' Previous column to 'Yes' - this will invoke a full analysis`)

            oasys.login(oasys.Users.prisSanPom)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            oasys.Assessment.openLatest()
            oasys.San.gotoSan('Accommodation', 'information')
            oasys.San.checkSanEditMode(true)
            oasys.San.returnToOASys()

            new oasys.Pages.Rosh.RoshScreeningSection1().goto().r1_2_6P.setValue('Yes')

            cy.log(`Navigate to the Summary Sheet screen 
                The Learning Screening Tool states 'Not enough items have been scored to identify whether this individual has a learning disability and/or learning challenges.'
                The OPD section states 'It was not possible to identify whether this individual has met criteria for the OPD pathway as not enough items were answered.'`)

            const summarySheet = new oasys.Pages.Assessment.SummarySheet().goto()
            summarySheet.learningScreeningTool.checkValue('Not enough items have been scored to identify whether this individual has a learning disability and/or learning challenges.', true)
            summarySheet.opd.checkValue('It was not possible to identify whether this individual has met criteria for the OPD pathway as not enough items were answered.', true)

            cy.log(`Navigate back to Section 1 Offending Information and complete the screen selecting a 'SEXUAL' offence
                Navigate to the RoSH Summary screen and set 10.6 PUBLIC risk to 'High'
                Navigate back to Section 1 Predictors screen and answer the questions making sure 1.8 works out to be >18`)

            new oasys.Pages.Assessment.OffendingInformation().goto().setValues({
                offence: '019', subcode: '08', count: '1', offenceDate: { months: -4 }
            })
            oasys.Populate.RoshPages.RoshSummary.specificRiskLevel('Low')
            const roshSummary = new oasys.Pages.Rosh.RoshSummary()
            roshSummary.r10_6PublicCommunity.setValue('High')
            roshSummary.r10_6PublicCustody.setValue('High')

            const predictors = new oasys.Pages.Assessment.Predictors().goto(true)
            predictors.dateFirstSanction.setValue({ years: -3 })
            predictors.o1_32.setValue(1)
            predictors.o1_40.setValue(1)
            predictors.o1_29.setValue({ months: -6 })
            predictors.o1_44.setValue('No')
            predictors.o1_33.setValue({ months: -6 })
            predictors.o1_34.setValue(0)
            predictors.o1_45.setValue(0)
            predictors.o1_46.setValue(0)
            predictors.o1_37.setValue(0)
            predictors.o1_38.setValue({ months: -1 })

            cy.log(`Navigate to the Summary Sheet screen - ensure that the OPD section has changed to 'This individual does not meet the criteria for the OPD pathway.'
                and the screen override field has defaulted to 'No'
                Now navigate out to the Strengths and Needs sections via the OASys screen`)

            summarySheet.goto().opdOverrideMessage.checkValue('This individual does not meet the criteria for the OPD pathway.', true)
            summarySheet.opdOverride.checkValue('No')
            // Workaround for uncaught javascript error in SAN
            Cypress.on('uncaught:exception', () => {
                cy.log('Cypress Exception')
                return false
            })
            oasys.San.gotoSan()

            cy.log(`In the SAN Assessment answer the following questions as defined below:	
                The following set of SAN questions are for the Learning Screening Tool:
                    In Accommodation 'What is ? current accommodation?' - select 'No accommodation'
                    In Emplyment and Education 'Select highest level of academic qualification ? has completed' - select 'Entry level…'
                    In Employment and Education 'Does ? have skills that could help them in a job or get a job?' - select 'No'
                    In Employment and Education 'Does ? have any difficulties with reading, writing or numeracy?' - select 'Some difficulties' for Reading and Numeracy and select 'No difficulties' for Writing
                    In Health and Wellbeing 'Does ? have any learning difficulties?' - select 'Yes - some learning difficulties'
                    The following set of SAN questions are for the Male OPD score:
                    In Offence Analysis 'Does ? Recognise the impact and consequences for others and the wider community' - select No
                    In Finance 'Where does ? Currently get money from' - select 'Friends or Family'
                    In Finance 'Is ? over reliant on family or friends' - select Yes
                    In Thinking, behaviour… 'Does __ show stable behaviour?' - select 'Sometimes shows stable behaviour but can show reckless or risk taking behaviours'
                    In Thinking, behaviour… 'Does __ show manipulative behaviour or a predatory lifestyle?' - select 'Some evidence that they show manipulative behaviour or act in a predatory way towards certain individuals'
                    In Thinking, behaviour… 'Does ? use violence, aggressive or controlling behaviour to get their own way?' - select 'Some evidence of using violence, aggressive or controlling behaviour to get their own way'
                    In Thinking, behaviour… 'Does __ act on impulse?' - select 'Sometimes acts on impulse which causes significant problems'
                    In Personal relationships…. 'Did ? have any childhood behavioural problems?' - select Yes`)

            oasys.San.populateSanSections('Test ref 16', testData.sanPopulation)

            cy.log(`Return back to the OASys Assessment - goes back to the 'Open Strengths and Needs' screen
                    Navigate to the Summary Sheet screen
                    Ensure that the Learning Screening Tool section has changed to 'This individual may have a learning disability and/or learning challenges. 
                    Further assessment may be needed to determine the support required. Consideration for referral for specialised assessment should be given, if appropriate.'
                    Ensure that the OPD section has changed to 'This individual meets the criteria for the OPD pathway.'  
                    Leave the assessment as WIP`)

            oasys.San.returnToOASys()
            summarySheet.goto().learningScreeningTool.checkValue(
                'This individual may have a learning disability and/or learning challenges. Further assessment may be needed to determine the support required. Consideration for referral for specialised assessment should be given, if appropriate.',
                true)

            summarySheet.goto().opd.checkValue('This individual meets the criteria for the OPD pathway.', true)

            oasys.logout()
        })
    })
})
