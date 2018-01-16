export let allResourcesTemplate = (): string => {
  return `@prefix oslc: <http://open-service.net/ns/core#> .
@prefix oslc_am: <http://open-service.net/ns/am#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix opm: <http://opm.technion.ac.il/opm#> .
@prefix model: <_host_/oslc/_model_/> .
# Resources:
_elements_
model:resource#_id_ a opm:_type_ ;  
  oslc:name "_id_" ; 
  dcterms:title "_name_" ; 
  dcterms:description "_description_ .
_/elements_
`;
};
