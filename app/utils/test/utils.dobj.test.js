const expect = require("chai").expect;
const dobj = require("../src/dobj")();

describe("dobj", function() {
  let obj = {a: 1, b: {c: { d: 2}}};
  
  it("set", function() {
    let rst = dobj.set(obj, "a.b.c", 1);
    expect(obj.a).to.be.equal(1);
    expect(rst).to.be.equal(1);
  });

  it("set by overwrite", function() {
    let rst = dobj.set(obj, "a.b.c", 1, true);
    expect(typeof obj.a).to.be.equal("object");
    expect(obj.a.b.c).to.be.equal(1);
  });
});
