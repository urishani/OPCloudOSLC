import {DatabaseDriver} from 'databaseDriver';
import * as firebase from 'firebase';
class FirebaseDriver implements DatabaseDriver {
    private let fbApp;
    private let defaultDatabase; 
    private let modelnamesRef;
    private let modelnames_Ref;
    private let modelsRef;
    private let models_Ref;
    private let metaRef;
    private let modelNames;
    private let modelNamesIndex = {};
    private let meta = {counter: 0};
    
    constructor(environment:{}) {
        fbApp = firebase.initializeApp(environment.firebaseCredentials);
        defaultDatabase = fbApp.database();
        modelnamesRef = defaultDatabase.ref('/modelnames/');
        modelnames_Ref = defaultDatabase.ref('/modelnames_/');
        metaRef = defaultDatabase.ref('/counter/');
        modelsRef = defaultDatabase.ref('/models/');
        models_Ref = defaultDatabase.ref('/models_/');
        getMetadata((err, meta_) => {
            if (!err)
               meta = meta_;
        })
    }

    let makeId = (cnt: number, mark: string = 'M' ): string => {
        const n = `${cnt}`;
        let s = `${mark}0000`;
        s = s.substring(0, Math.max(0, s.length - n.length)) + n;
        // const s = util.format('M%i', cnt ) ;
        return s;
      };
    
      
    getModelNames(callback(err:string, modelNames:{}) {
        if (modelNames) {
            if (callback)
               callback(null, modelNames);
            return;
        }
        modelNamesRef.once('value').then(
            modelNamesSS:any => {
                boolean changed = false;
                modelNames = modelNamesSS.val() || {};
                if (!(modelNames.key && modelNamesIndex && modelNamesIndex.key && modelNamesIndex.key === modelNames.key)) {
                    // create the index
                    modelNames.foreach(entry => {
                        if (typeof entry != 'object' || !entry.id) {
                            entry.id = makeId(meta.counter++, 'M');
                            changed = true;
                        }
                        index[entry.id] = entry;
                    });
                }
                if (changed) {
                    metaRef.update(meta, err => {
                        console.log(`updating meta data with ${JSON.stringify(meta)}: err=${err}`);
                        if (err && callback)
                           callback(err);
                    });
                    modelNames.update(modelNames, err => {
                        console.log(`updating modelnames with ${Object.keys(modelNames).length} model names: err=${err}`);
                        if (err && callback)
                            callback(err);
                    });
                    // update the modelnames that were changed.
                    changed = false;
                }
                if (callback) 
                    callback(null, modelNames);
            )
        }
    }
}
  