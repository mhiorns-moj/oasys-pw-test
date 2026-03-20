import * as db from '../data/oasysDb'
import { OasysDateTime } from 'oasys'
import { DbOffenderWithAssessments, DbAssessment, DbVictim, DbOffence, DbRsr, DbSection, DbAction, DbObjective, DbBspObjective, DbNeed } from './dbClasses'
import { QaData } from '../data/qaData'

let versionTable: string[][] = null

/**
 * Gets all data for a given offender CRN from the database required for regression testing the APIs.
 * 
 * Returns a `DbOffenderWithAssessments` object including some offender details plus all assessment data needed to validate the APIs.
 * 
 * This function is called via cypress.config.ts using `cy.task('getOffenderWithAssessments', crn)`
 */
export async function getOffenderWithAssessments(crnSource: Provider, crn: string): Promise<DbOffenderWithAssessments> {

    // Database queries are (mostly) defined in the relevant class definitions

    OasysDateTime.startTimer('getOffenderWithAssessments')

    // Get offender data
    const offenderData = await db.selectData(DbOffenderWithAssessments.query(crnSource, crn))
    if (offenderData.error != null) throw new Error(offenderData.error)

    if ((offenderData.data as string[][]).length != 1) {  // No data, or multiple offenders with same CRN
        return null
    }
    let dbOffender = new DbOffenderWithAssessments(offenderData.data[0])

    // Get OASYS_SET data, then loop through assessments
    const assessmentData = await db.selectData(DbAssessment.query(dbOffender.offenderPk))
    if (assessmentData.error != null) throw new Error(assessmentData.error)
    const assessments = assessmentData.data as string[][]

    for (let a = 0; a < assessments.length; a++) {
        // Add OASYS_SET data to the return object
        let assessment = new DbAssessment(assessments[a])

        // Section data
        const sectionsData = await db.selectData(DbSection.query(assessment.assessmentPk))
        if (sectionsData.error != null) throw new Error(sectionsData.error)
        const sections = sectionsData.data as string[][]
        sections.forEach((section) => assessment.sections.push(new DbSection(section, assessment.assessmentType, assessment.assessmentVersion)))

        // Questions and answers
        const qaData = await db.selectData(DbAssessment.qaQuery(assessment.assessmentPk))
        if (qaData.error != null) throw new Error(qaData.error)
        assessment.qaData = new QaData(qaData.data as string[][])

        // Offences
        const offencesData = await db.selectData(DbOffence.query(assessment.assessmentPk))
        if (offencesData.error != null) throw new Error(offencesData.error)
        const offences = offencesData.data as string[][]

        for (let o = 0; o < offences.length; o++) {
            const offencePivotData = await db.selectData(DbOffence.pivotQuery(offences[o][0]))  // Search by offence_block_pk
            if (offencePivotData.error != null) throw new Error(offencePivotData.error)

            const offencePivot = offencePivotData.data as string[][]
            if (offencePivot.length == 0) {
                assessment.offences.push(new DbOffence(offences[o], null))
            } else {
                offencePivot.forEach((p) => {
                    assessment.offences.push(new DbOffence(offences[o], p))
                })
            }
        }

        // Victims
        const victimsData = await db.selectData(DbVictim.query(assessment.assessmentPk))
        if (victimsData.error != null) throw new Error(victimsData.error)
        const victims = victimsData.data as string[][]

        victims.forEach((victim) => {
            assessment.victims.push(new DbVictim(victim))
        })

        // Court details
        const courtData = await db.selectData(DbAssessment.courtQuery(assessment.assessmentPk))
        if (courtData.error != null) throw new Error(courtData.error)
        const court = courtData.data as string[][]
        if (court.length > 0) assessment.addCourtDetails(court[0])

        // Basic sentence plan
        const bspData = await db.selectData(DbBspObjective.query(assessment.assessmentPk))
        if (bspData.error != null) throw new Error(bspData.error)
        const bsp = bspData.data as string[][]
        bsp.forEach((obj) => { assessment.basicSentencePlan.push(new DbBspObjective(obj)) })

        // Sentence plan
        const objectivesData = await db.selectData(DbObjective.query(assessment.assessmentPk))
        if (objectivesData.error != null) throw new Error(objectivesData.error)
        const objectives = objectivesData.data as string[][]

        for (let o = 0; o < objectives.length; o++) {
            const objective = new DbObjective(objectives[o])
            const needsData = await db.selectData(DbNeed.query(objective.objectivePk))
            if (needsData.error != null) throw new Error(needsData.error)
            const needs = needsData.data as string[][]
            needs.forEach((need) => { objective.criminogenicNeeds.push(new DbNeed(need)) })

            const actionsData = await db.selectData(DbAction.query(objective.objectivePk))
            if (actionsData.error != null) throw new Error(actionsData.error)
            const actions = actionsData.data as string[][]
            actions.forEach((action) => { objective.actions.push(new DbAction(action)) })

            assessment.objectives.push(objective)
        }

        // Add the assessment to the offender
        dbOffender.assessments.push(assessment)
    }

    // Add standalone RSRs
    const rsrData = await db.selectData(DbRsr.query(dbOffender.offenderPk))
    if (rsrData.error != null) throw new Error(rsrData.error)
    const rsrs = rsrData.data as string[][]

    rsrs.forEach((rsr) => {
        dbOffender.assessments.push(new DbRsr(rsr))
    })

    // Sort by initiation date
    dbOffender.assessments.sort((a, b) => (a.initiationDate > b.initiationDate) ? 1 : ((b.initiationDate > a.initiationDate) ? -1 : 0))

    // Record time elapsed in database load
    dbOffender.dbElapsedTime = OasysDateTime.elapsedTime('getOffenderWithAssessments')
    return dbOffender
}
