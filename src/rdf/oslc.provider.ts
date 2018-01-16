export let providerTemplate = (): string => {
  return `@prefix oslc: <http://open-service.net/ns/core#> .
@prefix oslc_am: <http://open-service.net/ns/am#> .
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
            oslc:queryBase <_host_/oslc/_model_/resource> ;
            oslc:resourceType oslc_am:1.0/Resource ;
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
`;
};
