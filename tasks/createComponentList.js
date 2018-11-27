const gulp = require('gulp');
const config = require('./../config');
const find = require('find');
const fs = require('fs');

gulp.task('createComponentList', function (eb) {
  const componentList = {};
  find.eachfile(config.createComponentList.fileName, config.createComponentList.path, file => {
    fs.readFile(file,  (err, data) => {
      if(err) { 
        throw err; 
      }
      const componentData = JSON.parse(data).biotope;
      file = file.replace(config.createComponentList.fileName, '').replace(/\\/g, '/');
      componentData.path = file + (componentData.entryPoint || config.createComponentList.fallbackEntryPointName);
      componentData.url = (componentData.category).toLowerCase() + '.' + componentData.componentName + '.html';
      componentData.componentVariants.forEach((element, index) => {
        const cleanFileName = element.file.replace('.hbs', '');
        componentData.componentVariants[index].url = (componentData.category).toLowerCase() + '.' + componentData.componentName + '-' + cleanFileName.split('/')[cleanFileName.split('/').length-1] + '.html';
      });
      componentList[componentData.componentName] = componentData;
    });
  }).end(() => {
    config.createComponentList.componentListObject = componentList;
    fs.writeFile(config.createComponentList.outputFileName, JSON.stringify(config.createComponentList.componentListObject), 'utf8', (err) => {
      if(err) { 
        throw err;
      }
    });
    eb();
  });
});