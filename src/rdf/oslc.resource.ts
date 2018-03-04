export let resourceTemplate = (type:string='turtle'): string => {
  const templates= {
  'turtle':
  `@prefix oslc: <http://open-service.net/ns/core#> .
@prefix oslc_am: <http://open-service.net/ns/am#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix foaf: <http://http://xmlns.com/foaf/0.1/> .
@prefix opm: <http://opm.technion.ac.il/opm#> .
@prefix resource: <_host_/oslc/_model_/resource/> .
resource:_id_  a opm:_type_ ;
  oslc:name "_id_" ;
  dcterms:title "_text_" ;
  dcterms:description "_description_" _semicolon_
# Properties:
_properties_
  opm:_property_ "_value_" _semicolon_
_/properties_
`,
'xml':
`<?xml version="1.0" encoding="utf-8" ?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:oslc="http://open-service.net/ns/core#"
         xmlns:dcterms="http://purl.org/dc/terms/"
         xmlns:opm="http://opm.technion.ac.il/opm#"
         xmlns:resource="_host_/oslc/_model_/resource/">

  <rdf:Description rdf:about="_host_/oslc/_model_/resource/_id_">
    <rdf:type rdf:resource="http://opm.technion.ac.il/opm#_type_"/>
    <oslc:name>_id_</oslc:name>
    <dcterms:title>_text_</dcterms:title>
    <dcterms:description>_description_</dcterms:description>
    _properties_
    <opm:_property_>_value_</opm:_property_>
    _/properties_
  </rdf:Description>
</rdf:RDF>
`,
'json':
`
{ "_host_\/oslc\/_model_\/resource\/_id_":
  { "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type":
    [
      { "type": "uri",
        "value": "http:\/\/opm.technion.ac.il\/opm#_type_"
      }
    ],
    "http:\/\/open-service.net\/ns\/core#name":
    [
      { "type": "literal",
        "value": "_id_"
      }
    ],
    "http:\/\/purl.org\/dc\/terms\/title":
    [
      { "type": "literal",
        "value": "_text_"
      }
    ],
    "http:\/\/purl.org\/dc\/terms\/description":
    [
      { "type": "literal",
        "value": "_description_"
      }
    ]
    _properties_
    , "http:\/\/opm.technion.ac.il\/opm#_property_":
    [
      { "type": "literal",
        "value": "_value_"
      }
    ]
    _/properties_
  }
}
`
};
return templates[type];
};

