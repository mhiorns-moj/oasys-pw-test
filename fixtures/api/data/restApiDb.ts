import { OasysDb } from 'fixtures'
import { DbOffenderWithAssessments, DbAssessment, DbVictim, DbOffence, DbRsr, DbSection, DbAction, DbObjective, DbBspObjective, DbNeed } from './dbClasses'
import { QaData } from './qaData'


/**
 * Gets all data for a given offender CRN from the database required for regression testing the APIs.
 * 
 * Returns a `DbOffenderWithAssessments` object including some offender details plus all assessment data needed to validate the APIs.
 * 
 * This function is called via cypress.config.ts using `cy.task('getOffenderWithAssessments', crn)`
 */
export async function getOffenderWithAssessments(crnSource: Provider, crn: string): Promise<DbOffenderWithAssessments> {

    // Database queries are (mostly) defined in the relevant class definitions

    const oasysDb = new OasysDb()
    oasysDateTime.startTimer('getOffenderWithAssessments')

    // Get offender data
    const offenderData = await oasysDb.getData(DbOffenderWithAssessments.query(crnSource, crn))
    if ((offenderData).length != 1) {  // No data, or multiple offenders with same CRN
        return null
    }
    let dbOffender = new DbOffenderWithAssessments(offenderData[0])

    // Get OASYS_SET data, then loop through assessments
    const assessments = await oasysDb.getData(DbAssessment.query(dbOffender.offenderPk))

    for (let a = 0; a < assessments.length; a++) {
        // Add OASYS_SET data to the return object
        let assessment = new DbAssessment(assessments[a])

        // Section data
        const sections = await oasysDb.getData(DbSection.query(assessment.assessmentPk))
        sections.forEach((section) => assessment.sections.push(new DbSection(section, assessment.assessmentType, assessment.assessmentVersion)))

        // Questions and answers
        const qaData = await oasysDb.getData(DbAssessment.qaQuery(assessment.assessmentPk))
        assessment.qaData = new QaData(qaData)

        // Offences
        const offences = await oasysDb.getData(DbOffence.query(assessment.assessmentPk))

        for (let o = 0; o < offences.length; o++) {
            const offencePivot = await oasysDb.getData(DbOffence.pivotQuery(offences[o][0]))  // Search by offence_block_pk

            if (offencePivot.length == 0) {
                assessment.offences.push(new DbOffence(offences[o], null))
            } else {
                offencePivot.forEach((p) => {
                    assessment.offences.push(new DbOffence(offences[o], p))
                })
            }
        }

        // Victims
        const victims = await oasysDb.getData(DbVictim.query(assessment.assessmentPk))

        victims.forEach((victim) => {
            assessment.victims.push(new DbVictim(victim))
        })

        // Court details
        const court = await oasysDb.getData(DbAssessment.courtQuery(assessment.assessmentPk))
        if (court.length > 0) assessment.addCourtDetails(court[0])

        // Basic sentence plan
        const bsp = await oasysDb.getData(DbBspObjective.query(assessment.assessmentPk))
        bsp.forEach((obj) => { assessment.basicSentencePlan.push(new DbBspObjective(obj)) })

        // Sentence plan
        const objectives = await oasysDb.getData(DbObjective.query(assessment.assessmentPk))

        for (let o = 0; o < objectives.length; o++) {
            const objective = new DbObjective(objectives[o])
            const needs = await oasysDb.getData(DbNeed.query(objective.objectivePk))
            needs.forEach((need) => { objective.criminogenicNeeds.push(new DbNeed(need)) })

            const actions = await oasysDb.getData(DbAction.query(objective.objectivePk))
            actions.forEach((action) => { objective.actions.push(new DbAction(action)) })

            assessment.objectives.push(objective)
        }

        // Add the assessment to the offender
        dbOffender.assessments.push(assessment)
    }

    // Add standalone RSRs
    const rsrs = await oasysDb.getData(DbRsr.query(dbOffender.offenderPk))

    rsrs.forEach((rsr) => {
        dbOffender.assessments.push(new DbRsr(rsr))
    })

    // Sort by initiation date
    dbOffender.assessments.sort((a, b) => (a.initiationDate > b.initiationDate) ? 1 : ((b.initiationDate > a.initiationDate) ? -1 : 0))

    // Record time elapsed in database load
    dbOffender.dbElapsedTime = oasysDateTime.elapsedTime('getOffenderWithAssessments')
    return dbOffender
}
