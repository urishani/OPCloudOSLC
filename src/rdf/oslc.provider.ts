export let providerTemplate = (type: string = 'turtle'): string => {
  const templates = {
    'turtle':
      `@prefix oslc: <http://open-service.net/ns/core#> .
@prefix oslc_am: <http://open-service.net/ns/am#1.0/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix foaf: <http://http://xmlns.com/foaf/0.1/> .
@prefix opm: <http://opm.technion.ac.il/opm#> .
@prefix model: <_host_/oslc/_model_/> .
# Provider:
model:serviceProvider
    a oslc:ServiceProvider ;
    oslc:service
      [ a oslc:Service ;
        oslc:domain oslc_am: ;
# No factory yet
#       oslc:creationFactory
#                [a oslc:CreationFactory ;
#                    oslc:creation model:resource ] ;
        oslc:queryCapability
          [ a oslc:QueryCapability ;
            oslc:queryBase model:resource ;
            oslc:resourceType oslc_am:Resource ;
            oslc:label "_name_" ;
            dcterms:title "_description_"
          ] ;
# No selection dialog yet
#          oslc:selectionDialog
#          [ a oslc:Dialog;
#            oslc:dialog <_host_/oslc/_model_/resource?action=ShowList>;
#            oslc:label "OPM OSLC Resource Picker";
#            oslc:resourceType <http://open-services.net/ns/am#Resource>;
#            dcterms:title "Browse Model Resources for model _model_"
#	      ]
	  ] ;
# Preferred prefixes for this provider:
_prefixDefinition_
    oslc:prefixDefinition
      [ a oslc:PrefixDefinition;
        oslc:prefix "_prefix_";
        oslc:prefixBase <_nameSpaceUri_>
      ]_semicolon_
_/prefixDefinition_
`,
    'xml':
      `
<?xml version="1.0" encoding="utf-8" ?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:oslc="http://open-service.net/ns/core#"
         xmlns:dcterms="http://purl.org/dc/terms/">

  <rdf:Description rdf:about="_hoist_/oslc/_model_/serviceProvider">
    <rdf:type rdf:resource="http://open-service.net/ns/core#ServiceProvider"/>
    <oslc:service>
      <oslc:Service>
        <oslc:domain rdf:resource="http://open-service.net/ns/am#"/>
        <oslc:queryCapability>
          <oslc:QueryCapability>
            <oslc:queryBase rdf:resource="_host_/oslc/_model_/resource"/>
            <oslc:resourceType rdf:resource="http://open-service.net/ns/am#1.0/Resource"/>
            <oslc:label>_name_</oslc:label>
            <dcterms:title>_description_</dcterms:title>
          </oslc:QueryCapability>
        </oslc:queryCapability>

      </oslc:Service>
    </oslc:service>

    _prefixDefinition_
    <oslc:prefixDefinition>
      <oslc:PrefixDefinition>
        <oslc:prefix>_prefix_</oslc:prefix>
        <oslc:prefixBase rdf:resource="_nameSpaceUri_"/>
      </oslc:PrefixDefinition>
    </oslc:prefixDefinition>
    _/prefixDefinition_

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
          "xsd": "http://www.w3.org/2001/XMLSchema#",
          "model": "_host_/oslc/_model_/"
        },
        "@graph": [
           {
              "@id": "model:serviceProvider",
              "@type": "oslc:ServiceProvider",
              "dcterms:description": "OPM OSLC AM projects hosted on this service provider.",
              "dcterms:title": "OPM OSLC service Provider for _model_",
              "oslc:service": { "@id": "_:b0" },
              _prefixDefinition_
              "oslc:prefixDefinition": { "@id": "_:b_prefixNum_" }_jsonComma_
              _/prefixDefinition_
           },
           {
             "@id": "_:b0",
             "@type": "oslc:service",
             "oslc:domain": "oslc_am",
             "oslc:queryCapability": { "@id": "_:b2" }
           },
           { 
             "@id": "_:b2",
             "@type": "oslc:queryCapability",
             "oslc:queryBase": "model:resource/",
             "oslc:resourceType": "oslc_am:Resource",
             "oslc:label "_name_",
             "dcterms:title "_description_"
           },
           {
             "@id": "_:b1",
             "@type": "oslc:prefixDefinition",
           },
           _prefixDefinition_
           {
              "@id": "_:b_prefixNum_",
              "@type": "oslc:prefixDefinition",
              "oslc:prefix": "_prefix_",
              "oslc:prefixBase":  "_nameSpaceUri_"
           } _jsonComma_
           _/prefixDefinition_
        ]        
      }
`
  };
    return templates[type]
};
