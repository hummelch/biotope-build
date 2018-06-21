// const gulp = require('gulp');

const runSequence = (gulp, ...args) => {
  // console.log(args);
  // args.forEach((value, index) => console.log(index, value));
  const tasks = args.map(item => {
    console.log(item);
    return (item instanceof Array) ? gulp.parallel(...item) : item;
  });
  console.log(tasks);
  return gulp.series(...tasks);
};


module.exports = runSequence;
// module.exports = runSequence.bind(null, undefined);
// module.exports.use = function(gulp) {
// 	return runSequence.bind(null, gulp);
// };
