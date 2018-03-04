/**
 * Module dependencies.
 */
import * as express from 'express';
import * as compression from 'compression';  // compresses requests
import * as session from 'express-session';
import * as bodyParser from 'body-parser';

import * as minimist from 'minimist';
const argv = minimist(process.argv.slice(2));

import * as swagger from 'swagger-node-express';

import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';
import * as lusca from 'lusca';
// import * as mongo from 'connect-mongo';
import * as flash from 'express-flash';
import * as path from 'path';
// import * as mongoose from 'mongoose';
import * as passport from 'passport';
// import expressValidator = require('express-validator');
// import OPCloud assets for db access
// import {OpmModel} from './models/OpmModel';

import {mergeTemplate, toHtml, makeId} from './utils/utils';

//import {OpmModel} from 'opcloud/src/app/models/OpmModel';
//import {OpmLogicalElement} from 'opcloud/src/app/models/LogicalPart/OpmLogicalElement';
//import {OpmVisualElement} from 'opcloud/src/app/models/VisualPart/OpmVisualElement';

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
import {environment} from './environment/environment';


/**
 * Controllers (route handlers).
 */
import * as homeController from './controllers/home';
// import * as userController from './controllers/user';
import * as apiController from './controllers/api';


// let opmModel = new OpmModel();
/**
 * API keys and Passport configuration.
 */
// import * as passportConfig from './config/passport';

/**
 * Create Express server.
 */
const app = express();

 console.log('environment:', environment.firebaseCredentials, ']');
/**
 * Connect to MongoDB.
 */
// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);

// mongoose.connection.on('error', () => {
//   console.log('MongoDB connection error. Please make sure MongoDB is running.');
//   process.exit();
// });

// Init the models database
// const opmModel: OpmModel = new OpmModel();
// app.locals.opmModel = opmModel;

import * as firebase from 'firebase';
const fbApp = firebase.initializeApp(environment.firebaseCredentials);

const defaultDatabase = fbApp.database();

const modelnames = defaultDatabase.ref('/modelnames/');
const modelnames_ = defaultDatabase.ref('/modelnames_/');
const counter = defaultDatabase.ref('/counter/');
const models = defaultDatabase.ref('/models/');
const models_ = defaultDatabase.ref('/models_/');

// modelnames.once('value').then( (snapshot) => {
//   const mNames = snapshot.val();
//   setIds(mNames);
// };

let modelNames,
    modelIndex,
    currentModel,
    currentModelId;

function getModelIndex(callback) {
    if (! modelIndex) {
        getDbnames((dbNames) => {
            modelNames = dbNames;
            modelIndex = {};
            for (const name in modelNames) {
                const element = modelNames[name];
                modelIndex[element['id']] = element;
            }
            callback(modelIndex);
        });
    } else
    callback(modelIndex);
}
function getDbnames(callback: any): any {
  console.log('in getDbnames');
  counter.once('value').then(
        (counterSS: any) => {
            let cnt = (counterSS.val() || {counter: 0}).counter;
            console.log(`cnt=${cnt}`);
            const origCnt = cnt;
            modelnames_.once('value').then( (modelNames_SS) => {
                const mNames_ = modelNames_SS.val() || {};
                modelnames.once('value').then((modelNamesSS) => {
                    const mNames = modelNamesSS.val() || {};
                    for (const name in mNames) {
                        if (mNames_[name] === undefined) {
                            const element = {
                                name: name,
                                description: 'No description'
                            };
                            mNames_[name] = element;
                        }
                        const element = mNames_[name];
                        if (! element.id) {
                            cnt++;
                            element.id = makeId(cnt);
                        }
                    }
                    modelNames = mNames_;

                    if (cnt > origCnt) {
                        counter.update({counter: cnt}, err => {
                            if (err)
                                console.log(err);
                        });
                        modelnames_.update(mNames_, err => {
                            if (err)
                                console.log(err);
                        });
                    }
                });
            });
            if (callback)
                callback(modelNames);
            },
      function (reason: any) {
          console.log(`call for counter rejected due to: ${reason}`);
      });
}

function getModel(id, callback: any) {
   getModelIndex((modelIndexSS) => {
       if (! modelIndexSS[id]) {
           if (callback) {
               callback(null);
           }
           return;
       }
       const modelName = modelIndex[id].name;
       const modelDescription =  modelIndex[id].description;
       const modelRef = defaultDatabase.ref('/models/' + modelName);
       if (currentModelId === id) {
           if (callback) {
             callback(currentModel);
           }
       } else {
           modelRef.once('value').then( (modelSS) => {
               const modelJson = modelSS.val();
               let m;
               if (typeof modelJson === 'string') {
                   m = JSON.parse(modelJson);
                   modelRef.update(m,
                       (error) => {
                            console.log(`updated model with JSON object instead of string ${error?'failed with' + error : 'succeeded'}`);
                   });
               }
               const opmModel = m || modelJson;
               if (opmModel && fixModelIds(opmModel)) {
                   modelRef.update(
                       (typeof modelJson === 'string') ? JSON.parse(modelJson) : modelJson,
                       (err) => {
                           console.log(err);
                       });
                   }
               if (opmModel) {
                   currentModel = opmModel;
                   currentModelId = id;
                   console.log('Current Model: id= ' + id + ', name=' + modelName);
               }
               if (callback) {
                   callback(opmModel);
               }
           });
       }
   });
}


function fixModelIds(opmModel:Object): boolean {
  let cnt = opmModel['counter'] || 0;
  const origcnt = cnt;
  for (const resource of opmModel['logicalElements']) {
    if (!resource['id']) {
      cnt++;
      resource['id'] = makeId(cnt, 'R');
    }
  }
  opmModel['counter'] = cnt;
  if (origcnt < cnt) {
    console.log(`Model ${opmModel['id']} modified its IDs`);
  }
  return origcnt < cnt;
}

getDbnames(undefined);

function makeModelId( cnt: number ) {
  return makeId(cnt);
}

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// SWAGGER settings
const subpath = express();
app.use(bodyParser());
app.use("/v1", subpath);
swagger.setAppHandler(subpath);
app.use(express.static('swagger-dist'));

swagger.setApiInfo({
    title: "OPCloud OSLC API",
    description: "API for the OSLC services over OPCloud",
    termsOfServiceUrl: "",
    contact: "s.uri@technion.ac.il",
    license: "MIT License",
    licenseUrl: "https://opensource.org/licenses/MIT"
});

subpath.get('/', function (req, res) {
    res.sendFile(__dirname + '/swagger-dist/index.html');
});

swagger.configureSwaggerPaths('', 'api-docs', '');

let domain = 'localhost';
if(argv.domain !== undefined)
    domain = argv.domain;
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".');
const applicationUrl = 'http://' + domain;
swagger.configure(applicationUrl, '1.0.0');

// if (url && url.length > 1) {
//     url = decodeURIComponent(url[1]);
// } else {
//     url = "/api-docs.json";
// }

// app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET || 'secret' // ,
    // store: new MongoStore({
    // url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    // autoReconnect: true
    //  })
}));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(flash());
// app.use(lusca.xframe('SAMEORIGIN'));
// app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  // if (!req.user &&
  //     req.path !== '/login' &&
  //     req.path !== '/signup' &&
  //     !req.path.match(/^\/auth/) &&
  //     !req.path.match(/\./)) {
  //   req.session.returnTo = req.path;
  // } else if (req.user &&
  //     req.path == '/account') {
  //   req.session.returnTo = req.path;
  // }
  console.log('catch-all path - doing nothing!');
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Controllers (route handlers).
 */
import * as oslcController from './controllers/oslc';
import { database } from 'firebase';
/**
 * Primary app routes.
 */
app.get('/oslc', function(req, res) { res.send('Hello from OSLC');});
app.get('/oslc/catalog', oslcController.getCatalog(getDbnames));

app.get('/oslc/:model/serviceProvider', oslcController.getServiceProvider(getDbnames));
app.get('/oslc/:model/resource', oslcController.getAllResources(getModel));
app.get('/oslc/:model/resource/:id', oslcController.getResource(getModel));
app.put('/oslc/:model/resource/:id', oslcController.putResource(getModel));
app.delete('/oslc/:model/resource/:id', oslcController.delResource(getModel));
app.post('/oslc/:model/resource/:id', oslcController.postResource(getModel));
// app.get('/oslc/:model/query', oslcController.queryResource);


/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});


/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
