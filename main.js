function crestat() {
  return {
    data: new Map(),
    set: set,
    get: get,
    attach: attach,
    load: load,
    state: state,
    toJSON: toJSON
  };
}

function set(key, value) {
  var data = this.state(key);
  data.value = value;
  data.subscribers = data.subscribers.filter(function(s) {
    s(value) !== null;
  });
}

function get(key) {
  return this.state(key).value;
}

function attach(key, elem, attr) {
  var data = this.state(key);
  if (typeof elem === "function") data.subscribers.push(elem);
  else if (typeof elem === "string")
    data.subscribers.push(function(newVal) {
      var elements = document.querySelectorAll(elem);
      for (var x = 0, len = elements.length; x < len; x++) {
        elements[x][attr] = newVal;
      }
    });
  else
    data.subscribers.push(function(newVal) {
      if (elem.parentElement || elem instanceof Element === false)
        elem[attr] = newVal;
      else return null;
    });
}

function state(key) {
  var data = this.data.get(key);
  if (data) return data;
  else {
    var obj = {
      crestat: true,
      subscribers: []
    };
    this.data.set(key, obj);
    return obj;
  }
}

function load(object) {
  if (typeof object !== "object" || Array.isArray(object))
    throw new Error("Only objects can be loaded!");
  for (var id in object) {
    this.set(id, object[id]);
  }
}

function toJSON() {
  var obj = {};
  this.data.forEach(function(val, key) {
    obj[key] = val.value;
  });
  return obj;
}

crestat.global = crestat();

module.exports = crestat;
