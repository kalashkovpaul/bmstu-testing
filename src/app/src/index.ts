import App from "./modules/App";

global.__GLOBAL_VAR__ = {
    name: 'Global'
};

const app = new App();
app.start();