import { Page } from '@playwright/test'

export abstract class SpPage {

    browserPage: Page

    constructor(browserPage: Page) {
        this.browserPage = browserPage
    }
}