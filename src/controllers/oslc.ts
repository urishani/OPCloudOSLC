import { Request, Response } from "express";
/**
 * GET /oslc
 * List of API examples.
 */
export let getServiceProvider = function(handler: any) {
    return function (req: Request, res: Response) {
    res.render("oslc/index", {
        title: "Service Provider Examples",
        model: req.params.model
    });
};
};
export let getResource = function (req: Request, res: Response) {
    res.render("oslc/index", {
        title: "GET Examples",
        model: req.params.model
    });
};
export let putResource = function (req: Request, res: Response) {
    res.render("oslc/index", {
        title: "PUT Examples",
        model: req.params.model
    });
};
export let postResource = function (req: Request, res: Response) {
    res.render("oslc/index", {
        title: "POST Examples",
        model: req.params.model
    });
};
export let delResource = function (req: Request, res: Response) {
    res.render("oslc/index", {
        title: "DEL Examples",
        model: req.params.model
    });
};
export let queryResource = function (req: Request, res: Response) {
    res.render("oslc/index", {
        title: "QUERY Examples",
        model: req.params.model
    });
};
/**
 * GET /oslc/facebook
 * Facebook API example.
 */

import {catalogTemplate} from "../rdf/oslc.provider.catalog";
console.log(catalogTemplate().substr(0, 500));
import {mergeTemplate, toHtml} from "../utils/utils";

/**
 *
 * @param req provides a catalog information
 * @param res
 * @param db
 */
const x = catalogTemplate();
console.log("catalogTemplate: " + x.split("\n").length);
console.log("toHtml(template): " + toHtml(x).split("<br>").length);
console.log("mergeTemplate(toHtml(template)): " + mergeTemplate(toHtml(x), {}).split("<br>").length);
export let getCatalog = function(handler: any) {
    return function (req: Request, res: Response) {
        const hostname = req.protocol + "://" + req.headers.host;
        console.log("Calculated host: " + hostname);
        handler((modelNames: any) => {
            const sps = [];
            let last = "";
            for (const aModel in modelNames) {
                last = aModel;
            }
            for (const aModel in modelNames) {
                sps.push({
                    model: modelNames[aModel].id || "M000any",
                    name: aModel,
                    description: modelNames[aModel].description || "A model with no description",
                    comma: (aModel === last) ? "." : ", "
                });
            }
            const options = {
                title: "undefined",
                host: hostname,
                "oauth-request-token-uri": "token",
                "oauth-authorize-uri": "http://authoriser.opm.technion.ac.il",
                "oauth-access-token-uri": "opmToken",
                serviceProviderUrl: sps,
                serviceProvider: sps
            };
            console.log("catalog options: " + options);
            options.title = "Catalog";
            if (req.accepts("html"))
                res.render("oslc-catalog", options); // mergeTemplate(toHtml(catalogTemplate()), options)});
            else {
                res.set("Content-Type", "text/turtle");
                res.send(200, mergeTemplate(catalogTemplate(), options));
            }
        });
    };
};
