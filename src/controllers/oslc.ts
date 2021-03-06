import { Request, Response } from 'express';
//import {OpmLogicalEntity} from 'opcloud/src/app/models/LogicalPart/OpmLogicalEntity';

import {catalogTemplate} from '../rdf/oslc.provider.catalog';
import {providerTemplate} from '../rdf/oslc.provider';
import {allResourcesTemplate} from '../rdf/oslc.all.resources';
import {resourceTemplate} from '../rdf/oslc.resource';

// console.log(catalogTemplate().substr(0, 500));
import {mergeTemplate, toHtml, makeId} from '../utils/utils';

/**
 * GET /oslc
 * List of API examples.
 */
export let getResource = function(handler: any) {
    return function (req: Request, res: Response) {
        const hostname = req.protocol + '://' + req.headers.host;
        console.log('getResource: Calculated host: ' + hostname);
        const modelId = req.params['model'];
        const resourceId = req.params['id'];
        handler(modelId, (model: Object) => {
//            console.log(`model in json: [ ${JSON.stringify(model)}]`);
            const logicalElements = model ? model['logicalElements'] : [];
            for (const resource of logicalElements) {
                if (resource['id'] == resourceId) {
                    const options = {
                        properties: [],
                        title: 'model ' + modelId + ' logical element id: ' + resourceId,
                        host: hostname,
                        text: resource.text,
                        model: modelId,
                        id: resource['id'],
                        type: resource['name'],
                        description: resource['description'] || "No description for this resource",
                        semicolon: ';'
                    };
//                    console.log(`resource in json [${JSON.stringify(resource)}]`);
                    if (resource.linkConnectionType)
                        options.properties.push({property: 'linkConnectionType', value: resource.linkConnectionType, semicolon: ';'});
                    if (resource.linkType)
                        options.properties.push({property: 'linkType', value: resource.linkType, semicolon: ';'});
                    for (const param in {}) { // resource.getElementParams()) {
                       options.properties.push({
                            property: param,
                            value: resource[param],
                            semicolon: ';',
                        });
                    }
                    if (options.properties.length > 0)
                        options.properties[options.properties.length-1].semicolon = '.';
                    else
                        options.semicolon = '.';
//                  console.log(`resource options: [${options}`);
                    if (req.accepts('html')) {
                        res.render('oslc-resource', options);
                    } else if (req.accepts('application/rdf+xml')) {
                        res.set('Content-Type', 'application/rdf+xml').
                        status(200).send(mergeTemplate(resourceTemplate('xml'), options));
                    } else if (req.accepts('application/json-ld')) {
                        res.set('Content-Type', 'application/json-ld').
                        status(200).send(mergeTemplate(resourceTemplate('json'), options));
                    } else {
                        res.set('Content-Type', 'text/turtle').
                        status(200).send(mergeTemplate(resourceTemplate('turtle'), options));
                    }
                    break;
                }
            }
        });
    };
};

export let putResource = function(handler: any) {
    return function (req: Request, res: Response) {
        res.render('oslc/index', {
            title: 'PUT Examples',
            model: req.params.model
        });
    };
};
export let postResource = function(handler: any) {
    return function (req: Request, res: Response) {
        res.render('oslc/index', {
            title: 'POST Examples',
            model: req.params.model
        });
    };
};
export let delResource = function(handler: any) {
    return function (req: Request, res: Response) {
        res.render('oslc/index', {
            title: 'DEL Examples',
            model: req.params.model
        });
    };
};
export let queryResource = function(handler: any) {
    return function (req: Request, res: Response) {
        res.render('oslc/index', {
            title: 'QUERY Examples',
            model: req.params.model
        });
    };
};
/**
 * GET /oslc/facebook
 * Facebook API example.
 */

/**
 *
 * @param req provides a catalog information
 * @param res
 * @param db
 */
const x = catalogTemplate();
console.log('catalogTemplate: ' + x.split('\n').length);
console.log('toHtml(template): ' + toHtml(x).split('<br>').length);
console.log('mergeTemplate(toHtml(template)): ' + mergeTemplate(toHtml(x), {}).split('<br>').length);
export let getCatalog = function(handler: any) {
    return function (req: Request, res: Response) {
        const hostname = req.protocol + '://' + req.headers.host;
        console.log('Calculated host: ' + hostname);
        handler((modelNames: any) => {
            const sps = [];
            console.log(JSON.stringify(modelNames));
            for (const aModel in modelNames) {
                sps.push({
                    model: modelNames[aModel].id || 'M000any',
                    name: aModel,
                    description: modelNames[aModel].description || 'A model with no description',
                    comma: ', ',
                    jsonComma: ',',
                });
            }
            sps[sps.length-1].comma = '.';
            sps[sps.length-1].jsonComma = '';
            const options = {
                title: undefined,
                host: hostname,
                'oauth-request-token-uri': 'token',
                'oauth-authorize-uri': 'http://authoriser.opm.technion.ac.il',
                'oauth-access-token-uri': 'opmToken',
                serviceProviderUrl: sps,
                serviceProvider: sps
            };
            console.log('catalog options: ' + JSON.stringify(options));
            options.title = 'Catalog';
            if (req.accepts('html'))
                res.render('oslc-catalog', options); // mergeTemplate(toHtml(catalogTemplate()), options)});
                else if (req.accepts('application/rdf+xml')) {
                    res.set('Content-Type', 'application/rdf+xml').
                    status(200).send(mergeTemplate(catalogTemplate('xml'), options));
                } else if (req.accepts('application/json-ld')) {
                    res.set('Content-Type', 'application/json-ld').
                    status(200).send(mergeTemplate(catalogTemplate('json'), options));
                } else {
                    res.set('Content-Type', 'text/turtle').
                    status(200).send(mergeTemplate(catalogTemplate(), options));
            }
        });
    };
};

export let getServiceProvider = function(handler: any) {
    return function (req: Request, res: Response) {
        const hostname = req.protocol + '://' + req.headers.host;
        console.log('GetServiceProvider: Calculated host: ' + hostname);
        handler((modelNames: any) => {
            const modelId = req.params['model'];
            let aModel;
            for (const modelName in modelNames) {
                if (modelNames[modelName].id === modelId) {
                    aModel = modelNames[modelName];
                    aModel.name = modelName;
                    break;
                }
            }
            if (! aModel) {
                res.status(500).send('Model for id [${modelId}] not found');
                return;
            }
            const options = {
                title: 'Service Provider ' + modelId,
                host: hostname,
                model: modelId,
                name: aModel.name,
                description: aModel.description || 'A model with no description',
                prefixDefinition: [
                    { prefix: 'opm', nameSpaceUri: 'http://opm.technion.ac.il/opm#', 
                        semicolon: ';', jsonComma: ",", prefixNum: 10},
                    { prefix: 'model', nameSpaceUri: hostname + '/oslc/' + modelId + '/', 
                        semicolon: '.', jsonComma: "", prefixNum: 11}
                ]
            };
            console.log('catalog options: ' + options);
            if (req.accepts('html')) {
                res.render('oslc-provider', options);
            } else if (req.accepts('application/rdf+xml')) {
                res.set('Content-Type', 'application/rdf+xml').
                status(200).send(mergeTemplate(providerTemplate('xml'), options));
            } else if (req.accepts('application/json-ld')) {
                res.set('Content-Type', 'application/json-ld').
                status(200).send(mergeTemplate(providerTemplate('json'), options));
            } else {
                res.set('Content-Type', 'text/turtle').
                status(200).send(mergeTemplate(providerTemplate('turtle'), options));
            }
        });
    };
};

//import {OpmModel} from 'opcloud/src/app/models/OpmModel';
//import {OpmLogicalElement} from 'opcloud/src/app/models/LogicalPart/OpmLogicalElement';
//import {OpmVisualElement} from 'opcloud/src/app/models/VisualPart/OpmVisualElement';

// const makeElementId = (modelElement: OpmLogicalElement<OpmVisualElement>): string => {
//     const model = modelElement.opmModel;
//     if (!model["counter"]) {
//         model["counter"] = 0;
//     }
//     if (!modelElement["id"]) {
//         model["counter"] ++;
//         model["changed"] = true;
//         modelElement["id"] = makeId(model["counter"], 'R');
//         model["changeTime"] = new Date();
//     }
//     return modelElement["id"];
// };
export let getAllResources = function(handler: any) {
    return function (req: Request, res: Response) {
        const hostname = req.protocol + '://' + req.headers.host;
        console.log('getAllresources: Calculated host: ' + hostname);
        const modelId = req.params['model'];
        handler(modelId, (model: Object) => {
            const name = model ? model['name'] : 'NoModel';
            const description = model ? model['description'] : 'NoModel';
            const logicalElements = model ? model['logicalElements'] : [];
            const options = {
                elements: [],
                title: `OPM model ${modelId} logical elements`,
                host: hostname,
                model: modelId,
                name: name || 'No model name',
                description: description || 'No description for this model',
            };
            for (const logicalElement of model['logicalElements']) {
                // const entityParams = logicalElement.getElementParams();
                options.elements.push({
                    id: logicalElement['id'] || 'NoId',
                    text: logicalElement['text'] || 'NoText' ,
                    description: logicalElement['description'] || "No description",
                    type: logicalElement['name'] || 'NoType',
                    comma: ',',
                });
            }
            if (options.elements.length > 0)
                options.elements[options.elements.length-1].comma = '';
            console.log('resource options: ' + JSON.stringify(options));
            if (req.accepts('html')) {
                res.render('oslc-all-resources', options);
            } else if (req.accepts('application/rdf+xml')) {
                res.set('Content-Type', 'application/rdf+xml').
                status(200).send(mergeTemplate(allResourcesTemplate('xml'), options));
            } else if (req.accepts('application/json-ld')) {
                res.set('Content-Type', 'application/json-ld').
                status(200).send(mergeTemplate(allResourcesTemplate('json'), options));
            } else {
                res.set('Content-Type', 'text/turtle').
                status(200).send(mergeTemplate(allResourcesTemplate(), options));
            }
        });
    };
};
