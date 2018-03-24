module.exports = async function(confile = "./config.json"){
    const service_name = 'NodeID';
    const version = '0.1.0';
    const config = require('./config.js')(confile);
    const express = require("express");
    const bodyParser = require("body-parser");
    const routes = require("./routes.js");
    const init = require('./init.js');

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //Contracts initilization and deployment
    await init(config);
    routes(app, config);
    const server = app.listen(config.service_port, function () {
        console.log("Service " + service_name + " version " + version)
        console.log("Running on ",server.address().address,  server.address().port);
    });
    return server
}

//module.exports = server;