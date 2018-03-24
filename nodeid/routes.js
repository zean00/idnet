var appRouter = function (app, config) {

  const handlerPath = config.handler_path || "./handlers"
  const fs = require('fs');
  const files = fs.readdirSync(handlerPath);
  for(f in files) {
      const name = files[f].split('.')[0];
      const handler = require(handlerPath + "/" + name)
      handler(app, config)
  }
  
  app.get("/status", function(req, res) {
      res.status(200).send("Still alive...");
  });

}
module.exports = appRouter;