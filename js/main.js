/*
  Central Package Loader

  Do NOT edit this file.
  All components are declared in "components.js"

  KULeuven/LIBIS (c) 2017
  Mehmet Celik
*/
"use strict";

import Components from './components'
import searchBarHTML from '../html/searchBar.html'

//Create the centralCustom module;
let app = angular.module('centralCustom',[])
                 .run(($templateCache) => {
                   $templateCache.put('components/search/searchBar/search-bar.html', searchBarHTML);
                 });

//Contains the after component selectors that will be injected
let afterComponents = {};

//Create all components and determine in which after component these need to be
//injected
console.log('Loading centralCustom components');
Components.all.forEach((component) => {
  if (component.appendTo) {
    let elements = afterComponents[component.appendTo] || [];
    elements.push(component.name);
    afterComponents[component.appendTo] = elements;
  }

  console.log(`\t\t${component.name}`);
  app.component(component.name.toCamelCase(), component.config);
});

//Inject place holders into the after components
Object.keys(afterComponents).forEach((component,i) => {
  let subComponents = afterComponents[component];

  app.component(component.toCamelCase(), {
    bindings:{
      parentCtrl: '<'
    },
    template: subComponents.map(m => `<${m} parent-ctrl="$ctrl"></${m}>`).join("")
  });
});
