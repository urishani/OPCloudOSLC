# OSLC for OPCloud

Note: Started from example in TypeScript Node Starter of MS, found in https://github.com/Microsoft/TypeScript-Node-Starter.git.

# Pre-reqs
- Install [Node.js](https://nodejs.org/en/)
- Works with [OPCloud](https://github.com/NataliLevi/model-opcloud)
- Uses [firebase by Google](http://firebase.google.com)

# Getting started
Clone the repository
```
        git clone --depth=1 https://github.com/urishani/OPCloudOSLC.git <project_name>
```
- Install dependencies
```
cd <project_name>
        npm install
```
- Setup firebase credentials. Access a firebase project that is managed by OPCloud and click on it to see access credentials. Copy them to the **/environment/environment.ts** file, for the *firebaseCredentials* property in the *environment* object in that module.
```
- Build and run the project
```
npm start
```
Navigate to `http://localhost:3000/oslc/catalog`

# OSLC services
- Catalog. The path **/oslc/catalog** will response with the RDF for the catalog of OSLC service providers in the server. These are all the OPCloud models on the firebase project.<br>
Accessing this path from a browser will return a web page for the same information, using the *turtle* syntax of the RDF, but embedded in html formatting.<br>
All service providers listed on the HTML can be clicked to retrieve further OSLC specifications for each of the models as OSLC service providers.
- Service Provider - TBD
- OSLC Resources - TBd
