// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { Type } from '@angular/core'
import { mount, MountConfig } from 'cypress/angular'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.

// declare global {
//     // eslint-disable-next-line @typescript-eslint/no-namespace
//     namespace Cypress {
//         interface Chainable {
//             mount: typeof mount
//         }
//     }
// }
//
// Cypress.Commands.add('mount', mount)

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            mount: typeof customMount
        }
    }
}

const declarations: any[] = []

function customMount<T>(component: string | Type<T>, config?: MountConfig<T>) {
    if (!config) {
        config = { declarations }
    } else {
        config.declarations = [...(config?.declarations || []), ...declarations]
    }
    return mount<T>(component, { ...config, autoSpyOutputs: true })
}

Cypress.Commands.add('mount', customMount)

// Example use:
// cy.mount(MyComponent)
