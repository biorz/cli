const expect = require('chai').expect
const darr = require('../src/darr')()

describe('dobj', function(){
  let arr = [1, 2, [3, 4], 5, [6, 7 , 8, [9, [10]]]]
  it('get value by index', function() {
    expect(darr(arr, 0)).to.be.equal(1)
    expect(darr(arr, 3)).to.be.equal(3)
    expect(darr(arr, 11)).to.be.equal(9)
    expect(darr(arr, 12)).to.be.equal(arr[4][3][1])
  })
})