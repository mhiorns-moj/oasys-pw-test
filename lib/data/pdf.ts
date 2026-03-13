import * as fs from 'fs-extra'
import { PDFParse } from 'pdf-parse'

const downloadFolder = 'cypress/downloads'
let pdfFile = null

/**
 * Starts a file watcher to check for a PDF download.
 */
export async function startPdfWatcher() {

    pdfFile = null
    if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder);
    }
    fs.watch(downloadFolder, (eventType, filename) => {
        if (filename.length > 4 && filename.substring(filename.length - 3).toUpperCase() == 'PDF') {
            pdfFile = filename
        }
    })
}

/**
 * Waits for a PDF file to be created in the downloads folder, then returns it as a string array (one line per string) together with the filename.
 * Requires the watcher above to have been called first.
 */
export async function getPdf(): Promise<{ filename: string, contents: string[] }> {

    let count = 0

    do {
        if (pdfFile) {
            break
        }
        await new Promise(r => setTimeout(r, 100))
    } while (count++ < 5000)

    if (!pdfFile) {
        throw new Error('Error waiting for PDF file')
    }
    await new Promise(r => setTimeout(r, 5000))  // Delay to ensure PDF download completes

    const fileContents = await fs.readFile(`${downloadFolder}/${pdfFile}`)
    return new Promise((resolve) => {
        const parser = new PDFParse({ data: fileContents })
        parser.getText().then((data) => {
            resolve({ filename: pdfFile, contents: data.text.split('\n') })
        })
    })
}

