var os = require( 'os' )

/**
 * Pad a string to length `n` with `chr`
 * @param {String} str
 * @param {String} chr
 * @param {Number} n
 * @return {String}
 */
function pad( str, chr, n ) {
  while( str.length < n ) str = chr + str;
  return str.substring( str.length - n, str.length )
}

/**
 * Scuid
 * @constructor
 * @param {Object} [options]
 * @return {Scuid}
 */
function Scuid( options ) {

  if( !(this instanceof Scuid) )
    return new Scuid( options )

  options = options != null ? options : {}

  /** @type {String} Generated ID's prefix */
  this.prefix = options.prefix || Scuid.defaults.prefix
  /** @type {Number} Radix used in .toString() calls (2-36) */
  this.base = options.base || Scuid.defaults.base
  /** @type {Number} Block size to pad and trim to */
  this.blockSize = options.blockSize || Scuid.defaults.blockSize
  /** @type {Number} Maximum of discrete counter values */
  this.discreteValues = Math.pow( this.base, this.blockSize )

  /** @type {Number} Process ID */
  this.pid = options.pid || Scuid.defaults.pid
  /** @type {String} Host name */
  this.hostname = options.hostname || Scuid.defaults.hostname
  /** @type {String} Block padding character */
  this.fill = options.fill || Scuid.defaults.fill
  /** @type {Object} Random number generator */
  this.rng = options.rng || Scuid.defaults.rng

  /** @type {String} Generated process fingerprint */
  this._fingerprint = Scuid.fingerprint( this.pid, this.hostname )
  /** @type {Number} Internal counter for collision prevention */
  this._counter = 0

}

/**
 * Generate a 2 character host ID
 * @param {String} hostname
 * @return {String} hostid
 */
Scuid.hostId = function( hostname ) {

  var result = hostname.length + 36

  for( var i = 0; i < hostname.length; i++ ) {
    result += hostname.charCodeAt( i )
  }

  return pad( result.toString( 36 ), '0', 2 )

}

/**
 * Generate a 4 character process fingerprint
 * @param  {Number} [pid]
 * @param  {String} [hostname]
 * @return {String} fingerprint
 */
Scuid.fingerprint = function( pid, hostname ) {
  pid = pid == null ? process.pid : pid
  hostname = hostname == null ? os.hostname() : hostname
  return pad( pid.toString( 36 ), '0', 2 ) + Scuid.hostId( hostname )
}

/**
 * Default options
 * @type {Object}
 */
Scuid.defaults = {
  prefix: 'c',
  base: 36,
  blockSize: 4,
  fill: '0',
  pid: process.pid,
  hostname: os.hostname,
  rng: Math,
}

/**
 * Scuid prototype
 * @type {Object}
 * @ignore
 */
Scuid.prototype = {

  constructor: Scuid,

  /**
   * Get & advance the internal counter
   * @return {Number}
   */
  count: function() {
    this._counter = this._counter < this.discreteValues ?
      this._counter : 0
    return this._counter++
  },

  /**
   * Get the blocksize padded counter
   * @return {String}
   */
  counter: function() {
    return pad( this.count().toString( this.base ), this.fill, this.blockSize )
  },

  /**
   * Generate a block of `blockSize` random characters
   * @return {String}
   */
  randomBlock: function() {
    var block = this.rng.random() * this.discreteValues << 0
    return pad( block.toString( this.base ), this.fill, this.blockSize )
  },

  /**
   * Get the padded timestamp
   * @return {String}
   */
  timestamp: function() {
    return pad( Date.now().toString( this.base ), this.fill, 8 )
  },

  /**
   * Get the used process fingerprint
   * @return {String}
   */
  fingerprint: function() {
    return this._fingerprint
  },

  /**
   * Generate a (s)cuid
   * @return {String} id
   */
  id: function() {
    return this.prefix + this.timestamp() +
      this.counter() + this._fingerprint +
      this.randomBlock() + this.randomBlock()
  },

  /**
   * Generate a slug
   * @return {String} slug
   */
  slug: function() {
    return this.timestamp().slice( -2 ) +
      this.count().toString( this.base ).slice( -4 ) +
      this._fingerprint[0] +
      this._fingerprint[ this._fingerprint.length - 1 ] +
      this.randomBlock().slice( -2 )
  },

}

var instance = new Scuid()

// Exports
module.exports = function scuid() {
  return instance.id()
}

module.exports.slug = function slug() {
  return instance.slug()
}

module.exports.fingerprint = function() {
  return instance.fingerprint()
}

module.exports.createFingerprint = function( pid, hostname ) {
  return Scuid.fingerprint( pid, hostname )
}

module.exports.constructor = Scuid
module.exports.create = Scuid
