import { test } from 'fixtures'
import { ogrsCsvTest } from './ogrsCalculator/ogrsTest'

const dataFile = 'dsTestCases'
const reportMode: ReportMode = 'none'

const dataFilePath = 'tests/ogrs/data/'

test('OGRS calculator test - data science test cases (static flag N)', async ({ ogrs }) => {

    ogrsCsvTest(`${dataFilePath}${dataFile}`, 'N', reportMode, ogrs)
})

test('OGRS calculator test - data science test cases (static flag Y)', async ({ ogrs }) => {

    ogrsCsvTest(`${dataFilePath}${dataFile}`, 'Y', reportMode, ogrs)
})
