import { defineConfig } from 'cypress'

export default defineConfig({
    component: {
        devServer: {
            framework: 'angular',
            bundler: 'webpack',
        },
        specPattern: ['**/*.cy.{ts,js}'],
    },
    e2e: {
        baseUrl: 'http://localhost:4200',
        supportFile: false,
    },
    projectId: 'ajf2qy',
})
