var util = require('util');

var DefaultRegistry = require('undertaker-registry');

function BiotopeRegistry(){
  DefaultRegistry.call(this);
}

util.inherits(BiotopeRegistry, DefaultRegistry);

BiotopeRegistry.prototype.init = function(taker){

  taker.task('serve2', (done) => {
    console.log('SERVE'); done();
  });

};


module.exports = new BiotopeRegistry();
