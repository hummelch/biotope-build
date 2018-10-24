const gulp = require('gulp');
const config = require('./../config');
let find = require('find');
let fs = require('fs');

gulp.task('createComponentList', function () {
    let componentList = []
    find.eachfile(config.createComponentList.fileName, config.createComponentList.path, file => {
        fs.readFile(file,  (err, data) => {
            if (err) throw err;
            let componentData = JSON.parse(data.toString());
            file = file.replace(config.createComponentList.fileName, '').replace(/\\/g, '/');
            componentData.biotope.path = file + (componentData.biotope.entryPoint || config.createComponentList.fallbackEntryPointName);
            componentList.push(componentData);
        });
    }).end(() => {
        let componentListObject = {
            componentList: []
        }
        componentListObject.componentList = JSON.stringify(componentList);
        fs.writeFile(config.createComponentList.outputFileName, componentListObject, 'utf8', (err) => {
            if (err) throw err;
        });
    });
});