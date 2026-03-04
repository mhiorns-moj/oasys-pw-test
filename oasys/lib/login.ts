/**
 * __oasys.*function*__  
 *  
 * @module Login
 */

import * as oasys from 'oasys'
import { User } from 'classes/user'
import { testEnvironment } from '../../localSettings'

// Save current user for use in Playwright scripts
export let currentUserName: string = null
export let currentPassword: string = null
export let currentProvider: string = null

/**
 * Log in to OASys, assuming you are already on the login screen.  Can be called with either:
 *  - a predefined User object, and optional provider name
 *  - an OASys username, password and optional provider
 */
export function login(user: User, provider?: string): void
export function login(username: string, password: string, provider?: string): void
export function login(p1: User | string, p2?: string, p3?: string) {

    var username: string
    var password: string
    var provider: string

    if (p1 instanceof User) {
        username = p1.username
        password = testEnvironment.standardUserPassword
        provider = p2
    }
    else if (typeof p1 == 'string') {
        username = p1
        password = p2
        provider = p3
    }
    const page = new oasys.Pages.Login.Login()
    page.username.setValue(username)
    page.password.setValue(password)
    page.login.click()
    currentUserName = username
    currentPassword = password

    if (provider) {
        selectProvider(provider)
        currentProvider = provider
    } else {
        currentProvider = null
    }

    cy.title().should('include', 'Task Manager')
    cy.get('#bannerbarrightrnd').then((loginDetails) => {
        cy.log(`${loginDetails.text().replace(/[\n\r\t]/gm, '')}  (${username})`)
    })
}

/**
 * Selects a provider or establishment, assuming you are already on the Provider/Establishment page
 */
export function selectProvider(provider: string) {

    const page = new oasys.Pages.Login.SelectProvider()
    page.chooseProviderEstablishment.setValue(provider)
    page.setProviderEstablishment.click()
    currentProvider = provider
}

/**
 * Click the logout button on any page
 */
export function logout() {

    cy.get('input[type="button"][value="Logout"]').click()
    cy.title().should('include', 'Login')
    cy.log('Logged out')
    currentUserName = null
    currentPassword = null
    currentProvider = null
}
