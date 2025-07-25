import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      return config
    },
    experimentalRunAllSpecs: true
  },
  env: {
    apiUrl: 'https://norma.nomoreparties.space/api'
  }
})