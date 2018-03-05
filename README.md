# OSLC for OPCloud

Note: Started from example in TypeScript Node Starter of MS, found in https://github.com/Microsoft/TypeScript-Node-Starter.git.

# Pre-reqs
- Install [Node.js](https://nodejs.org/en/)
- Works with [OPCloud](https://github.com/NataliLevi/model-opcloud)
- Uses [firebase by Google](http://firebase.google.com)

# Getting started
Clone the repository

    git clone --depth=1 https://github.com/urishani/OPCloudOSLC.git <project_name>

- Install dependencies

        cd <project_name>
        npm install

- Setup firebase credentials. Access a firebase project that is managed by OPCloud and click on it to see access credentials. Copy them to the **/environment/environment.ts** file, for the *firebaseCredentials* property in the *environment* object in that module.

    - Build and run the project

            npm start

    - Navigate to http://localhost:3000/oslc/catalog

            curl -H="Accept: text/turtle" http://localhost:3000/oslc/catalog

    - Start a web page access from a browser:

            open http://localhost:3000/oslc/catalog

# OSLC services
- Catalog. The path **/oslc/catalog** will response with the RDF for the catalog of OSLC service providers in the server. These are all the OPCloud models on the firebase project.<br>
Accessing this path from a browser will return a web page for the same information, using the *turtle* syntax of the RDF, but embedded in html formatting.<br>
All service providers listed on the HTML can be clicked to retrieve further OSLC specifications for each of the models as OSLC service providers.

Doing a curl for this URL and any of the subsequent URLs for the service providers and their resources can use the text/turtle and application/rdf+xml media types for the proper data in turtle or XML respectively. 
- Service Provider - For each model, its ID in the format Mnnnn with nnnn being a decimal number, is used to form its URL with the path **/oslc/Mnnnn/serviceProvider** and will list its capabilities. Like for the catalog, the answer for text/html media type is an HTML page with the content having a legal RDF in turtle syntax, while accessing with text/turtle or application/rdf+xml media types will return the smae content as RDF.
- OSLC Resources - Using the URL **/oslc/Mnnnn/Resource** will list all resources of that service provider, with each having an Id in the format Rnnnn with nnnn being a decimal number. Clicking on any of the listed URLs will open that URL in the same way as described above.
- OSLC Resource nnnn - Using the URL **/oslc/Mnnnn/Resource/Rmmmm** answers with the RDF for that resource, in either of text/html (for a browser access), text/turtle and application/rdf+xml for RDF content.

# API on-line documentation
Accessing the base URL for the server will respond with a SWAGGER API online documentation that describes all the possible OSLC APIs of the server, and will allow to try them out, responding accordingly. URL for this is the plain root of the server URL **/**. E.g., http://localhost:3000.

