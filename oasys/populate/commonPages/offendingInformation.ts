import * as oasys from 'oasys'

/** 
 * Minimal population to complete the page, assuming offence and sentence details have already been set via the stub.
 */
export function minimal() {

    const page = new oasys.Pages.Assessment.OffendingInformation().goto(true)
    page.count.setValue(1)
}

/** 
 * This attempts to populate everything on the page, but might need tweaking in some scenarios.  The significant parameters are:
 *  - provider (pris or prob)
 *  - maxStrings (bool) - to enter everything to maximum length
 */
export function fullyPopulated(params: PopulateAssessmentParams) {

    const page = new oasys.Pages.Assessment.OffendingInformation().goto(true)
    page.count.setValue(5)
    page.offenceDate.setValue({ months: -6 })
    page.resentencingForBreach.setValue('Yes')
    page.orderAmended.setValue('Yes')
    page.dateAmended.setValue({ months: -1 })
    if (params.provider != 'pris') {
        page.sentence.setValue(params.maxStrings ? 'Services Suspended Sentence Order' : 'Fine')
    }
    page.disqualificationOrder.setValue('Yes')
    if (params.provider != 'pris') {
        page.custodyInMonths.setValue('6')
        page.sentenceLengthInDays.setValue('365')
    }
    page.communityPunishmentHours.setValue('200')
    if (params.provider != 'pris') {
        page.sentenceDate.setValue({ months: -2 })
        page.courtProximity.setValue('Local Court')
        page.courtName.setValue('Bedford County Court')
    }

    if (params.maxStrings && params.provider != 'pris') {
        page.orderLengthMonths.setValue('24')
        page.unpaidWork.setValue('Yes')
        page.unpaidWorkHours.setValue('200')
        page.activity.setValue('Yes')
        page.victimReparation.setValue('Yes')
        page.education.setValue('Yes')
        page.financial.setValue('Yes')
        page.accommodation.setValue('Yes')
        page.other.setValue('Yes')
        page.otherDescription.setValue(oasys.oasysString(4000))
        page.accreditedProgramme.setValue('Yes')
        page.accreditedProgramme1.setValue('Cognitive Self Change Programme (CSCP) Blocks 1-5')
        page.accreditedProgramme2.setValue('Sex Offender Treatment Programme (SOTP)')
        page.accreditedProgramme3.setValue(`Programme for Reducing Individual's Substance Misuse (PRISM)`)
        page.accreditedProgramme4.setValue('One to One Programme')
        page.prohibitedActivity.setValue('Yes')
        page.prohibitedActivity1.setValue(oasys.oasysString(4000))
        page.prohibitedActivity2.setValue(oasys.oasysString(4000))
        page.prohibitedActivity3.setValue(oasys.oasysString(4000))
        page.curfew.setValue('Yes')
        page.exclusion.setValue('Yes')
        page.residence.setValue('Yes')
        page.mentalHealthTreatment.setValue('Yes')
        page.drugRehabilitation.setValue('Yes')
        page.alcoholTreatment.setValue('Yes')
        page.supervision.setValue('Yes')
        page.supervisionMonths.setValue('36')
        page.attendanceCentre.setValue('Yes')
        page.electronicMonitoring.setValue('Yes')
        page.drugTesting.setValue('Yes')
        page.intoxicatingSubstanceTreatment.setValue('Yes')
    } else {
        page.additionalRequirements1.setValue('Citizenship')
        page.additionalRequirements2.setValue('Other')
        page.additionalRequirements3.setValue('Electronic Monitoring')
        page.additionalRequirements4.setValue('Participate in specified activities')
        page.additionalRequirements5.setValue('Residential - other')
        page.specificInterventions1.setValue('Alcohol Related Violence Programme')
        page.specificInterventions2.setValue('Guided Skills Learning')
        page.specificInterventions3.setValue('Accommodation advocacy')
        page.sentenceAdditionalLicenceConditions.setValue(params.maxStrings ? oasys.oasysString(4000) : 'Additional licence conditions')
    }

    page.dateOfActualRelease.setValue({ years: 3 })
    page.typeOfRelease.setValue('ACR')
    page.anyLicenceRequirements.setValue(params.maxStrings ? oasys.oasysString(4000) : 'Some licence requirements')
    page.homeDetentionCurfewDate.setValue({ months: 12 })
    page.automaticReleaseDate.setValue({ months: 13 })
    page.conditionalReleaseDate.setValue({ months: 14 })
    page.paroleEligibilityDate.setValue({ months: 15 })
    page.nonParoleDate.setValue({ months: 16 })
    page.licenceExpiryDate.setValue({ months: 17 })
    page.resettlementLicenceEligibilityDate.setValue({ months: 19 })
    page.sentenceExpiryDate.setValue({ months: 20 })
    page.recallDate.setValue({ months: 21 })
    page.postSentenceSupervisionExpiryDate.setValue({ months: 22 })
    page.detainedUnderImmigrationAct.setValue('Yes')
    page.recommendedForDeportation.setValue('Yes')
    page.furtherChargesPending.setValue('Yes')
    page.furtherChargesPendingDetails.setValue(params.maxStrings ? oasys.oasysString(4000) : 'There are some further charges')
    if (params.provider != 'pris') {
        page.appealPending.setValue('Yes')
        page.appealPendingDetails.setValue(params.maxStrings ? oasys.oasysString(4000) : 'The offender might appeal')
    }
}
