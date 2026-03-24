import { test } from 'fixtures'
import { mappingTest } from './xMappingTest'
import * as data from '../data/mapping'

// Ensure tests/data/local/mappingTestsOffender.txt has been updated by running aaSanMappingTestOffender first.

test('Mapping test: alcohol part 2', async ({ oasys, offender, assessment, san }) => {

    await mappingTest(oasys, offender, assessment, san, data.Alcohol2.script)
})