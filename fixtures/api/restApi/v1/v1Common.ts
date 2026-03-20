import * as common from '../common'
import * as dbClasses from '../dbClasses'

/**
 * Base class for version 1 endpoints (based on the overall common endpoint base class), which includes the V1 timeline and V1 base assessment.
 * 
 * Other V1 endpoints extend the assessment class as required.
 */
export class V1EndpointResponse extends common.EndpointResponse {

    timeline: TimelineAssessment[] = []
    assessments: V1AssessmentCommon[] = []

    // # properties are hidden so are ignored when comparing the API response
    #lastCompleteIndex = -1
    #lastWIPIndex = -1
    #lastSignedIndex = -1
    #lastPartCompSignedIndex = -1
    #lastPartCompUnsignedIndex = -1
    #latestSignLockDate: string = null
    #latestAssessmentIndex = -1
    #latestCompleteDate: string = null


    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    // Create the timeline, and populate the index properties for use in the assessment
    addTimeline(dbAssessments: dbClasses.DbAssessmentOrRsr[]) {

        for (let i = 0; i < dbAssessments.length; i++) {
            this.timeline.push(new TimelineAssessment(dbAssessments[i]))

            if (dbAssessments[i].status == 'COMPLETE' && (this.#latestCompleteDate == null || dbAssessments[i].completedDate > this.#latestCompleteDate)) {
                this.#lastCompleteIndex = i
                this.#latestCompleteDate = dbAssessments[i].completedDate
            }
            if (['OPEN', 'AWAITING_PSR', 'AWAITING_SBC'].includes(dbAssessments[i].status)) this.#lastWIPIndex = i
            if (['SIGNED', 'AWAITING_PSR', 'AWAITING_SBC'].includes(dbAssessments[i].status)) {
                this.#lastSignedIndex = i
                this.#latestSignLockDate = dbAssessments[i].signedDate
            }
            if (dbAssessments[i].status == 'LOCKED_INCOMPLETE' && dbAssessments[i].signedDate != null) this.#lastPartCompSignedIndex = i
            if (dbAssessments[i].status == 'LOCKED_INCOMPLETE' && dbAssessments[i].signedDate == null) this.#lastPartCompUnsignedIndex = i
        }
        this.#latestAssessmentIndex = this.timeline.length - 1
    }

    // Add an assessment object, using a class specified as assessmentType - always an extension of the base V1 assessment class defined below
    // May be either last assessment, or last complete assessment
    addLatestAssessment(dbAssessments: dbClasses.DbAssessmentOrRsr[], assessmentType, complete: boolean): number {

        const assessmentIndex = complete ? this.#lastCompleteIndex : this.#latestAssessmentIndex
        if (assessmentIndex >= 0) {
            // can't pass private properties as parameters so have to copy them first
            const lastWIPIndex = this.#lastWIPIndex
            const lastSignedIndex = this.#lastSignedIndex
            const lastPartCompSignedIndex = this.#lastPartCompSignedIndex
            const lastPartCompUnsignedIndex = this.#lastPartCompUnsignedIndex
            const latestSignLockDate = this.#latestSignLockDate
            const latestCompleteDate = this.#latestCompleteDate
            const lastCompleteIndex = this.#lastCompleteIndex

            this.assessments.push(
                new assessmentType(
                    dbAssessments[assessmentIndex],
                    this.timeline,
                    assessmentIndex,
                    lastWIPIndex,
                    lastSignedIndex,
                    lastPartCompSignedIndex,
                    lastPartCompUnsignedIndex,
                    latestSignLockDate,
                    latestCompleteDate,
                    lastCompleteIndex
                )
            )
        }
        return assessmentIndex
    }

    // Add all available assessment (or filtered for complete assessments only)
    addAllAssessments(dbAssessments: dbClasses.DbAssessmentOrRsr[], assessmentType, complete: boolean) {

        // can't pass private properties as parameters so have to copy them first
        const lastWIPIndex = this.#lastWIPIndex
        const lastSignedIndex = this.#lastSignedIndex
        const lastPartCompSignedIndex = this.#lastPartCompSignedIndex
        const lastPartCompUnsignedIndex = this.#lastPartCompUnsignedIndex
        const latestSignLockDate = this.#latestSignLockDate
        const latestCompleteDate = this.#latestCompleteDate
        const lastCompleteIndex = this.#lastCompleteIndex

        for (let i = 0; i < dbAssessments.length; i++) {

            if (!complete || dbAssessments[i].status == 'COMPLETE') {
                this.assessments.push(
                    new assessmentType(
                        dbAssessments[i],
                        this.timeline,
                        i,
                        lastWIPIndex,
                        lastSignedIndex,
                        lastPartCompSignedIndex,
                        lastPartCompUnsignedIndex,
                        latestSignLockDate,
                        latestCompleteDate,
                        lastCompleteIndex
                    )
                )
            }
        }
    }
}

export class TimelineAssessment {

    assessmentPk: number
    assessmentType: string
    assessmentVersion: number
    initiationDate: string
    status: string
    partcompStatus?: string
    completedDate: string

    constructor(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        this.assessmentPk = dbAssessment.assessmentPk
        this.assessmentType = dbAssessment.assessmentType
        if (this.assessmentType == 'STANDALONE') {
            delete this.assessmentVersion
        } else {
            this.assessmentVersion = dbAssessment.assessmentVersion
        }
        this.initiationDate = dbAssessment.initiationDate
        this.status = dbAssessment.status
        if (this.status == 'LOCKED_INCOMPLETE') {
            this.partcompStatus = (dbAssessment as dbClasses.DbAssessment).signedDate == null ? 'Unsigned' : 'Signed'
        }
        if (this.status != 'OPEN' && this.status != 'SIGNED' && this.status != 'AWAITING_PSR' && this.status != 'AWAITING_SBC') {
            this.completedDate = dbAssessment.completedDate
        }
    }
}

// Base class for version 1 assessments
export class V1AssessmentCommon {

    assessmentPk: number
    assessmentType: string
    assessmentVersion: number
    dateCompleted: string
    assessorSignedDate: string
    initiationDate: string
    assessmentStatus: string
    superStatus: string
    laterWIPAssessmentExists: boolean
    latestWIPDate: string
    laterSignLockAssessmentExists: boolean
    latestSignLockDate: string
    laterPartCompSignedAssessmentExists: boolean
    latestPartCompSignedDate: string
    laterPartCompUnsignedAssessmentExists: boolean
    latestPartCompUnsignedDate: string
    laterCompleteAssessmentExists: boolean
    latestCompleteDate: string

    constructor(
        assessment: dbClasses.DbAssessmentOrRsr,
        timeline: TimelineAssessment[],
        assessmentIndex: number,
        lastWIPIndex: number,
        lastSignedIndex: number,
        lastPartcompSignedIndex: number,
        lastPartcompUnsignedIndex: number,
        latestSignLockDate: string,
        latestCompleteDate: string,
        lastCompleteIndex: number
    ) {

        this.assessmentPk = assessment.assessmentPk
        this.assessmentType = assessment.assessmentType
        // if (this.assessmentType == 'STANDALONE') {
            // delete this.assessmentVersion
        // } else {
            this.assessmentVersion = assessment.assessmentVersion
        // }
        this.dateCompleted = assessment.completedDate
        this.assessorSignedDate = assessment.signedDate
        this.initiationDate = assessment.initiationDate
        this.assessmentStatus = assessment.status
        this.superStatus = common.getSuperStatus(assessment.status)
        if (this.superStatus == 'PARTCOMP') {
            this.superStatus = this.assessorSignedDate == null ? 'PARTCOMP_UNSIGNED' : 'PARTCOMP_SIGNED'
        }
        this.laterWIPAssessmentExists = lastWIPIndex > assessmentIndex
        this.latestWIPDate = lastWIPIndex > -1 ? timeline[lastWIPIndex].initiationDate : null
        this.laterSignLockAssessmentExists = lastSignedIndex > assessmentIndex
        this.latestSignLockDate = latestSignLockDate
        this.laterPartCompSignedAssessmentExists = lastPartcompSignedIndex > assessmentIndex
        this.latestPartCompSignedDate = lastPartcompSignedIndex > -1 ? timeline[lastPartcompSignedIndex].initiationDate : null
        this.laterPartCompUnsignedAssessmentExists = lastPartcompUnsignedIndex > assessmentIndex
        this.latestPartCompUnsignedDate = lastPartcompUnsignedIndex > -1 ? timeline[lastPartcompUnsignedIndex].initiationDate : null

        let assessmentDate = this.dateCompleted == null ? this.initiationDate : this.dateCompleted
        this.laterCompleteAssessmentExists = latestCompleteDate != null && (assessmentDate < latestCompleteDate)
        this.latestCompleteDate = latestCompleteDate
    }
}

