const { defineConfig } = require("cypress");

module.exports = defineConfig({
    component:{
        devServer: {
            framework: 'create-react-app',
        },
    },
    e2e: {
        baseUrl: 'http://185.91.52.121:3000',
        specPattern: 'cypress/e2e/*.spec.js'
    },
});
