var bench = require( 'nanobench' )
var cuid = require( 'cuid' )

const ITERATIONS = 1000000

bench( `id ⨉ ${ITERATIONS}`, function( run ) {
  var id = ''
  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    id = cuid()
  }
  run.end()
})

bench( `slug ⨉ ${ITERATIONS}`, function( run ) {
  var id = ''
  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    id = cuid.slug()
  }
  run.end()
})

bench( `fingerprint ⨉ ${ITERATIONS}`, function( run ) {
  var id = ''
  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    id = cuid.fingerprint()
  }
  run.end()
})
