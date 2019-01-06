/**
 * get index by deep array
 * @param arr
 * @param idx
 * @returns {*}
 */

let darr = () => {
  let list = [],
    cache = [],
    index,
    cur;

  return function next(arr, idx, ignore, head) {
    if (!~(index = list.indexOf(arr))) {
      list.push(arr);
      index = list.length - 1;
    }
    cur = cache[index] || (cache[index] = []);

    if (idx < 0) idx += next(arr).index;
    if (idx < cur.length) return cur[idx];

    head = head || { index: 0, done: false };

    let i = 0,
      len = arr.length,
      val,
      rst;

    for (; i < len && !head.done; i++) {
      val = arr[i];
      if (!Array.isArray(val) || !ignore) {
        if (head.index === cache.length) cur.push(val);

        if (idx !== undefined && idx === head.index) {
          head.done = true;
          return val;
        }

        head.index++;
      }
      rst = next(val, idx, ignore, head);
    }

    return rst === undefined ? head : rst;
  };
};

if (require.main !== module) {
  module.exports = darr;
} else {
  let arr = [1, 2, [3, 4], 5, [6, 7, 8, [9, [10]]]];
  let d = darr();
  console.log("result", d(arr, 12, true));
  console.log("result", d(arr, 13));
}
