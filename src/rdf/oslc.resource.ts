export let resourceTemplate = (): string => {
  return `@prefix oslc: <http://open-service.net/ns/core#> .
@prefix oslc_am: <http://open-service.net/ns/am#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix foaf: <http://http://xmlns.com/foaf/0.1/> .
@prefix opm: <http://opm.technion.ac.il/opm#> .
@prefix model: <_host_/oslc/_model_/> .
model:resource#_id_  a opm:_type_ ;
  oslc:name "_id_" ; 
  dcterms:title "_text_" ; 
  dcterms:description "_description_ _semicolon_
# Resources:
_properties_
  _property_ _value_ _semicolon_
_/properties_
`;
};
  

