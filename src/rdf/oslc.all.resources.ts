export let allResourcesTemplate = (type:string='turtle'): string => {
  const templates = {
  'turtle':
  `@prefix oslc: <http://open-service.net/ns/core#> .
@prefix oslc_am: <http://open-service.net/ns/am#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix opm: <http://opm.technion.ac.il/opm#> .
@prefix resource: <_host_/oslc/_model_/resource> .
# Resources:
_elements_
resource:_id_ a opm:_type_ ;
  oslc:name "_id_" ;
  dcterms:title "_text_" ;
  dcterms:description "_description_" .
_/elements_
`,
'xml':
`<?xml version="1.0" encoding="utf-8" ?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:oslc="http://open-service.net/ns/core#"
         xmlns:dcterms="http://purl.org/dc/terms/">
_elements_
  <rdf:Description rdf:about="_host_/oslc/_model_/resource/_id_">
    <rdf:type rdf:resource="http://opm.technion.ac.il/_type_"/>
    <oslc:name>_id_</oslc:name>
    <dcterms:title>_text_</dcterms:title>
    <dcterms:description>_description_</dcterms:description>
  </rdf:Description>
  _/elements_
`};
return templates[type];
};
