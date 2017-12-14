/**
 * Module dependencies.
 */
import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as errorHandler from "errorhandler";
import * as lusca from "lusca";
// import * as mongo from "connect-mongo";
import * as flash from "express-flash";
import * as path from "path";
// import * as mongoose from "mongoose";
import * as passport from "passport";
import expressValidator = require("express-validator");
// import OPCloud assets for db access
// import {OpmModel} from "./models/OpmModel";

import * as util from "util";

// const MongoStore = mongo(session);

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
import {environment} from "./environment/environment";


/**
 * Controllers (route handlers).
 */
import * as homeController from "./controllers/home";
// import * as userController from "./controllers/user";
import * as apiController from "./controllers/api";
import * as contactController from "./controllers/contact";

/**
 * API keys and Passport configuration.
 */
// import * as passportConfig from "./config/passport";

/**
 * Create Express server.
 */
const app = express();

 console.log("environment:", environment.firebaseCredentials, "]");
/**
 * Connect to MongoDB.
 */
// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);

// mongoose.connection.on("error", () => {
//   console.log("MongoDB connection error. Please make sure MongoDB is running.");
//   process.exit();
// });

// Init the models database
// const opmModel: OpmModel = new OpmModel();
// app.locals.opmModel = opmModel;

import * as firebase from "firebase";
const fbApp = firebase.initializeApp(environment.firebaseCredentials);

const defaultDatabase = fbApp.database();

const modelnames = defaultDatabase.ref("/modelnames_/");
const counter = defaultDatabase.ref("/counter/");
const models = defaultDatabase.ref("/models_/");

// modelnames.once("value").then( (snapshot) => {
//   const mNames = snapshot.val();
//   setIds(mNames);
// };


function getDbnames(callback: any): any {
  modelnames.once("value").then( (snapshot) => {
    const mNames = snapshot.val();
    if (callback)
      callback(mNames);
    return mNames;
  });
}

const mNames = getDbnames(setIds);
// setIds(mNames);

// Some utils
function setIds(mnames: any) {
      counter.once("value").then((snapshot: any) => {
        let cnt = snapshot.val();
        const origcnt = cnt;
        for (const element in mnames) {
          if (!mnames[element].id) {
            cnt++;
            mnames[element] = { id: makeModelId(cnt) };
          }
        }
        if (cnt > snapshot.val()) {
          defaultDatabase.ref("counter").update({counter: cnt}, err => {
            if (err)
              console.log(err);
          });
          modelnames.update(mnames);
        } else
          console.log("No changes to model names - all are set");
      });
}

function makeModelId( cnt: number ) {
  const n = "" + cnt;
  const s = "M" + "0000".substring(0, Math.max(0, 4 - n.length)) + n;
  // const s = util.format("M%i", cnt ) ;
  return s;
}

/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET || "secret" // ,
    // store: new MongoStore({
    // url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    // autoReconnect: true
    //  })
}));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(flash());
// app.use(lusca.xframe("SAMEORIGIN"));
// app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  // if (!req.user &&
  //     req.path !== "/login" &&
  //     req.path !== "/signup" &&
  //     !req.path.match(/^\/auth/) &&
  //     !req.path.match(/\./)) {
  //   req.session.returnTo = req.path;
  // } else if (req.user &&
  //     req.path == "/account") {
  //   req.session.returnTo = req.path;
  // }
  console.log("catch-all path - doing nothing!");
  next();
});
app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));

/**
 * Controllers (route handlers).
 */
import * as oslcController from "./controllers/oslc";
/**
 * Primary app routes.
 */
app.get("/oslc/catalog", oslcController.getCatalog(getDbnames));
app.get("/oslc/:model/serviceProvider", oslcController.getServiceProvider);
app.get("/oslc/:model/Resource", oslcController.getResource);
app.put("/oslc/:model/Resource", oslcController.putResource);
app.delete("/oslc/:model/Resource", oslcController.delResource);
app.post("/oslc/:model/Resource", oslcController.postResource);
app.get("/oslc/:model/query", oslcController.queryResource);


/**
 * OAuth authentication routes. (Sign in)
 */
app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
  res.redirect(req.session.returnTo || "/");
});


/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});

module.exports = app;