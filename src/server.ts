/**
 * Module dependencies.
 */
import * as express from 'express';
import * as compression from 'compression';  // compresses requests
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
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


let opmModel = new OpmModel();
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

let modelNames = undefined;
const modelIndex = {};
let currentModel = undefined;
let currentModelId = undefined;

function getDbnames(callback: any): any {
  counter.once('value').then((snapshot: any) => {
    let cnt = (snapshot.val() || {counter: 0}).counter;
    const origCnt = cnt;
    modelnames_.once('value').then( (snapshot) => {
      const mNames_ = snapshot.val();
      modelnames.once('value').then((snapshot) => {
        const mNames = snapshot.val();
        for (const name in mNames) {
          if (mNames_[name] === undefined) {
            const element = {
              name: name,
              description: "No description"
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
        for (const name in modelNames) {
          const element = modelNames[name];
          modelIndex[element['id']] = element;
        }

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
    return modelNames;
  });
}

function getModel(id, callback: any) {
  const modelName = modelIndex[id].name;
  const modelDescription =  modelIndex[id].description;
  const modelRef = defaultDatabase.ref('/models/' + modelName);
  if (currentModelId == id) {
    if (callback) {
      callback(currentModel);
    }
  } else {
    modelRef.once('value').then( (snapshot) => {
      let modelJson = snapshot.val();
      const opmModel = (typeof modelJson === 'string')? JSON.parse(modelJson) : modelJson;
      //if (modelJson) {
      //  opmModel.fromJson((typeof modelJson === 'string')? modelJson : JSON.stringify(modelJson));
      //}
//      if (opmModel) {
        if (fixModelIds(opmModel)) {
          //modelJson = opmModel.toJson();
          modelRef.update((typeof modelJson === 'string')?JSON.parse(modelJson):modelJson, (err) => {
            console.log(err);
          });
  //      }
  
      }
      currentModel = opmModel;
      currentModelId = id;
      console.log("Current Model: id= " + id + ", name=" + modelName);
      if (callback) {
        callback(opmModel);
      }
    });
  }
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

// setIds(mNames);

// Some utils
// function setIds(mnames: any) {
//       counter.once('value').then((snapshot: any) => {
//         let cnt = (snapshot.val() || {counter: 0}).counter;
//         const origcnt = cnt;
//         for (const element in mnames) {
//           if (!mnames[element].id) {
//             cnt++;
//             mnames[element].id = makeModelId(cnt);
//           }
//         }
//         if (cnt > origcnt) {
//           console.log('Created ids. cnt: ' + origcnt + ' -> ' + cnt);
//           counter.update({counter: cnt}, err => {
//             if (err)
//               console.log(err);
//           });
//           modelnames_.update(mnames);
//         } else
//           console.log('No changes to model names - all are set');
//       });
// }

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
app.post('/oslc/:model/resource:/id', oslcController.postResource(getModel));
//app.get('/oslc/:model/query', oslcController.queryResource);


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
