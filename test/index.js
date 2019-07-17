var test = require( 'tape-catch' )
var scuid = require( '..' )

function collide( fn, iterations ) {

  var ids = {}
  var pass = true
  var id = ''

  for( var i = 0; i < iterations; i++ ) {
    id = fn()
    if( ids[ id ] == null ) {
      ids[ id ] = id
    } else {
      pass = false
      break
    }
  }

  return pass

}

test( 'scuid', function( assert ) {

  assert.equal( typeof scuid, 'function', 'is a function' )
  assert.equal( typeof scuid(), 'string', 'returns a string' )
  assert.equal( scuid().length, 3 * 8 + 1, 'ID should be 25 chars long' )

  assert.test( 'slug', function( assert ) {
    assert.equal( typeof scuid.slug, 'function', 'is a function' )
    assert.equal( typeof scuid.slug(), 'string', 'returns a string' )
    assert.ok( scuid.slug().length <= 10 && scuid.slug().length >= 7, 'slug should be between 7 & 10 chars long' )
    assert.end()
  })

  assert.end()

})

test( 'createFingerprint', function (assert) {

  assert.equal( typeof scuid.createFingerprint, 'function', 'is a function' )

  var fingerprint = scuid.createFingerprint()
  assert.equal( typeof fingerprint, 'string', 'returns a string (with no args)' )
  assert.equal( fingerprint.length, 4, 'fingerprint should be 4 chars long (with no args)' )

  fingerprint = scuid.createFingerprint(2)
  assert.equal( typeof fingerprint, 'string', 'returns a string (with pid arg)' )
  assert.equal( fingerprint.length, 4, 'fingerprint should be 4 chars long (with pid arg)' )

  fingerprint = scuid.createFingerprint(2, 'hi')
  assert.equal( typeof fingerprint, 'string', 'returns a string (with pid and hostname args)' )
  assert.equal( fingerprint.length, 4, 'fingerprint should be 4 chars long (with pid and hostname args)' )

  // mimic fingerprint of 4 processes with consecutive pids on same host
  // note that the pids should be larger than 1296 (36 * 36)
  var hostname = 'somerandomhostname'
  for( var pid = 28631; pid < 28634; pid++ ) {
    assert.notEqual( scuid.createFingerprint(pid, hostname), scuid.createFingerprint(pid + 1, hostname), 'fingerprint for consecutive pids on same host should be different: ' + pid + ' and ' + (pid + 1) )
  }

  assert.end()

})

test( 'collision resistance', function( assert ) {

  assert.ok( collide( scuid, 2000000 ), 'IDs should not collide within at least 2 million' )
  assert.ok( collide( scuid.slug, 1000000 ), 'slugs should not collide within at least 1 million' )
  assert.end()

})
