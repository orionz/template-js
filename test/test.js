const assert = require('assert')

describe('App', () => {
  let m
  beforeEach(() => {
    m = 123
  })

  describe('module', () => {
    it('should have tests', () => {
      assert.equal(m, 123)
    })
  })
})
