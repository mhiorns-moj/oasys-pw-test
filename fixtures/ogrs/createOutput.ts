import { Decimal } from 'decimal.js'

import { OutputParameters, ScoreBand, ScoreStatus, ScoreType } from './types'

export function createOutputObject(): OutputParameters {

    return {
        ASSESSMENT_DATE: null,
        OGRS4G_CALCULATED: 'N',
        OGRS4G_YEAR_TWO: null,
        OGRS4G_AAEAD: null,
        OGRS4G_FEMALE: null,
        OGRS4G_OFFENCE: null,
        OGRS4G_FIRST_SANCTION: null,
        OGRS4G_SECOND_SANCTION: null,
        OGRS4G_TOTAL_SANCTIONS: null,
        OGRS4G_SECOND_SANCTION_GAP: null,
        OGRS4G_OFM: null,
        OGRS4G_COPASG: null,
        OGRS4G_COPASG_SQUARED: null,
        OGRS4G_SCORE: null,
        OGRS4G_PERCENTAGE: null,
        OGRS4G_BAND: null,
        OGRS4G_MISSING_QUESTIONS: null,
        OGRS4G_MISSING_COUNT: null,
        OGRS4V_CALCULATED: 'N',
        OGRS4V_YEAR_TWO: null,
        OGRS4V_AAEAD: null,
        OGRS4V_FEMALE: null,
        OGRS4V_OFFENCE: null,
        OGRS4V_FIRST_SANCTION: null,
        OGRS4V_SECOND_SANCTION: null,
        OGRS4V_TOTAL_SANCTIONS: null,
        OGRS4V_SECOND_SANCTION_GAP: null,
        OGRS4V_OFM: null,
        OGRS4V_COPASV: null,
        OGRS4V_NEVER_VIOLENT: null,
        OGRS4V_ONCE_VIOLENT: null,
        OGRS4V_TOT_VIOLENT_SANCTIONS: null,
        OGRS4V_COPAS_VIOLENT: null,
        OGRS4V_SCORE: null,
        OGRS4V_PERCENTAGE: null,
        OGRS4V_BAND: null,
        OGRS4V_MISSING_QUESTIONS: null,
        OGRS4V_MISSING_COUNT: null,
        SNSV_CALCULATED_STATIC: 'N',
        SNSV_YEAR_TWO_STATIC: null,
        SNSV_AAEAD_STATIC: null,
        SNSV_FEMALE_STATIC: null,
        SNSV_OFFENCE_STATIC: null,
        SNSV_FIRST_SANCTION_STATIC: null,
        SNSV_SECOND_SANCTION_STATIC: null,
        SNSV_TOTAL_SANCTIONS_STATIC: null,
        SNSV_SECOND_SANC_GAP_STATIC: null,
        SNSV_OFM_STATIC: null,
        SNSV_COPASV_STATIC: null,
        SNSV_NEVER_VIOLENT_STATIC: null,
        SNSV_ONCE_VIOLENT_STATIC: null,
        SNSV_TOT_VIOLENT_SANC_STATIC: null,
        SNSV_COPAS_VIOLENT_STATIC: null,
        SNSV_SCORE_STATIC: null,
        SNSV_PERCENTAGE_STATIC: null,
        SNSV_BAND_STATIC: null,
        SNSV_MISSING_QUESTIONS_STATIC: null,
        SNSV_MISSING_COUNT_STATIC: null,
        OGP2_CALCULATED: 'N',
        OGP2_YEAR_TWO: null,
        OGP2_AAEAD: null,
        OGP2_FEMALE: null,
        OGP2_OFFENCE: null,
        OGP2_FIRST_SANCTION: null,
        OGP2_SECOND_SANCTION: null,
        OGP2_TOTAL_SANCTIONS: null,
        OGP2_SECOND_SANCTION_GAP: null,
        OGP2_OFM: null,
        OGP2_COPASG: null,
        OGP2_COPASG_SQUARED: null,
        OGP2_SUITABLE_ACC: null,
        OGP2_UNEMPLOYED: null,
        OGP2_LIVE_IN_RELATIONSHIP: null,
        OGP2_RELATIONSHIP: null,
        OGP2_MULTIPLIC_RELATIONSHIP: null,
        OGP2_DV: null,
        OGP2_REGULAR_ACTIVITIES: null,
        OGP2_DAILY_DRUG_USER: null,
        OGP2_DRUG_MOTIVATION: null,
        OGP2_CHRONIC_DRINKER: null,
        OGP2_BINGE_DRINKER: null,
        OGP2_IMPULSIVE: null,
        OGP2_CRIMINAL_ATTITUDE: null,
        OGP2_HEROIN: null,
        OGP2_METHADONE: null,
        OGP2_OTHER_OPIATE: null,
        OGP2_CRACK: null,
        OGP2_COCAINE: null,
        OGP2_MISUSE_PRESCRIBED: null,
        OGP2_BENZODIAZEPINES: null,
        OGP2_AMPHETAMINES: null,
        OGP2_ECSTASY: null,
        OGP2_CANNABIS: null,
        OGP2_STEROIDS: null,
        OGP2_OTHER_DRUGS: null,
        OGP2_TOTAL_SCORE: null,
        OGP2_PERCENTAGE: null,
        OGP2_BAND: null,
        OGP2_MISSING_QUESTIONS: null,
        OGP2_MISSING_COUNT: null,
        OVP2_CALCULATED: 'N',
        OVP2_YEAR_TWO: null,
        OVP2_AAEAD: null,
        OVP2_FEMALE: null,
        OVP2_OFFENCE: null,
        OVP2_FIRST_SANCTION: null,
        OVP2_SECOND_SANCTION: null,
        OVP2_TOTAL_SANCTIONS: null,
        OVP2_SECOND_SANCTION_GAP: null,
        OVP2_OFM: null,
        OVP2_COPASV: null,
        OVP2_NEVER_VIOLENT: null,
        OVP2_ONCE_VIOLENT: null,
        OVP2_TOTAL_VIOLENT_SANCTIONS: null,
        OVP2_COPAS_VIOLENT: null,
        OVP2_SUITABLE_ACC: null,
        OVP2_UNEMPLOYED: null,
        OVP2_RELATIONSHIP: null,
        OVP2_LIVE_IN_RELATIONSHIP: null,
        OVP2_MULTIPLIC_RELATIONSHIP: null,
        OVP2_DV: null,
        OVP2_REGULAR_ACTIVITIES: null,
        OVP2_DRUG_MOTIVATION: null,
        OVP2_CHRONIC_DRINKER: null,
        OVP2_BINGE_DRINKER: null,
        OVP2_IMPULSIVE: null,
        OVP2_TEMPER: null,
        OVP2_CRIMINAL_ATTITUDE: null,
        OVP2_HEROIN: null,
        OVP2_CRACK: null,
        OVP2_COCAINE: null,
        OVP2_MISUSE_PRESCRIBED: null,
        OVP2_BENZODIAZEPINES: null,
        OVP2_AMPHETAMINES: null,
        OVP2_ECSTASY: null,
        OVP2_CANNABIS: null,
        OVP2_OTHER_OPIATE: null,
        OVP2_OTHER_DRUGS: null,
        OVP2_METHADONE: null,
        OVP2_STEROIDS: null,
        OVP2_TOTAL_SCORE: null,
        OVP2_PERCENTAGE: null,
        OVP2_BAND: null,
        OVP2_MISSING_QUESTIONS: null,
        OVP2_MISSING_COUNT: null,
        SNSV_CALCULATED_DYNAMIC: 'N',
        SNSV_YEAR_TWO_DYNAMIC: null,
        SNSV_AAEAD_DYNAMIC: null,
        SNSV_FEMALE_DYNAMIC: null,
        SNSV_OFFENCE_DYNAMIC: null,
        SNSV_FIRST_SANCTION_DYNAMIC: null,
        SNSV_SECOND_SANCTION_DYNAMIC: null,
        SNSV_TOTAL_SANCTIONS_DYNAMIC: null,
        SNSV_SECOND_SANC_GAP_DYNAMIC: null,
        SNSV_OFM_DYNAMIC: null,
        SNSV_COPASV_DYNAMIC: null,
        SNSV_NEVER_VIOLENT_DYNAMIC: null,
        SNSV_ONCE_VIOLENT_DYNAMIC: null,
        SNSV_TOT_VIOLENT_SANC_DYNAMIC: null,
        SNSV_COPAS_VIOLENT_DYNAMIC: null,
        SNSV_WEAPON_DYNAMIC: null,
        SNSV_SUITABLE_ACC_DYNAMIC: null,
        SNSV_UNEMPLOYED_DYNAMIC: null,
        SNSV_RELATION_QUALITY_DYNAMIC: null,
        SNSV_DV_DYNAMIC: null,
        SNSV_CHRONIC_DRINKER_DYNAMIC: null,
        SNSV_BINGE_DRINKER_DYNAMIC: null,
        SNSV_IMPULSIVE_DYNAMIC: null,
        SNSV_TEMPER_DYNAMIC: null,
        SNSV_CRIM_ATTITUDE_DYNAMIC: null,
        SNSV_HOMICIDE_DYNAMIC: null,
        SNSV_GBH_DYNAMIC: null,
        SNSV_KIDNAP_DYNAMIC: null,
        SNSV_FIREARMS_DYNAMIC: null,
        SNSV_ROBBERY_DYNAMIC: null,
        SNSV_AGG_BURGLARY_DYNAMIC: null,
        SNSV_WEAPONS_NOT_GUNS_DYNAMIC: null,
        SNSV_CRIM_DAMAGE_LIFE_DYNAMIC: null,
        SNSV_ARSON_DYNAMIC: null,
        SNSV_SCORE_DYNAMIC: null,
        SNSV_PERCENTAGE_DYNAMIC: null,
        SNSV_BAND_DYNAMIC: null,
        SNSV_MISSING_QUESTIONS_DYNAMIC: null,
        SNSV_MISSING_COUNT_DYNAMIC: null,
        OSP_DC_CALCULATED: 'N',
        OSP_DC_SCORE: null,
        OSP_DC_PERCENTAGE: null,
        OSP_DC_BAND: null,
        OSP_DC_RISK_REDUCTION: null,
        OSP_DC_MISSING_QUESTIONS: null,
        OSP_DC_MISSING_COUNT: 0,
        OSP_IIC_CALCULATED: 'N',
        OSP_IIC_PERCENTAGE: null,
        OSP_IIC_BAND: null,
        OSP_IIC_MISSING_QUESTIONS: null,
        OSP_IIC_MISSING_COUNT: 0,
        RSR_CALCULATED: 'N',
        RSR_DYNAMIC: null,
        RSR_PERCENTAGE: null,
        RSR_BAND: null,
        RSR_MISSING_QUESTIONS: null,
        RSR_MISSING_COUNT: null,
    }
}

export function reportScores(outputParams: OutputParameters, scoreType: ScoreType, zScore: Decimal, percentage: Decimal, band: string, status: ScoreStatus, missingCount: number, missingQuestions: string) {

    addOutputParameter(outputParams, scoreType, 'score', zScore)
    addOutputParameter(outputParams, scoreType, 'percentage',
        percentage && percentage.greaterThanOrEqualTo(100) ? new Decimal(99.99) : percentage)
    addOutputParameter(outputParams, scoreType, 'band', band)
    addOutputParameter(outputParams, scoreType, 'status', status)

    addOutputParameter(outputParams, scoreType, 'missingCount', missingCount)

    addOutputParameter(outputParams, scoreType, 'missingQuestions', missingQuestions)
}

export function addOutputParameter(outputParams: OutputParameters, scoreType: ScoreType, item: string, value: string | Decimal | number | ScoreStatus | ScoreBand) {

    const parameterName = getOutputParameterName(scoreType, item)
    switch (parameterName) {
        case 'ASSESSMENT_DATE':
            outputParams.ASSESSMENT_DATE = value as string
            break
        case 'OGRS4G_CALCULATED':
            outputParams.OGRS4G_CALCULATED = value as ScoreStatus
            break
        case 'OGRS4G_YEAR_TWO':
            outputParams.OGRS4G_YEAR_TWO = value as Decimal
            break
        case 'OGRS4G_AAEAD':
            outputParams.OGRS4G_AAEAD = value as Decimal
            break
        case 'OGRS4G_FEMALE':
            outputParams.OGRS4G_FEMALE = value as Decimal
            break
        case 'OGRS4G_OFFENCE':
            outputParams.OGRS4G_OFFENCE = value as Decimal
            break
        case 'OGRS4G_FIRST_SANCTION':
            outputParams.OGRS4G_FIRST_SANCTION = value as Decimal
            break
        case 'OGRS4G_SECOND_SANCTION':
            outputParams.OGRS4G_SECOND_SANCTION = value as Decimal
            break
        case 'OGRS4G_TOTAL_SANCTIONS':
            outputParams.OGRS4G_TOTAL_SANCTIONS = value as Decimal
            break
        case 'OGRS4G_SECOND_SANCTION_GAP':
            outputParams.OGRS4G_SECOND_SANCTION_GAP = value as Decimal
            break
        case 'OGRS4G_OFM':
            outputParams.OGRS4G_OFM = value as Decimal
            break
        case 'OGRS4G_COPASG':
            outputParams.OGRS4G_COPASG = value as Decimal
            break
        case 'OGRS4G_COPASG_SQUARED':
            outputParams.OGRS4G_COPASG_SQUARED = value as Decimal
            break
        case 'OGRS4G_SCORE':
            outputParams.OGRS4G_SCORE = value as Decimal
            break
        case 'OGRS4G_PERCENTAGE':
            outputParams.OGRS4G_PERCENTAGE = value as Decimal
            break
        case 'OGRS4G_BAND':
            outputParams.OGRS4G_BAND = value as ScoreBand
            break
        case 'OGRS4G_MISSING_QUESTIONS':
            outputParams.OGRS4G_MISSING_QUESTIONS = value as string
            break
        case 'OGRS4G_MISSING_COUNT':
            outputParams.OGRS4G_MISSING_COUNT = value as number
            break
        case 'OGRS4V_CALCULATED':
            outputParams.OGRS4V_CALCULATED = value as ScoreStatus
            break
        case 'OGRS4V_YEAR_TWO':
            outputParams.OGRS4V_YEAR_TWO = value as Decimal
            break
        case 'OGRS4V_AAEAD':
            outputParams.OGRS4V_AAEAD = value as Decimal
            break
        case 'OGRS4V_FEMALE':
            outputParams.OGRS4V_FEMALE = value as Decimal
            break
        case 'OGRS4V_OFFENCE':
            outputParams.OGRS4V_OFFENCE = value as Decimal
            break
        case 'OGRS4V_FIRST_SANCTION':
            outputParams.OGRS4V_FIRST_SANCTION = value as Decimal
            break
        case 'OGRS4V_SECOND_SANCTION':
            outputParams.OGRS4V_SECOND_SANCTION = value as Decimal
            break
        case 'OGRS4V_TOTAL_SANCTIONS':
            outputParams.OGRS4V_TOTAL_SANCTIONS = value as Decimal
            break
        case 'OGRS4V_SECOND_SANCTION_GAP':
            outputParams.OGRS4V_SECOND_SANCTION_GAP = value as Decimal
            break
        case 'OGRS4V_OFM':
            outputParams.OGRS4V_OFM = value as Decimal
            break
        case 'OGRS4V_COPASV':
            outputParams.OGRS4V_COPASV = value as Decimal
            break
        case 'OGRS4V_NEVER_VIOLENT':
            outputParams.OGRS4V_NEVER_VIOLENT = value as Decimal
            break
        case 'OGRS4V_ONCE_VIOLENT':
            outputParams.OGRS4V_ONCE_VIOLENT = value as Decimal
            break
        case 'OGRS4V_TOT_VIOLENT_SANCTIONS':
            outputParams.OGRS4V_TOT_VIOLENT_SANCTIONS = value as Decimal
            break
        case 'OGRS4V_COPAS_VIOLENT':
            outputParams.OGRS4V_COPAS_VIOLENT = value as Decimal
            break
        case 'OGRS4V_SCORE':
            outputParams.OGRS4V_SCORE = value as Decimal
            break
        case 'OGRS4V_PERCENTAGE':
            outputParams.OGRS4V_PERCENTAGE = value as Decimal
            break
        case 'OGRS4V_BAND':
            outputParams.OGRS4V_BAND = value as ScoreBand
            break
        case 'OGRS4V_MISSING_QUESTIONS':
            outputParams.OGRS4V_MISSING_QUESTIONS = value as string
            break
        case 'OGRS4V_MISSING_COUNT':
            outputParams.OGRS4V_MISSING_COUNT = value as number
            break
        case 'SNSV_CALCULATED_STATIC':
            outputParams.SNSV_CALCULATED_STATIC = value as ScoreStatus
            break
        case 'SNSV_YEAR_TWO_STATIC':
            outputParams.SNSV_YEAR_TWO_STATIC = value as Decimal
            break
        case 'SNSV_AAEAD_STATIC':
            outputParams.SNSV_AAEAD_STATIC = value as Decimal
            break
        case 'SNSV_FEMALE_STATIC':
            outputParams.SNSV_FEMALE_STATIC = value as Decimal
            break
        case 'SNSV_OFFENCE_STATIC':
            outputParams.SNSV_OFFENCE_STATIC = value as Decimal
            break
        case 'SNSV_FIRST_SANCTION_STATIC':
            outputParams.SNSV_FIRST_SANCTION_STATIC = value as Decimal
            break
        case 'SNSV_SECOND_SANCTION_STATIC':
            outputParams.SNSV_SECOND_SANCTION_STATIC = value as Decimal
            break
        case 'SNSV_TOTAL_SANCTIONS_STATIC':
            outputParams.SNSV_TOTAL_SANCTIONS_STATIC = value as Decimal
            break
        case 'SNSV_SECOND_SANC_GAP_STATIC':
            outputParams.SNSV_SECOND_SANC_GAP_STATIC = value as Decimal
            break
        case 'SNSV_OFM_STATIC':
            outputParams.SNSV_OFM_STATIC = value as Decimal
            break
        case 'SNSV_COPASV_STATIC':
            outputParams.SNSV_COPASV_STATIC = value as Decimal
            break
        case 'SNSV_NEVER_VIOLENT_STATIC':
            outputParams.SNSV_NEVER_VIOLENT_STATIC = value as Decimal
            break
        case 'SNSV_ONCE_VIOLENT_STATIC':
            outputParams.SNSV_ONCE_VIOLENT_STATIC = value as Decimal
            break
        case 'SNSV_TOT_VIOLENT_SANC_STATIC':
            outputParams.SNSV_TOT_VIOLENT_SANC_STATIC = value as Decimal
            break
        case 'SNSV_COPAS_VIOLENT_STATIC':
            outputParams.SNSV_COPAS_VIOLENT_STATIC = value as Decimal
            break
        case 'SNSV_SCORE_STATIC':
            outputParams.SNSV_SCORE_STATIC = value as Decimal
            break
        case 'SNSV_PERCENTAGE_STATIC':
            outputParams.SNSV_PERCENTAGE_STATIC = value as Decimal
            break
        case 'SNSV_BAND_STATIC':
            outputParams.SNSV_BAND_STATIC = value as ScoreBand
            break
        case 'SNSV_MISSING_QUESTIONS_STATIC':
            outputParams.SNSV_MISSING_QUESTIONS_STATIC = value as string
            break
        case 'SNSV_MISSING_COUNT_STATIC':
            outputParams.SNSV_MISSING_COUNT_STATIC = value as number
            break
        case 'OGP2_CALCULATED':
            outputParams.OGP2_CALCULATED = value as ScoreStatus
            break
        case 'OGP2_YEAR_TWO':
            outputParams.OGP2_YEAR_TWO = value as Decimal
            break
        case 'OGP2_AAEAD':
            outputParams.OGP2_AAEAD = value as Decimal
            break
        case 'OGP2_FEMALE':
            outputParams.OGP2_FEMALE = value as Decimal
            break
        case 'OGP2_OFFENCE':
            outputParams.OGP2_OFFENCE = value as Decimal
            break
        case 'OGP2_FIRST_SANCTION':
            outputParams.OGP2_FIRST_SANCTION = value as Decimal
            break
        case 'OGP2_SECOND_SANCTION':
            outputParams.OGP2_SECOND_SANCTION = value as Decimal
            break
        case 'OGP2_TOTAL_SANCTIONS':
            outputParams.OGP2_TOTAL_SANCTIONS = value as Decimal
            break
        case 'OGP2_SECOND_SANCTION_GAP':
            outputParams.OGP2_SECOND_SANCTION_GAP = value as Decimal
            break
        case 'OGP2_OFM':
            outputParams.OGP2_OFM = value as Decimal
            break
        case 'OGP2_COPASG':
            outputParams.OGP2_COPASG = value as Decimal
            break
        case 'OGP2_COPASG_SQUARED':
            outputParams.OGP2_COPASG_SQUARED = value as Decimal
            break
        case 'OGP2_SUITABLE_ACC':
            outputParams.OGP2_SUITABLE_ACC = value as Decimal
            break
        case 'OGP2_UNEMPLOYED':
            outputParams.OGP2_UNEMPLOYED = value as Decimal
            break
        case 'OGP2_LIVE_IN_RELATIONSHIP':
            outputParams.OGP2_LIVE_IN_RELATIONSHIP = value as Decimal
            break
        case 'OGP2_RELATIONSHIP':
            outputParams.OGP2_RELATIONSHIP = value as Decimal
            break
        case 'OGP2_MULTIPLIC_RELATIONSHIP':
            outputParams.OGP2_MULTIPLIC_RELATIONSHIP = value as Decimal
            break
        case 'OGP2_DV':
            outputParams.OGP2_DV = value as Decimal
            break
        case 'OGP2_REGULAR_ACTIVITIES':
            outputParams.OGP2_REGULAR_ACTIVITIES = value as Decimal
            break
        case 'OGP2_DAILY_DRUG_USER':
            outputParams.OGP2_DAILY_DRUG_USER = value as Decimal
            break
        case 'OGP2_DRUG_MOTIVATION':
            outputParams.OGP2_DRUG_MOTIVATION = value as Decimal
            break
        case 'OGP2_CHRONIC_DRINKER':
            outputParams.OGP2_CHRONIC_DRINKER = value as Decimal
            break
        case 'OGP2_BINGE_DRINKER':
            outputParams.OGP2_BINGE_DRINKER = value as Decimal
            break
        case 'OGP2_IMPULSIVE':
            outputParams.OGP2_IMPULSIVE = value as Decimal
            break
        case 'OGP2_CRIMINAL_ATTITUDE':
            outputParams.OGP2_CRIMINAL_ATTITUDE = value as Decimal
            break
        case 'OGP2_HEROIN':
            outputParams.OGP2_HEROIN = value as Decimal
            break
        case 'OGP2_METHADONE':
            outputParams.OGP2_METHADONE = value as Decimal
            break
        case 'OGP2_OTHER_OPIATE':
            outputParams.OGP2_OTHER_OPIATE = value as Decimal
            break
        case 'OGP2_CRACK':
            outputParams.OGP2_CRACK = value as Decimal
            break
        case 'OGP2_COCAINE':
            outputParams.OGP2_COCAINE = value as Decimal
            break
        case 'OGP2_MISUSE_PRESCRIBED':
            outputParams.OGP2_MISUSE_PRESCRIBED = value as Decimal
            break
        case 'OGP2_BENZODIAZEPINES':
            outputParams.OGP2_BENZODIAZEPINES = value as Decimal
            break
        case 'OGP2_AMPHETAMINES':
            outputParams.OGP2_AMPHETAMINES = value as Decimal
            break
        case 'OGP2_ECSTASY':
            outputParams.OGP2_ECSTASY = value as Decimal
            break
        case 'OGP2_CANNABIS':
            outputParams.OGP2_CANNABIS = value as Decimal
            break
        case 'OGP2_STEROIDS':
            outputParams.OGP2_STEROIDS = value as Decimal
            break
        case 'OGP2_OTHER_DRUGS':
            outputParams.OGP2_OTHER_DRUGS = value as Decimal
            break
        case 'OGP2_TOTAL_SCORE':
            outputParams.OGP2_TOTAL_SCORE = value as Decimal
            break
        case 'OGP2_PERCENTAGE':
            outputParams.OGP2_PERCENTAGE = value as Decimal
            break
        case 'OGP2_BAND':
            outputParams.OGP2_BAND = value as ScoreBand
            break
        case 'OGP2_MISSING_QUESTIONS':
            outputParams.OGP2_MISSING_QUESTIONS = value as string
            break
        case 'OGP2_MISSING_COUNT':
            outputParams.OGP2_MISSING_COUNT = value as number
            break
        case 'OVP2_CALCULATED':
            outputParams.OVP2_CALCULATED = value as ScoreStatus
            break
        case 'OVP2_YEAR_TWO':
            outputParams.OVP2_YEAR_TWO = value as Decimal
            break
        case 'OVP2_AAEAD':
            outputParams.OVP2_AAEAD = value as Decimal
            break
        case 'OVP2_FEMALE':
            outputParams.OVP2_FEMALE = value as Decimal
            break
        case 'OVP2_OFFENCE':
            outputParams.OVP2_OFFENCE = value as Decimal
            break
        case 'OVP2_FIRST_SANCTION':
            outputParams.OVP2_FIRST_SANCTION = value as Decimal
            break
        case 'OVP2_SECOND_SANCTION':
            outputParams.OVP2_SECOND_SANCTION = value as Decimal
            break
        case 'OVP2_TOTAL_SANCTIONS':
            outputParams.OVP2_TOTAL_SANCTIONS = value as Decimal
            break
        case 'OVP2_SECOND_SANCTION_GAP':
            outputParams.OVP2_SECOND_SANCTION_GAP = value as Decimal
            break
        case 'OVP2_OFM':
            outputParams.OVP2_OFM = value as Decimal
            break
        case 'OVP2_COPASV':
            outputParams.OVP2_COPASV = value as Decimal
            break
        case 'OVP2_NEVER_VIOLENT':
            outputParams.OVP2_NEVER_VIOLENT = value as Decimal
            break
        case 'OVP2_ONCE_VIOLENT':
            outputParams.OVP2_ONCE_VIOLENT = value as Decimal
            break
        case 'OVP2_TOTAL_VIOLENT_SANCTIONS':
            outputParams.OVP2_TOTAL_VIOLENT_SANCTIONS = value as Decimal
            break
        case 'OVP2_COPAS_VIOLENT':
            outputParams.OVP2_COPAS_VIOLENT = value as Decimal
            break
        case 'OVP2_SUITABLE_ACC':
            outputParams.OVP2_SUITABLE_ACC = value as Decimal
            break
        case 'OVP2_UNEMPLOYED':
            outputParams.OVP2_UNEMPLOYED = value as Decimal
            break
        case 'OVP2_RELATIONSHIP':
            outputParams.OVP2_RELATIONSHIP = value as Decimal
            break
        case 'OVP2_LIVE_IN_RELATIONSHIP':
            outputParams.OVP2_LIVE_IN_RELATIONSHIP = value as Decimal
            break
        case 'OVP2_MULTIPLIC_RELATIONSHIP':
            outputParams.OVP2_MULTIPLIC_RELATIONSHIP = value as Decimal
            break
        case 'OVP2_DV':
            outputParams.OVP2_DV = value as Decimal
            break
        case 'OVP2_REGULAR_ACTIVITIES':
            outputParams.OVP2_REGULAR_ACTIVITIES = value as Decimal
            break
        case 'OVP2_DRUG_MOTIVATION':
            outputParams.OVP2_DRUG_MOTIVATION = value as Decimal
            break
        case 'OVP2_CHRONIC_DRINKER':
            outputParams.OVP2_CHRONIC_DRINKER = value as Decimal
            break
        case 'OVP2_BINGE_DRINKER':
            outputParams.OVP2_BINGE_DRINKER = value as Decimal
            break
        case 'OVP2_IMPULSIVE':
            outputParams.OVP2_IMPULSIVE = value as Decimal
            break
        case 'OVP2_TEMPER':
            outputParams.OVP2_TEMPER = value as Decimal
            break
        case 'OVP2_CRIMINAL_ATTITUDE':
            outputParams.OVP2_CRIMINAL_ATTITUDE = value as Decimal
            break
        case 'OVP2_HEROIN':
            outputParams.OVP2_HEROIN = value as Decimal
            break
        case 'OVP2_CRACK':
            outputParams.OVP2_CRACK = value as Decimal
            break
        case 'OVP2_COCAINE':
            outputParams.OVP2_COCAINE = value as Decimal
            break
        case 'OVP2_MISUSE_PRESCRIBED':
            outputParams.OVP2_MISUSE_PRESCRIBED = value as Decimal
            break
        case 'OVP2_BENZODIAZEPINES':
            outputParams.OVP2_BENZODIAZEPINES = value as Decimal
            break
        case 'OVP2_AMPHETAMINES':
            outputParams.OVP2_AMPHETAMINES = value as Decimal
            break
        case 'OVP2_ECSTASY':
            outputParams.OVP2_ECSTASY = value as Decimal
            break
        case 'OVP2_CANNABIS':
            outputParams.OVP2_CANNABIS = value as Decimal
            break
        case 'OVP2_OTHER_OPIATE':
            outputParams.OVP2_OTHER_OPIATE = value as Decimal
            break
        case 'OVP2_OTHER_DRUGS':
            outputParams.OVP2_OTHER_DRUGS = value as Decimal
            break
        case 'OVP2_METHADONE':
            outputParams.OVP2_METHADONE = value as Decimal
            break
        case 'OVP2_STEROIDS':
            outputParams.OVP2_STEROIDS = value as Decimal
            break
        case 'OVP2_TOTAL_SCORE':
            outputParams.OVP2_TOTAL_SCORE = value as Decimal
            break
        case 'OVP2_PERCENTAGE':
            outputParams.OVP2_PERCENTAGE = value as Decimal
            break
        case 'OVP2_BAND':
            outputParams.OVP2_BAND = value as ScoreBand
            break
        case 'OVP2_MISSING_QUESTIONS':
            outputParams.OVP2_MISSING_QUESTIONS = value as string
            break
        case 'OVP2_MISSING_COUNT':
            outputParams.OVP2_MISSING_COUNT = value as number
            break
        case 'SNSV_CALCULATED_DYNAMIC':
            outputParams.SNSV_CALCULATED_DYNAMIC = value as ScoreStatus
            break
        case 'SNSV_YEAR_TWO_DYNAMIC':
            outputParams.SNSV_YEAR_TWO_DYNAMIC = value as Decimal
            break
        case 'SNSV_AAEAD_DYNAMIC':
            outputParams.SNSV_AAEAD_DYNAMIC = value as Decimal
            break
        case 'SNSV_FEMALE_DYNAMIC':
            outputParams.SNSV_FEMALE_DYNAMIC = value as Decimal
            break
        case 'SNSV_OFFENCE_DYNAMIC':
            outputParams.SNSV_OFFENCE_DYNAMIC = value as Decimal
            break
        case 'SNSV_FIRST_SANCTION_DYNAMIC':
            outputParams.SNSV_FIRST_SANCTION_DYNAMIC = value as Decimal
            break
        case 'SNSV_SECOND_SANCTION_DYNAMIC':
            outputParams.SNSV_SECOND_SANCTION_DYNAMIC = value as Decimal
            break
        case 'SNSV_TOTAL_SANCTIONS_DYNAMIC':
            outputParams.SNSV_TOTAL_SANCTIONS_DYNAMIC = value as Decimal
            break
        case 'SNSV_SECOND_SANC_GAP_DYNAMIC':
            outputParams.SNSV_SECOND_SANC_GAP_DYNAMIC = value as Decimal
            break
        case 'SNSV_OFM_DYNAMIC':
            outputParams.SNSV_OFM_DYNAMIC = value as Decimal
            break
        case 'SNSV_COPASV_DYNAMIC':
            outputParams.SNSV_COPASV_DYNAMIC = value as Decimal
            break
        case 'SNSV_NEVER_VIOLENT_DYNAMIC':
            outputParams.SNSV_NEVER_VIOLENT_DYNAMIC = value as Decimal
            break
        case 'SNSV_ONCE_VIOLENT_DYNAMIC':
            outputParams.SNSV_ONCE_VIOLENT_DYNAMIC = value as Decimal
            break
        case 'SNSV_TOT_VIOLENT_SANC_DYNAMIC':
            outputParams.SNSV_TOT_VIOLENT_SANC_DYNAMIC = value as Decimal
            break
        case 'SNSV_COPAS_VIOLENT_DYNAMIC':
            outputParams.SNSV_COPAS_VIOLENT_DYNAMIC = value as Decimal
            break
        case 'SNSV_WEAPON_DYNAMIC':
            outputParams.SNSV_WEAPON_DYNAMIC = value as Decimal
            break
        case 'SNSV_SUITABLE_ACC_DYNAMIC':
            outputParams.SNSV_SUITABLE_ACC_DYNAMIC = value as Decimal
            break
        case 'SNSV_UNEMPLOYED_DYNAMIC':
            outputParams.SNSV_UNEMPLOYED_DYNAMIC = value as Decimal
            break
        case 'SNSV_RELATION_QUALITY_DYNAMIC':
            outputParams.SNSV_RELATION_QUALITY_DYNAMIC = value as Decimal
            break
        case 'SNSV_DV_DYNAMIC':
            outputParams.SNSV_DV_DYNAMIC = value as Decimal
            break
        case 'SNSV_CHRONIC_DRINKER_DYNAMIC':
            outputParams.SNSV_CHRONIC_DRINKER_DYNAMIC = value as Decimal
            break
        case 'SNSV_BINGE_DRINKER_DYNAMIC':
            outputParams.SNSV_BINGE_DRINKER_DYNAMIC = value as Decimal
            break
        case 'SNSV_IMPULSIVE_DYNAMIC':
            outputParams.SNSV_IMPULSIVE_DYNAMIC = value as Decimal
            break
        case 'SNSV_TEMPER_DYNAMIC':
            outputParams.SNSV_TEMPER_DYNAMIC = value as Decimal
            break
        case 'SNSV_CRIM_ATTITUDE_DYNAMIC':
            outputParams.SNSV_CRIM_ATTITUDE_DYNAMIC = value as Decimal
            break
        case 'SNSV_HOMICIDE_DYNAMIC':
            outputParams.SNSV_HOMICIDE_DYNAMIC = value as Decimal
            break
        case 'SNSV_GBH_DYNAMIC':
            outputParams.SNSV_GBH_DYNAMIC = value as Decimal
            break
        case 'SNSV_KIDNAP_DYNAMIC':
            outputParams.SNSV_KIDNAP_DYNAMIC = value as Decimal
            break
        case 'SNSV_FIREARMS_DYNAMIC':
            outputParams.SNSV_FIREARMS_DYNAMIC = value as Decimal
            break
        case 'SNSV_ROBBERY_DYNAMIC':
            outputParams.SNSV_ROBBERY_DYNAMIC = value as Decimal
            break
        case 'SNSV_AGG_BURGLARY_DYNAMIC':
            outputParams.SNSV_AGG_BURGLARY_DYNAMIC = value as Decimal
            break
        case 'SNSV_WEAPONS_NOT_GUNS_DYNAMIC':
            outputParams.SNSV_WEAPONS_NOT_GUNS_DYNAMIC = value as Decimal
            break
        case 'SNSV_CRIM_DAMAGE_LIFE_DYNAMIC':
            outputParams.SNSV_CRIM_DAMAGE_LIFE_DYNAMIC = value as Decimal
            break
        case 'SNSV_ARSON_DYNAMIC':
            outputParams.SNSV_ARSON_DYNAMIC = value as Decimal
            break
        case 'SNSV_SCORE_DYNAMIC':
            outputParams.SNSV_SCORE_DYNAMIC = value as Decimal
            break
        case 'SNSV_PERCENTAGE_DYNAMIC':
            outputParams.SNSV_PERCENTAGE_DYNAMIC = value as Decimal
            break
        case 'SNSV_BAND_DYNAMIC':
            outputParams.SNSV_BAND_DYNAMIC = value as ScoreBand
            break
        case 'SNSV_MISSING_QUESTIONS_DYNAMIC':
            outputParams.SNSV_MISSING_QUESTIONS_DYNAMIC = value as string
            break
        case 'SNSV_MISSING_COUNT_DYNAMIC':
            outputParams.SNSV_MISSING_COUNT_DYNAMIC = value as number
            break
        case 'OSP_DC_CALCULATED':
            outputParams.OSP_DC_CALCULATED = value as ScoreStatus
            break
        case 'OSP_DC_SCORE':
            outputParams.OSP_DC_SCORE = value as Decimal
            break
        case 'OSP_DC_PERCENTAGE':
            outputParams.OSP_DC_PERCENTAGE = value as Decimal
            break
        case 'OSP_DC_BAND':
            outputParams.OSP_DC_BAND = value as ScoreBand
            break
        case 'OSP_DC_RISK_REDUCTION':
            outputParams.OSP_DC_RISK_REDUCTION = value as Decimal
            break
        case 'OSP_DC_MISSING_QUESTIONS':
            outputParams.OSP_DC_MISSING_QUESTIONS = value as string
            break
        case 'OSP_DC_MISSING_COUNT':
            outputParams.OSP_DC_MISSING_COUNT = value as number
            break
        case 'OSP_IIC_CALCULATED':
            outputParams.OSP_IIC_CALCULATED = value as ScoreStatus
            break
        case 'OSP_IIC_PERCENTAGE':
            outputParams.OSP_IIC_PERCENTAGE = value as Decimal
            break
        case 'OSP_IIC_BAND':
            outputParams.OSP_IIC_BAND = value as ScoreBand
            break
        case 'OSP_IIC_MISSING_QUESTIONS':
            outputParams.OSP_IIC_MISSING_QUESTIONS = value as string
            break
        case 'OSP_IIC_MISSING_COUNT':
            outputParams.OSP_IIC_MISSING_COUNT = value as number
            break
        case 'RSR_CALCULATED':
            outputParams.RSR_CALCULATED = value as ScoreStatus
            break
        case 'RSR_DYNAMIC':
            outputParams.RSR_DYNAMIC = value as String
            break
        case 'RSR_PERCENTAGE':
            outputParams.RSR_PERCENTAGE = value as Decimal
            break
        case 'RSR_BAND':
            outputParams.RSR_BAND = value as ScoreBand
            break
        case 'RSR_MISSING_QUESTIONS':
            outputParams.RSR_MISSING_QUESTIONS = value as string
            break
        case 'RSR_MISSING_COUNT':
            outputParams.RSR_MISSING_COUNT = value as number
            break
    }
}

function getOutputParameterName(scoreType: ScoreType, item: string): string {

    const suffix = scoreType == 'serious_violence_brief' ? '_STATIC' : scoreType == 'serious_violence_extended' ? '_DYNAMIC' : ''
    const itemName = outputItemName[item]
    let parameterName: string = null

    if (itemName != undefined) {
        parameterName = `${outputScoreName[scoreType]}_${itemName}${suffix}`
        const nameFix = nameCorrections[parameterName]
        if (nameFix != undefined) {
            parameterName = nameFix
        }
    }
    return parameterName
}


export const outputScoreName: { [key: string]: string } = {
    serious_violence_brief: 'SNSV',
    serious_violence_extended: 'SNSV',
    general_brief: 'OGRS4G',
    violence_brief: 'OGRS4V',
    general_extended: 'OGP2',
    violence_extended: 'OVP2',
    osp_c: 'OSP_DC',
    osp_i: 'OSP_IIC',
    rsr: 'RSR',
}

const outputItemName: { [key: string]: string } = {
    in_year_two_constant: 'YEAR_TWO',
    aai: 'AAEAD',
    female: 'FEMALE',
    offence: 'OFFENCE',
    firstsanction: 'FIRST_SANCTION',
    secondsanction: 'SECOND_SANCTION',
    ogrs3_sanctionoccasions: 'TOTAL_SANCTIONS',
    yrs_between_first_and_second_sanction_male: 'SECOND_SANCTION_GAP',
    yrs_between_first_and_second_sanction_female: 'SECOND_SANCTION_GAP',
    ofm: 'OFM',
    v: 'COPASV',
    g: 'COPASG',
    squared: 'COPASG_SQUARED',
    never_sanctioned_violent_male: 'NEVER_VIOLENT',
    never_sanctioned_violent_female: 'NEVER_VIOLENT',
    onceviolent: 'ONCE_VIOLENT',
    ogrs3_ovp_sanct: 'TOT_VIOLENT_SANC',
    violent: 'COPAS_VIOLENT',
    s2q2a_carry_use_weapon: 'WEAPON',
    livein_relationship: 'LIVE_IN_RELATIONSHIP',
    s3q4_suitability: 'SUITABLE_ACC',
    s4q2_unemployed: 'UNEMPLOYED',
    s6q4_partner_relationship: 'RELATIONSHIP',
    quality_of_livein_relationship: 'MULTIPLIC_RELATIONSHIP',
    s6q7_perpetrator: 'DV',
    dailydrug: 'DAILY_DRUG_USER',
    s8q8_motivation_tackle_misuse: 'DRUG_MOTIVATION',
    s9q1_current_use: 'CHRONIC_DRINKER',
    s9q2_binge_drinking: 'BINGE_DRINKER',
    s11q2_impulsivity: 'IMPULSIVE',
    s11q4_temper_control: 'TEMPER',
    s12q1_procriminal_attitudes: 'CRIMINAL_ATTITUDE',
    s7q2_activities_encourage: 'REGULAR_ACTIVITIES',
    drug_use_flag_v411_heroin: 'HEROIN',
    drug_use_flag_v411_methadone: 'METHADONE',
    drug_use_flag_v411_otheropiate: 'OTHER_OPIATE',
    drug_use_flag_v411_crack: 'CRACK',
    drug_use_flag_v411_cokepowder: 'COCAINE',
    drug_use_flag_v411_prescribed: 'MISUSE_PRESCRIBED',
    drug_use_flag_v411_benzo: 'BENZODIAZEPINES',
    drug_use_flag_v411_amphetamine: 'AMPHETAMINES',
    drug_use_flag_v411_ecstasy: 'ECSTASY',
    drug_use_flag_v411_cannabis: 'CANNABIS',
    drug_use_flag_v411_steroid: 'STEROIDS',
    drug_use_flag_v411_anyotherdrug: 'OTHER_DRUGS',
    r1q2_murder_prev: 'HOMICIDE',
    r1q2_wounding_prev: 'GBH',
    r1q2_kidnapping_prev: 'KIDNAP',
    r1q2_firearm_prev: 'FIREARMS',
    r1q2_robbery_prev: 'ROBBERY',
    r1q2_agg_burglary_prev: 'AGG_BURGLARY',
    r1q2_weapons_prev: 'WEAPONS_NOT_GUNS',
    r1q2_damage_with_intent_prev: 'CRIM_DAMAGE_LIFE',
    r1q2_arson_prev: 'ARSON',

    score: 'SCORE',
    percentage: 'PERCENTAGE',
    missingQuestions: 'MISSING_QUESTIONS',
    missingCount: 'MISSING_COUNT',
    status: 'CALCULATED',
    band: 'BAND',
    riskReduction: 'RISK_REDUCTION',
    dynamic: 'DYNAMIC',
}

const nameCorrections: { [key: string]: string } = {
    SNSV_SECOND_SANCTION_GAP_STATIC: 'SNSV_SECOND_SANC_GAP_STATIC',
    SNSV_SECOND_SANCTION_GAP_DYNAMIC: 'SNSV_SECOND_SANC_GAP_DYNAMIC',
    SNSV_RELATIONSHIP_DYNAMIC: 'SNSV_RELATION_QUALITY_DYNAMIC',
    SNSV_CRIMINAL_ATTITUDE_DYNAMIC: 'SNSV_CRIM_ATTITUDE_DYNAMIC',
    OGP2_SCORE: 'OGP2_TOTAL_SCORE',
    OVP2_SCORE: 'OVP2_TOTAL_SCORE',
    OGRS4V_TOT_VIOLENT_SANC: 'OGRS4V_TOT_VIOLENT_SANCTIONS',
    OVP2_TOT_VIOLENT_SANC: 'OVP2_TOTAL_VIOLENT_SANCTIONS',
}
