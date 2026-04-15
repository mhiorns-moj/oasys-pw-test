import Decimal from 'decimal.js'

import { ospCoefficients } from './data/ospCoefficients'
import { OutputParameters, ScoreBand, TestCaseParameters } from './types'
import { calculateProbability, calculateBand, probabilityToPercentage } from './calculateScore'
import { reportScores, addOutputParameter } from './createOutput'
import { checkMissingQuestions } from './missingQuestions'

export function ospRsrCalc(params: TestCaseParameters, outputParams: OutputParameters) {

    // Calculate OSP-C, OSP-I and RSR

    let percentageOspC = new Decimal(0)
    let percentageOspI = new Decimal(0)

    // OSP-C
    if (params.female && params.ONE_POINT_THIRTY == 'Y') {
        percentageOspC = probabilityToPercentage(ospCoefficients.osp_ddc.ospFemale)
    }

    const missingOspC = checkMissingQuestions('osp_c', params)
    if (missingOspC.status != 'Y') {
        reportScores(outputParams, 'osp_c', null, missingOspC.status == 'A' ? new Decimal(0) : null, null, missingOspC.status, missingOspC.count, missingOspC.errorText)
    } else {
        const contactAdultScore = params.CONTACT_ADULT_SANCTIONS == 0 ? 0 : params.CONTACT_ADULT_SANCTIONS == 1 ? 5 : params.CONTACT_ADULT_SANCTIONS == 2 ? 10 : 15
        const contactChildScore = params.CONTACT_CHILD_SANCTIONS == 0 ? 0 : params.CONTACT_CHILD_SANCTIONS == 1 ? 3 : params.CONTACT_CHILD_SANCTIONS == 2 ? 6 : 9
        const nonContactScore = params.PARAPHILIA_SANCTIONS == 0 ? 0 : params.PARAPHILIA_SANCTIONS == 1 ? 2 : params.PARAPHILIA_SANCTIONS == 2 ? 4 : 6
        const ageScore = params.age < 18 ? 14 : params.age > 59 ? 0 : Math.ceil((60 - params.age) / 3)
        const ageAtLastSanctionSexualScore = params.ageAtLastSanctionSexual > 17 ? 10 : params.ageAtLastSanctionSexual > 15 ? 5 : 0
        const previousHistoryScore = params.TOTAL_SANCTIONS_COUNT <= 1 ? 0 : 6
        const contactWithStrangerScore = params.STRANGER_VICTIM == 'Y' ? 4 : 0

        const totalScore = contactAdultScore + contactChildScore + nonContactScore + ageScore + ageAtLastSanctionSexualScore + previousHistoryScore + contactWithStrangerScore

        const c = ospCoefficients.osp_ddc
        const zScore = c.OSPCIntercept.add(c.OSPCFactor.times(totalScore))

        percentageOspC = probabilityToPercentage(calculateProbability(zScore))
        const band = ospBand(params, totalScore)

        addOutputParameter(outputParams, 'osp_c', 'riskReduction', band.reduced)
        reportScores(outputParams, 'osp_c', new Decimal(totalScore), percentageOspC, band.band, 'Y', 0, `''`)
    }

    // OSP-I
    const missingOspI = checkMissingQuestions('osp_i', params)
    if (missingOspI.status != 'Y') {
        reportScores(outputParams, 'osp_i', null, missingOspI.status == 'A' ? new Decimal(0) : null, null, missingOspI.status, missingOspI.count, missingOspI.errorText)
    } else {
        const c = ospCoefficients.osp_iic
        const noSanctionsSexualOffences = params.CONTACT_ADULT_SANCTIONS + params.INDECENT_IMAGE_SANCTIONS +
            params.CONTACT_CHILD_SANCTIONS + params.PARAPHILIA_SANCTIONS == 0
        const twoPlusIIOC = params.INDECENT_IMAGE_SANCTIONS > 1
        const oneIIOC = params.INDECENT_IMAGE_SANCTIONS == 1
        const twoPlusChildContact = params.CONTACT_CHILD_SANCTIONS > 1
        const oneChildContact = params.CONTACT_CHILD_SANCTIONS == 1

        const probabilityOspI = (params.female ? c.OSPIFemale : noSanctionsSexualOffences ? c.OSPINoSanctions : twoPlusIIOC ? c.OSPITwoPlusIIOC :
            oneIIOC ? c.OSPIOneIIOC : twoPlusChildContact ? c.OSPITwoPlusChildContact : oneChildContact ? c.OSPIOneChildContact : c.OSPIOthers)

        const band: ScoreBand = params.female || noSanctionsSexualOffences ? 'N/A' : twoPlusIIOC ? 'High' : oneIIOC ? 'Medium' : 'Low'
        percentageOspI = probabilityToPercentage(probabilityOspI)

        reportScores(outputParams, 'osp_i', null, percentageOspI, band, 'Y', 0, `''`)
    }


    // RSR
    const rsrMissingStatic = checkMissingQuestions('rsr', params, false)
    const rsrMissingDynamic = checkMissingQuestions('rsr', params, true)

    const reportedMissing = params.STATIC_CALC == 'Y' ? rsrMissingStatic : rsrMissingDynamic

    // Both failed, report the error with no scores
    if (rsrMissingStatic.status == 'E') {
        reportScores(outputParams, 'rsr', null, null, null, 'E', reportedMissing.count, reportedMissing.errorText)
        if (rsrMissingStatic.count != 0) {
            addOutputParameter(outputParams, 'rsr', 'dynamic', outputParams.SNSV_CALCULATED_DYNAMIC == 'Y' ? 'Y' : 'N')
        }
    } else {
        // Otherwise, report the score, with errors depending on what type of score was requested
        let percentageRsr = outputParams.SNSV_CALCULATED_DYNAMIC == 'Y' ? outputParams.SNSV_PERCENTAGE_DYNAMIC : outputParams.SNSV_PERCENTAGE_STATIC
        percentageRsr = percentageRsr?.add(percentageOspC).add(percentageOspI) ?? null

        const band = calculateBand('rsr', percentageRsr)

        reportScores(outputParams, 'rsr', null, percentageRsr, band, 'Y', reportedMissing.count, reportedMissing.errorText)
        addOutputParameter(outputParams, 'rsr', 'dynamic', outputParams.SNSV_CALCULATED_DYNAMIC == 'Y' ? 'Y' : 'N')
    }
}

function ospBand(params: TestCaseParameters, totalScore: number): { band: ScoreBand, reduced: 'Y' | 'N' } {

    const band: ScoreBand = totalScore < 22 ? 'Low' : totalScore < 30 ? 'Medium' : totalScore < 36 ? 'High' : 'Very High'

    if (band == 'Low' || !params.male || params.CUSTODY_IND == 'Y' || !params.out5Years || params.offenceInLast5Years || params.sexualOffenceInLast5Years) {
        return { band: band, reduced: 'N' }
    }

    return { band: band == 'Very High' ? 'High' : band == 'High' ? 'Medium' : 'Low', reduced: 'Y' }
}

