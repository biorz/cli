let upperFirst = (str) => {
  return str.replace(/( |^)[a-z]/g, (s) => s.toUpperCase())
}


let convert = (obj, max) => {
  max = max || 2
  let glob = typeof(global) !== 'undefined'? global: window
  let refer = ['object', 'array', 'function']
  let cache = []
  let rst = {};
  
  ;(function itera(rst, obj, idx) {
    if(!~refer.indexOf(typeof(rst))) return

    idx = idx || 1

    for(let k in obj) {
      let kind;
      let index;

      if(idx >= max) {
        rst[k] = '__limit:'+ max +'__'
        continue
      }

      if(obj.hasOwnProperty(k)) {
        if(~(kind = refer.indexOf(typeof(obj[k])))) {
          rst[k] = new glob[upperFirst(refer[kind])]

          if(~(index = cache.findIndex(c => c[1] === obj[k]))) {
            rst[k] = '__repeat:' + cache[index][0] + '__'
            continue
          }

          cache.push([k, obj[k]])

          itera(rst[k], obj[k], ++idx)
        }
        else rst[k] = obj[k]
      }
    }
  })(rst, obj)

  return rst
}

let toString = {
  indent: ' ',

  each(objlike, cb) {
    if(Array.isArray(objlike)) {
      objlike.forEach((it, i) => {
        cb(it, i)
      })
      return
    }

    for(let k in objlike) {
      cb(objlike[k], i)
    }
  },

  render (tree, indent)  {
    let str = ""
    let isArray = Array.isArray(tree)
    let mark = isArray ? ['[', ']'] : ['{', '}']

    if (indent) {
      str += "  {\n";
    }

    each((it, i) => {
      str += this.getIndent(indent);
      str += i + ':';

      if(it instanceof Object) {
        str += this.render(it, indent + 1)
        return
      }
      str += it
    })

    if (indent) {
      str += this.getIndent(indent - 1) + "}\n";
    }

    return str;
  },

  getIndent (size) {
    return this.indent.repeat(size);
  }
}

if(require.main === module) {
  let d = {}
  let obj = {
    a: {
      b: {
        c: d,
        e: d
      }
    }
  }

  console.log(convert(obj))
}

