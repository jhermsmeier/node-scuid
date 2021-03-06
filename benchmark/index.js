var bench = require( 'nanobench' )
var scuid = require( '..' )

const ITERATIONS = 1000000

bench( `id ⨉ ${ITERATIONS}`, function( run ) {
  var id = ''
  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    id = scuid()
  }
  run.end()
})

bench( `slug ⨉ ${ITERATIONS}`, function( run ) {
  var id = ''
  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    id = scuid.slug()
  }
  run.end()
})

bench( `fingerprint ⨉ ${ITERATIONS}`, function( run ) {
  var id = ''
  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    id = scuid.fingerprint()
  }
  run.end()
})
