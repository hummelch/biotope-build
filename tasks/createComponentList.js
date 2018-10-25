const gulp = require('gulp');
const config = require('./../config');
let find = require('find');
let fs = require('fs');

gulp.task('createComponentList', function (eb) {
    let componentList = [];
    find.eachfile(config.createComponentList.fileName, config.createComponentList.path, file => {
        fs.readFile(file,  (err, data) => {
            if (err) throw err;
            let componentData = JSON.parse(data.toString());
            file = file.replace(config.createComponentList.fileName, '').replace(/\\/g, '/');
            componentData.biotope.path = file + (componentData.biotope.entryPoint || config.createComponentList.fallbackEntryPointName);
            componentData.biotope.url = (componentData.biotope.category).toLowerCase() + '.' + componentData.biotope.componentName + '.html';
            componentList.push(componentData);
        });
    }).end(() => {
        config.createComponentList.componentListObject.componentList = componentList;
        fs.writeFile(config.createComponentList.outputFileName, JSON.stringify(config.createComponentList.componentListObject.componentList), 'utf8', (err) => {
            if (err) throw err;
        });
        eb();
    });

});