export let catalogTemplate = (type:string='turtle'): string => {
  const templates = {
    'turtle':
    `@prefix oslc: <http://open-service.net/ns/core#>.
@prefix oslc_am: <http://open-service.net/ns/am#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix dcterms: <http://purl.org/dc/terms/>.
@prefix foaf: <http://http://xmlns.com/foaf/0.1/> .
@prefix opm: <http://opm.technion.ac.il/opm#>.
# Catalog:
<_host_/oslc/catalog>
    a oslc:ServiceProviderCatalog ;
    dcterms:title "OPM OSLC Provider Catalog" ;
    dcterms:description "OPM OSLC AM projects hosted on this service provider." ;
    oslc:domain oslc_am: ;
    dcterms:publisher
       [ rdf:type oslc:Publisher ;
         dcterms:title "Object Process Methodology - OPM" ;
         dcterms:identifier "http://opm.technion.ac.il/opm#v2.0"
       ] ;
    oslc:oauthConfiguration
       [ rdf:type oslc:oauthConfiguration ;
         oslc:oauthRequestTokenURI <_oauth-request-token-uri_> ;
         oslc:authorizationURI <_oauth-authorize-uri_> ;
         oslc:oauthAccessTokenURI <_oauth-access-token-uri_>
       ] ;
# list all service providers urls (in our case: OPM projects):
    oslc:serviceProvider _serviceProviderUrl_
        <_host_/oslc/_model_/serviceProvider> _comma_  _/serviceProviderUrl_

 # End of the catalog.

# Service providers info: _serviceProvider_
<_host_/oslc/_model_/serviceProvider>
       a oslc:ServiceProvider ;
       dcterms:title "_name_" ;
       dcterms:description "_description_" .
_/serviceProvider_
`,
'xml':
`
<?xml version="1.0" encoding="utf-8" ?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:dcterms="http://purl.org/dc/terms/"
         xmlns:foaf="http://http://xmlns.com/foaf/0.1/"
         xmlns:oslc="http://open-service.net/ns/core#"
         xmlns:opm="http://opm.technion.ac.il/opm#"
         xmlns:oslc_am="http://open-service.net/ns/am#">
  <rdf:Description rdf:about="http://localhost:3000/oslc/catalog">
    <rdf:type rdf:resource="http://open-service.net/ns/core#ServiceProviderCatalog"/>
    <dcterms:title>OPM OSLC Provider Catalog</dcterms:title>
    <dcterms:description>OPM OSLC AM projects hosted on this service provider.</dcterms:description>
    <oslc:domain rdf:resource="http://open-service.net/ns/am#"/>
    <dcterms:publisher>
      <oslc:Publisher>
        <dcterms:title>Object Process Methodology - OPM</dcterms:title>
        <dcterms:identifier>http://opm.technion.ac.il/opm#v2.0</dcterms:identifier>
      </oslc:Publisher>
    </dcterms:publisher>

    <oslc:oauthConfiguration>
      <oslc:oauthConfiguration>
        <oslc:oauthRequestTokenURI rdf:resource="http://njh.me/token"/>
        <oslc:authorizationURI rdf:resource="http://authoriser.opm.technion.ac.il"/>
        <oslc:oauthAccessTokenURI rdf:resource="http://njh.me/opmToken"/>
      </oslc:oauthConfiguration>
    </oslc:oauthConfiguration>

    _serviceProviderUrl_ _/serviceProviderUrl_
    _serviceProvider_
    <oslc:serviceProvider>
      <oslc:serviceProvider rdf:about="_host_/oslc/_model_/serviceProvider">
        <dcterms:title>_name_</dcterms:title>
        <dcterms:description>_description_</dcterms:description>
      </oslc:serviceProvider>
    </oslc:serviceProvider>
    _/serviceProvider_
  </rdf:Description>
</rdf:RDF>
`,
'json':
`
{
  "@context": {
    "dcterms": "http://purl.org/dc/terms/",
    "foaf": "http://xmlns.com/foaf/0.1/",
    "opm": "http://opm.technion.ac.il/opm#",
    "oslc": "http://open-service.net/ns/core#",
    "oslc_am": "http://open-service.net/ns/am#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#"
  },
  "@graph": [
    {
      "@id": "_host_/oslc/catalog",
      "@type": "oslc:ServiceProviderCatalog",
      "dcterms:description": "OPM OSLC AM projects hosted on this service provider.",
      "dcterms:title": "OPM OSLC Provider Catalog",
      "oslc:domain": {
        "@id": "oslc_am:"
      },
      "dcterms:publisher": {
        "@id": "_:0001"
      },
      "oslc:oauthConfiguration": {
        "@id": "_:0002"
      },
      "oslc:serviceProvider": [
        _serviceProviderUrl_
        {
          "@id": "_host_/oslc/_model_/serviceProvider"
        }_jsonComma_
        _/serviceProviderUrl_
      ]
    },
    {
      "@id": "_:0001",
      "@type": "oslc:Publisher",
      "dcterms:identifier": "http://opm.technion.ac.il/opm#v2.0",
      "dcterms:title": "Object Process Methodology - OPM"
    },
    {
      "@id": "_:0002",
      "@type": "oslc:oauthConfiguration",
      "oslc:authorizationURI": {
        "@id": "http://authoriser.opm.technion.ac.il"
      },
      "oslc:oauthAccessTokenURI": {
        "@id": "http://njh.me/opmToken"
      },
      "oslc:oauthRequestTokenURI": {
        "@id": "http://njh.me/token"
      }
    },
    _serviceProvider_
    {
      "@id": "_host_/oslc/_model_/serviceProvider",
      "@type": "oslc:serviceProvider",
      "dcterms:description": "_description_",
      "dcterms:title": "_name_"
    }_jsonComma_
    _/serviceProvider_
  ]
}
`
      };
      return templates[type];
} ;
