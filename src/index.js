const app = require("./app");
const { PORT } = process.env;

const startApp = () => {
const HOST = '192.168.1.4';
    app.listen(PORT , HOST , () => {
        console.log(`Auth Backend running on port on host  ${PORT} ${HOST}`);


    });
   

};
startApp();