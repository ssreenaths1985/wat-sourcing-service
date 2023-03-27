var express = require("express");
var app = express();
require("dotenv").config();
// const routes = require("./routers/users.route");
app.use(express.json());
app.use(express.static("public"));

const con = require("./middlewares/db.connect");
const swaggerUI = require("swagger-ui-express");

swaggerDocument = require("./docs/api_doc");

con.getConnection(function (err) {
  if (err) throw err;
  console.log("Database is connected...");
});
var cors = require("cors");
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // For legacy browser support
};
// app.use(bodyParser.json)
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors(corsOptions));

app.get("/", function (req, res) {
  console.log("Got a GET request for the homepage...");
  res.send(
    "Welcome to WAT - Sourcing... <br>Host: " +
      con.config.connectionConfig.host +
      "<br>Port: " +
      con.config.connectionConfig.port +
      "<br>Database: " +
      con.config.connectionConfig.database +
      "<br>User: " +
      con.config.connectionConfig.user
  );
});

require("./routers/users.route")(app);
app.use(
  "/api-documentation",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument)
);

var server = app.listen(
  process.env.APP_WAT_BE_PORT,
  process.env.IP_WAT_BE_ADDRESS,
  function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("WAT - Sourcing: listening at http://%s:%s", host, port);
  }
);
