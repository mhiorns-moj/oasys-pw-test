import { OgrsInputParams, OutputParameters } from '../types'
import { calculatePredictor } from './calculatePredictor'
import { createOutputObject } from './createOutput'
import { ospRsrCalc } from 'fixtures/ogrs/calculator/ospRsr'


export class Calculator {

    calculate(calculatorParams: OgrsInputParams): OutputParameters {

        const result = createOutputObject()

        calculatePredictor('serious_violence_extended', calculatorParams, result)
        calculatePredictor('general_extended', calculatorParams, result)
        calculatePredictor('violence_extended', calculatorParams, result)

        // Attempt brief versions for SNSV, OGRS4G, OGRS4V if no results from the extended ones.
        calculatePredictor('serious_violence_brief', calculatorParams, result, result.SNSV_CALCULATED_DYNAMIC == 'Y')
        calculatePredictor('general_brief', calculatorParams, result, result.OGP2_CALCULATED == 'Y')
        calculatePredictor('violence_brief', calculatorParams, result, result.OVP2_CALCULATED == 'Y')

        // OSP and RSR
        ospRsrCalc(calculatorParams, result)

        return result
    }
}