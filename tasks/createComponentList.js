const gulp = require('gulp');
const config = require('./../config');
let find = require('find');
let fs = require('fs');

gulp.task('createComponentList', function () {
    const path = './src';
    const fileName = 'package.json';
    const fallbackEntryPointName = 'index.html';

    let componentList = [];
    find.eachfile(fileName, path, file => {
        fs.readFile(file,  (err, data) => {
            if (err) throw err;
            let componentData = JSON.parse(data.toString());
            file = file.replace(fileName, '').replace(/\\/g, '/');
            componentData.biotope.path = file + (componentData.biotope.entryPoint || fallbackEntryPointName);
            componentList.push(componentData);
        });
    }).end(() => {
        let componentJSON = {
            componentList: componentList
        }
        componentJSON = JSON.stringify(componentJSON);
        fs.writeFile('componentList.json', componentJSON, 'utf8', (err) => {
            if (err) throw err;
        });
    });
});