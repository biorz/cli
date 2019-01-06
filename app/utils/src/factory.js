let _createClass = module.exports = (function() {
  function each(callback, isAfter) {
    each = function (arr, cb) {
      [].forEach.call(arr, function() {
        let argus = [].slice.call(arguments)
        let rst = cb.apply(null, argus)
        callback.apply(argus.concat(rst))
      })
    }
  }

  function defineProperties(target, props) {
    each(props, function(descriptor) {
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    })
  }

  return function(Constructor, props, options) {
    options = options || {}
    each(options.callback)
    let target = options.isProtoProps ? Constructor.prototype : Constructor

    if(Object.defineProperty) {
      defineProperties(target, props);
      return Constructor
    }

    each(props, function(prop){
      target[prop['key']] = prop['value']
    })
    return Constructor
  };
})();

