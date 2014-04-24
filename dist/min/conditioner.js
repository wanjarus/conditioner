!function(){"use strict";function t(){this._thens=[]}t.prototype={then:function(t,e){this._thens.push({resolve:t,reject:e})},resolve:function(t){this._complete("resolve",t)},reject:function(t){this._complete("reject",t)},_complete:function(t,e){this.then="resolve"===t?function(t){t(e)}:function(t,n){n(e)},this.resolve=this.reject=function(){throw new Error("Promise already completed.")};for(var n,o=0;n=this._thens[o++];)n[t]&&n[t](e);delete this._thens}};var e=function(e,n,o,i,s){var r=function(t,e){this._expression=t instanceof l||t instanceof r?t:null,this._config=this._expression?null:t,this._negate="undefined"==typeof e?!1:e};r.prototype.assignTester=function(t){this._expression=t},r.prototype.getConfig=function(){return this._config?[{expression:this,config:this._config}]:this._expression.getConfig()},r.prototype.succeeds=function(){return this._expression.succeeds?this._expression.succeeds()!==this._negate:!1},r.prototype.toString=function(){return(this._negate?"not ":"")+(this._expression?this._expression.toString():this._config.path+":{"+this._config.value+"}")};var l=function(t,e,n){this._a=t,this._operator=e,this._b=n};l.prototype.succeeds=function(){return"and"===this._operator?this._a.succeeds()&&this._b.succeeds():this._a.succeeds()||this._b.succeeds()},l.prototype.toString=function(){return"("+this._a.toString()+" "+this._operator+" "+this._b.toString()+")"},l.prototype.getConfig=function(){return[this._a.getConfig(),this._b.getConfig()]};var u={getExpressionsCount:function(t){return t.match(/(:\{)/g).length},fromString:function(t){var e,n,o,i,s,u,a,h,d,c,_=0,f="",p=[],g="",m=!1,b=!1,y=null,v=null,A=[],M=t.length;for(y||(y=p);M>_;_++)if(s=t.charCodeAt(_),123!==s)if(125===s&&(e=y.length-1,n=e+1,m="not"===y[e],n=m?e:e+1,y[n]=new r({path:f,value:g},m),f="",g="",m=!1,b=!1),b)g+=t.charAt(_);else{if(40===s&&(y.push([]),A.push(y),y=y[y.length-1]),32===s||0===_||40===s){if(o=t.substr(_,5).match(/and |or |not /g),!o)continue;h=o[0],d=h.length-1,y.push(h.substring(0,d)),_+=d}if(41===s||_===M-1)do if(v=A.pop(),0!==y.length){for(i=0,c=y.length;c>i;i++)"string"==typeof y[i]&&("not"===y[i]?(y.splice(i,2,new r(y[i+1],!0)),i=-1,c=y.length):"not"!==y[i+1]&&(y.splice(i-1,3,new l(y[i-1],y[i],y[i+1])),i=-1,c=y.length));1===y.length&&v&&(v[v.length-1]=y[0],y=v)}else y=v;while(_===M-1&&v)}else for(b=!0,f="",u=_-2;u>=0&&(a=t.charCodeAt(u),32!==a&&40!==a);)f=t.charAt(u)+f,u--;return 1===p.length?p[0]:p}},a={_tests:{},_createTest:function(t,e){if(!e.assert)throw new Error('TestRegister._addTest(path,config): "config.assert" is a required parameter.');var o=function(){};return o.supported="support"in e?e.support():!0,o._callbacks=[],o._ready=!1,o._setup=function(t){o.supported&&(o._callbacks.push(t.onchange.bind(t)),o._ready||(o._ready=!0,e.setup.call(o,o._measure)))},o._measure=function(t){var n="measure"in e?e.measure.call(o._measure,t):!0;if(n)for(var i=0,s=o._callbacks.length;s>i;i++)o._callbacks[i](t)},o.prototype.supported=function(){return o.supported},o.prototype.onchange=function(){n.publish(this,"change")},o.prototype.arrange=e.arrange?function(t,n){o.supported&&e.arrange.call(this,t,n)}:function(){o._setup(this)},e.measure&&(o.prototype.measure=e.measure),o.prototype.assert=e.assert,o},_findTest:function(t){return this._tests[t]},_storeTest:function(t,e){this._tests[t]=e},getTest:function(t,e){t="./tests/"+t,b.loader([t],function(n){var o=a._findTest(t);o||(o=a._createTest(t,n),a._storeTest(t,o)),e(new o)})}},h=function(t,e,o){this._test=t,this._expected=e,this._element=o,this._result=!1,this._changed=!0,this._onChangeBind=this._onChange.bind(this),n.subscribe(this._test,"change",this._onChangeBind),this._test.arrange(this._expected,this._element)};h.prototype={_onChange:function(){this._changed=!0},succeeds:function(){return this._changed&&(this._changed=!1,this._result=this._test.assert(this._expected,this._element)),this._result},destroy:function(){n.unsubscribe(this._test,"change",this._onChangeBind)}};var d={_options:{},_redirects:{},registerModule:function(t,e,n){this._options[b.loader.toUrl(t)]=e,n&&(this._redirects[n]=t),b.loader.config(t,e)},getRedirect:function(t){return this._redirects[t]||t},getModule:function(t){if(!t)throw new Error('ModuleRegistry.getModule(path): "path" is a required parameter.');return this._options[t]||this._options[b.loader.toUrl(t)]}},c=function(t,e,o,i){if(!t||!e)throw new Error('ModuleController(path,element,options,agent): "path" and "element" are required parameters.');this._path=d.getRedirect(t),this._alias=t,this._element=e,this._options=o||{},this._agent=i||p,this._Module=null,this._module=null,this._initialized=!1,this._onAgentReadyBind=this._onAgentReady.bind(this),this._onAgentStateChangeBind=this._onAgentStateChange.bind(this),this._agent.allowsActivation()?this._initialize():n.subscribe(this._agent,"ready",this._onAgentReadyBind)};c.prototype={hasInitialized:function(){return this._initialized},getModulePath:function(){return this._path},isModuleAvailable:function(){return this._agent.allowsActivation()&&!this._module},isModuleActive:function(){return null!==this._module},wrapsModuleWithPath:function(t){return this._path===t||this._alias===t},_onAgentReady:function(){this._initialize()},_initialize:function(){this._initialized=!0,n.subscribe(this._agent,"change",this._onAgentStateChangeBind),n.publishAsync(this,"init",this),this._agent.allowsActivation()&&this._onBecameAvailable()},_onBecameAvailable:function(){n.publishAsync(this,"available",this),this._load()},_onAgentStateChange:function(){var t=this._agent.allowsActivation();this._module&&!t?this._unload():!this._module&&t&&this._onBecameAvailable()},_load:function(){if(this._Module)return void this._onLoad();var t=this;b.loader.load([this._path],function(e){if(!e)throw new Error("ModuleController: A module needs to export an object.");t._Module=e,t._onLoad()})},_optionsToObject:function(t){if("string"==typeof t)try{return JSON.parse(t)}catch(e){throw new Error('ModuleController.load(): "options" is not a valid JSON string.')}return t},_parseOptions:function(t,e,n){var o,i,r=[],l={},u={};do o=d.getModule(t),r.push({page:o,module:e.options}),t=e.__superUrl;while(e=e.__super);for(i=r.length;i--;)l=s(l,r[i].page),u=s(u,r[i].module);return o=s(u,l),n&&(o=s(o,this._optionsToObject(n))),o},_onLoad:function(){if(this._agent.allowsActivation()){var t=this._parseOptions(this._path,this._Module,this._options);if("function"==typeof this._Module?this._module=new this._Module(this._element,t):(this._module=this._Module.load?this._Module.load(this._element,t):null,"undefined"==typeof this._module&&(this._module=this._Module)),!this._module)throw new Error('ModuleController.load(): could not initialize module, missing constructor or "load" method.');n.inform(this._module,this),n.publishAsync(this,"load",this)}},_unload:function(){return this._available=!1,this._module?(n.conceal(this._module,this),this._module.unload&&this._module.unload(),this._module=null,n.publishAsync(this,"unload",this),!0):!1},destroy:function(){this._unload(),n.unsubscribe(this._agent,"ready",this._onAgentReadyBind),n.unsubscribe(this._agent,"change",this._onAgentStateChangeBind),this._agent.destroy()},execute:function(t,e){if(!this._module)return{status:404,response:null};var n=this._module[t];if(!n)throw new Error('ModuleController.execute(method,params): function specified in "method" not found on module.');return e=e||[],{status:200,response:n.apply(this._module,e)}}};var _=function(){var t=function(t){return t.isModuleActive()},e=function(t){return t.isModuleAvailable()},s=function(t){return t.getModulePath()},r=function(t,e){if(!t)throw new Error('NodeController(element): "element" is a required parameter.');this._element=t,this._element.setAttribute(b.attr.processed,"true"),this._priority=e?parseInt(e,10):0,this._moduleControllers=[],this._moduleAvailableBind=this._onModuleAvailable.bind(this),this._moduleLoadBind=this._onModuleLoad.bind(this),this._moduleUnloadBind=this._onModuleUnload.bind(this)};return r.hasProcessed=function(t){return"true"===t.getAttribute(b.attr.processed)},r.prototype={load:function(){if(!arguments||!arguments.length)throw new Error("NodeController.load(controllers): Expects an array of module controllers as parameters.");this._moduleControllers=Array.prototype.slice.call(arguments,0);for(var t,e=0,o=this._moduleControllers.length;o>e;e++)t=this._moduleControllers[e],n.subscribe(t,"available",this._moduleAvailableBind),n.subscribe(t,"load",this._moduleLoadBind)},destroy:function(){for(var t=0,e=this._moduleControllers.length;e>t;t++)this._destroyModule(this._moduleControllers[t]);this._moduleControllers=[],this._updateAttribute(b.attr.initialized,this._moduleControllers),this._element.removeAttribute(b.attr.processed),this._element=null},_destroyModule:function(t){n.unsubscribe(t,"available",this._moduleAvailableBind),n.unsubscribe(t,"load",this._moduleLoadBind),n.unsubscribe(t,"unload",this._moduleUnloadBind),n.conceal(t,this),t.destroy()},getPriority:function(){return this._priority},getElement:function(){return this._element},matchesSelector:function(t,e){return e&&!o(e,this._element)?!1:i(this._element,t,e)},areAllModulesActive:function(){return this.getActiveModules().length===this._moduleControllers.length},getActiveModules:function(){return this._moduleControllers.filter(t)},getModule:function(t){return this._getModules(t,!0)},getModules:function(t){return this._getModules(t)},_getModules:function(t,e){if("undefined"==typeof t)return e?this._moduleControllers[0]:this._moduleControllers.concat();for(var n,o=0,i=this._moduleControllers.length,s=[];i>o;o++)if(n=this._moduleControllers[o],n.wrapsModuleWithPath(t)){if(e)return n;s.push(n)}return e?null:s},execute:function(t,e){return this._moduleControllers.map(function(n){return{controller:n,result:n.execute(t,e)}})},_onModuleAvailable:function(t){n.inform(t,this),this._updateAttribute(b.attr.loading,this._moduleControllers.filter(e))},_onModuleLoad:function(t){n.unsubscribe(t,"load",this._moduleLoadBind),n.subscribe(t,"unload",this._moduleUnloadBind),this._updateAttribute(b.attr.loading,this._moduleControllers.filter(e)),this._updateAttribute(b.attr.initialized,this.getActiveModules())},_onModuleUnload:function(t){n.subscribe(t,"load",this._moduleLoadBind),n.unsubscribe(t,"unload",this._moduleUnloadBind),n.conceal(t,this),this._updateAttribute(b.attr.initialized,this.getActiveModules())},_updateAttribute:function(t,e){var n=e.map(s);n.length?this._element.setAttribute(t,n.join(",")):this._element.removeAttribute(t)}},r}(),f=function(){if(!arguments||!arguments.length)throw new Error("SyncedControllerGroup(controllers): Expects an array of node controllers as parameters.");this._inSync=!1,this._controllers=1===arguments.length?arguments[0]:Array.prototype.slice.call(arguments,0),this._controllerLoadedBind=this._onLoad.bind(this),this._controllerUnloadedBind=this._onUnload.bind(this);for(var t,e=0,o=this._controllers.length;o>e;e++){if(t=this._controllers[e],!t)throw new Error("SyncedControllerGroup(controllers): Stumbled upon an undefined controller is undefined.");n.subscribe(t,"load",this._controllerLoadedBind),n.subscribe(t,"unload",this._controllerUnloadedBind)}this._test()};f.prototype={destroy:function(){for(var t,e=0,o=this._controllers.length;o>e;e++)t=this._controllers[e],n.unsubscribe(t,"load",this._controllerLoadedBind),n.unsubscribe(t,"unload",this._controllerUnloadedBind);this._controllers=[]},areAllModulesActive:function(){for(var t,e=0,n=this._controllers.length;n>e;e++)if(t=this._controllers[e],!this._isActiveController(t))return!1;return!0},_onLoad:function(){this._test()},_onUnload:function(){this._unload()},_isActiveController:function(t){return t.isModuleActive&&t.isModuleActive()||t.areAllModulesActive&&t.areAllModulesActive()},_test:function(){this.areAllModulesActive()&&this._load()},_load:function(){this._inSync||(this._inSync=!0,n.publishAsync(this,"load",this._controllers))},_unload:function(){this._inSync&&(this._inSync=!1,n.publish(this,"unload",this._controllers))}};var p={allowsActivation:function(){return!0},destroy:function(){}},g=function(t,e){"string"==typeof t&&t.length&&(this._suitable=!1,this._element=e,this._testers=[],this._onResultsChangedBind=this._onTestResultsChanged.bind(this),this._count=u.getExpressionsCount(t),this._expression=u.fromString(t),this._loadExpressionTests(this._expression.getConfig()))};g.prototype={allowsActivation:function(){return this._suitable},destroy:function(){for(var t=0,e=this._testers.length;e>t;t++)n.unsubscribe(this._testers[t],"change",this._onResultsChangedBind);this._testers=[],this._suitable=!1},_test:function(){var t=this._expression.succeeds();t!=this._suitable&&(this._suitable=t,n.publish(this,"change"))},_loadExpressionTests:function(t){for(var e=0,n=t.length;n>e;e++)Array.isArray(t[e])?this._loadExpressionTests(t[e]):this._loadTesterToExpression(t[e].config,t[e].expression)},_loadTesterToExpression:function(t,e){var o,i=this;a.getTest(t.path,function(s){o=new h(s,t.value,i._element),i._testers.push(o),e.assignTester(o),n.subscribe(s,"change",i._onResultsChangedBind),i._count--,0===i._count&&i._onReady()})},_onReady:function(){this._test(),n.publish(this,"ready")},_onTestResultsChanged:function(){this._test()}};var m=function(){this._nodes=[]};m.prototype={parse:function(t){if(!t)throw new Error('ModuleLoader.loadModules(context): "context" is a required parameter.');var e,n,o=t.querySelectorAll("[data-module]"),i=o.length,s=0,r=[];if(!o)return[];for(;i>s;s++)n=o[s],_.hasProcessed(n)||r.push(new _(n,n.getAttribute(b.attr.priority)));for(r.sort(function(t,e){return t.getPriority()-e.getPriority()}),s=r.length;--s>=0;)e=r[s],e.load.apply(e,this._getModuleControllersByElement(e.getElement()));return this._nodes=this._nodes.concat(r),r},load:function(t,e){if(!e)return null;e=e.length?e:[e];var n,o,i=0,s=e.length,r=[];for(n=new _(t);s>i;i++)o=e[i],r.push(this._getModuleController(o.path,t,o.options,o.conditions));return n.load(r),this._nodes.push(n),n},destroyNode:function(t){for(var e=this._nodes.length;e--;)if(this._nodes[e]===t)return this._nodes.splice(e,1),t.destroy(),!0;return!1},getNodes:function(t,e,n){if("undefined"==typeof t&&"undefined"==typeof e)return n?this._nodes[0]:this._nodes.concat();for(var o,i=0,s=this._nodes.length,r=[];s>i;i++)if(o=this._nodes[i],o.matchesSelector(t,e)){if(n)return o;r.push(o)}return n?null:r},_getModuleControllersByElement:function(t){var e,n,o,i=[],s=t.getAttribute(b.attr.module)||"",r=0,l=91===s.charCodeAt(0);if(l){try{e=JSON.parse(s)}catch(u){throw new Error('ModuleLoader.load(context): "data-module" attribute contains a malformed JSON string.')}if(!e)return[];for(o=e.length;o>r;r++)n=e[r],i.push(this._getModuleController(n.path,t,n.options,n.conditions))}else s.length&&i.push(this._getModuleController(s,t,t.getAttribute(b.attr.options),t.getAttribute(b.attr.conditions)));return i},_getModuleController:function(t,e,n,o){return new c(t,e,n,o?new g(o,e):p)}};var b={attr:{options:"data-options",module:"data-module",conditions:"data-conditions",priority:"data-priority",initialized:"data-initialized",processed:"data-processed",loading:"data-loading"},loader:{load:function(t,n){e(t,n)},config:function(t,e){var n={};n[t]=e,requirejs.config({config:n})},toUrl:function(t){return requirejs.toUrl(t)}},modules:{}},y=new m;return{init:function(t){return t&&this.setOptions(t),y.parse(document)},setOptions:function(t){if(!t)throw new Error('Conditioner.setOptions(options): "options" is a required parameter.');var e,n,o,i;b=s(b,t);for(n in b.modules)b.modules.hasOwnProperty(n)&&(o=b.modules[n],i="string"==typeof o?o:o.alias,e="string"==typeof o?null:o.options||{},d.registerModule(n,e,i))},parse:function(t){if(!t)throw new Error('Conditioner.parse(context): "context" is a required parameter.');return y.parse(t)},load:function(t,e){return y.load(t,e)},sync:function(){var t=Object.create(f.prototype);return f.apply(t,1!==arguments.length||arguments.slice?arguments:arguments[0]),t},getNode:function(t,e){return y.getNodes(t,e,!0)},getNodes:function(t,e){return y.getNodes(t,e,!1)},destroyNode:function(t){return y.destroyNode(t)},getModule:function(t,e,n){for(var o,i=0,s=this.getNodes(e,n),r=s.length;r>i;i++)if(o=s[i].getModule(t))return o;return null},getModules:function(t,e,n){for(var o,i=0,s=this.getNodes(e,n),r=s.length,l=[];r>i;i++)o=s[i].getModules(t),o.length&&(l=l.concat(o));return l},test:function(e){var n=new t;return setTimeout(function(){n.resolve(e?!0:!1)},500),n}}};if("undefined"!=typeof module&&module.exports)module.exports=e(require,require("./utils/Observer"),require("./utils/contains"),require("./utils/matchesSelector"),require("./utils/mergeObjects"));else{if("function"!=typeof define||!define.amd)throw new Error("To use ConditionerJS you need to setup a module loader like RequireJS.");define(["require","./utils/Observer","./utils/contains","./utils/matchesSelector","./utils/mergeObjects"],e)}}();