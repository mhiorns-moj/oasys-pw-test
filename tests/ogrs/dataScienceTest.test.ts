import { test } from 'fixtures'
import { ogrsCsvTest } from './testLib'

const dataFile = 'tests/ogrs/data/dsTestCases.csv'
const outputFileY = 'test-results/dsTestResultsY.csv'
const outputFileN = 'test-results/dsTestResultsN.csv'
const reportMode: ReportMode = 'none'


test('OGRS calculator test - data science test cases (static flag N)', async ({ ogrs }) => {

    await ogrsCsvTest(dataFile, 'N', reportMode, outputFileN, ogrs)
})

test('OGRS calculator test - data science test cases (static flag Y)', async ({ ogrs }) => {

    await ogrsCsvTest(dataFile, 'Y', reportMode, outputFileY, ogrs)
})
