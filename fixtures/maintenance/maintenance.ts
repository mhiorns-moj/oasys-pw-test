import { Page } from '@playwright/test'
import * as pages from './pages'

export class Maintenance {

    constructor(private readonly page: Page) { }

    readonly userAccounts = new pages.UserAccounts(this.page)
    readonly maintainUser = new pages.MaintainUser(this.page)
    readonly userProfile = new pages.UserProfile(this.page)
    readonly maintainFullUserProfile = new pages.MaintainFullUserProfile(this.page)
}