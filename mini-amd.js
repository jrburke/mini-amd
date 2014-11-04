/*jshint browser: true */
var require, define;
(function() {
  'use strict';

  var registry = {};

  function hasId(id) {
    return registry.hasOwnProperty(id);
  }

  function makeRequire(id) {
    var req = function(dep) {
      if (hasId(dep)) {
        return registry[dep];
      } else {
        throw new Error(dep + ' not loaded yet. Add a script tag for it');
      }
    };

    return req;
  }

  define = function(id, deps, fn) {
    if (Array.isArray(id)) {
      fn = deps;
      deps = id;
      id = null;
    } else if (typeof id === 'function') {
      fn = id;
      id = deps = null;
    }

    if (!id) {
      id = document.currentScript.dataset.moduleid;
    }

    if (!id) {
      throw new Error('No ID for define');
    }

    var exports = registry[id] = {};
    var mod = {
      id: id,
      exports: exports
    };

    if (!deps) {
      deps = [makeRequire(id), exports, mod];
    } else {
      deps = deps.map(function(id) {
        return registry[id];
      });
    }

    var result = fn.apply(exports, deps);

    if (result !== undefined) {
      registry[id] = result;
    } else if (mod.exports !== exports) {
      registry[id] = mod.exports;
    }
  };

  require = function(id) {
    return registry[id];
  };
}());
