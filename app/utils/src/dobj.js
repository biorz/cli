let set = function(obj, keys, val, isOverwrite) {
  keys.split && (keys = keys.split("."));
  let i = 0,
    l = keys.length,
    t = obj,
    x;

  for (; i < l - 1; ++i) {
    x = t[keys[i]];
    t = t[keys[i]] =
      x instanceof Object || !(x === undefined || isOverwrite) ? x : {};
  }
  return (t[keys[i]] = val);
};

let get = function(obj, keys, val) {
  keys.split && (keys = keys.split("."));
  let i = 0,
    l = keys.length,
    t = obj;

  for (; i < l - 1; ++i) {
    t = t[keys[i]];
    if (!(t instanceof Object)) {
      return undefined;
    }
  }
  return t[keys[i]];
};

module.exports = {
  set,
  get
};
