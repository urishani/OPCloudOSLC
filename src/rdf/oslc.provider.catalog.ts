export let catalogTemplate = (): string => {
  return `@prefix oslc: <http://open-service.net/ns/core#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix dcterms: <http://purl.org/dc/terms/>.
@prefix opm: <http://opm.technion.ac.il/opm#>.
# Catalog:
<_host_/oslc/catalog>
    a oslc:ServiceProviderCatalog;
    dcterms:title "OPM OSLC Provider Catalog";
    dcterms:description "OPM OSLC AM projects hosted on this service provider.";
    oslc:domain <http://open-services.net/ns/am#>;
    dcterms:publisher
       [ rdf:type oslc:Publisher;
         dcterms:title "Object Process Methodology - OPM";
         oslc:    "OPM";
         dcterms:identifier "http://opm.technion.ac.il/opm#v2.0"
       ];
    oslc:oauthConfiguration
       [ rdf:type oslc:OAuthConfiguration;
         oslc:oauthRequestTokenURI <_oauth-request-token-uri_>;
         oslc:authorizationURI <_oauth-authorize-uri_>;
         oslc:oauthAccessTokenURI <_oauth-access-token-uri_>
       ];
# list all service providers urls (in our case: OPM projects):
    oslc:serviceProvider _serviceProviderUrl_
        <_host_/oslc/_model_/serviceProvider> _comma_  _/serviceProviderUrl_

 # End of the catalog.

# Service providers info: _serviceProvider_
<_host_/oslc/_model_/serviceProvider>
       a oslc:ServiceProvider;
       dcterms:title "_name_";
       dcterms:description "_description_".
_/serviceProvider_
`;
};
