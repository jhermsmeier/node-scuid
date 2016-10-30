var scuid = require( '..' )
var cuid = require( 'cuid' )

suite( 'scuid', function() {

  bench( 'id', function() {
    return scuid()
  })

  bench( 'slug', function() {
    return scuid.slug()
  })

  bench( 'fingerprint', function() {
    return scuid.fingerprint()
  })

})

suite( 'cuid', function() {

  bench( 'id', function() {
    return cuid()
  })

  bench( 'slug', function() {
    return cuid.slug()
  })

  bench( 'fingerprint', function() {
    return cuid.fingerprint()
  })

})
