const gulp = require('gulp');
const config = require('./../config');
const globule = require('globule');
const fs = require('fs-extra');
const path = require('path');
const nestedProp = require('nested-property');
const camelCase = require('camelcase');

const handlebars = require('handlebars');
const templates = {};
const globalData = {};

let templateGlobPatterns = [
  path.join(config.global.cwd, config.global.src, 'browserSupport.hbs'),
  path.join(config.global.cwd, config.global.src, 'style-guide.hbs'),
  path.join(config.global.cwd, config.global.src, 'index.hbs')
];

const partialGlobPatterns = [
  path.join(config.global.cwd, config.global.src, '**', '*.hbs'),
  '!' + path.join(config.global.cwd, config.global.src, 'pages', '**', '*.hbs'),
  '!' + path.join(config.global.cwd, config.global.src, 'index.hbs'),
  '!' + path.join(config.global.cwd, config.global.src, 'style-guide.hbs'),
  '!' + path.join(config.global.cwd, config.global.src, 'browserSupport.hbs')
];

const jsonGlobPatterns = [
  path.join(config.global.cwd, config.global.src, '**', '*.json')
];

const iconGlobPatterns = [
  path.join(config.global.cwd, config.global.src, 'resources', 'icons', '*.svg')
];

const loadTemplates = () => {
  pathWithBioObject = {};
  templateGlobPatterns = globule.find(templateGlobPatterns);
  templateGlobPatterns.forEach((element) => {
    pathWithBioObject[element] = {isComponent: false};
  });

  for(key in config.createComponentList.componentListObject) {
    const component = config.createComponentList.componentListObject[key];
    const componentPath = path.join(config.global.cwd, component.path);
    const cleanComponentPath = globule.find(componentPath);
    if(cleanComponentPath.length) {
      pathWithBioObject[cleanComponentPath] = component;
    }
    templateGlobPatterns.push(componentPath);
  }

  for (var key in pathWithBioObject) {
    loadTemplate(key, pathWithBioObject[key]);
  } 
};

const loadTemplate = (filePath, bioObject) => {
  if(bioObject.hasOwnProperty('isComponent')) {
    const frontMatter = require('front-matter');
    templates[filePath] = frontMatter(fs.readFileSync(filePath, 'utf8'));
    templates[filePath].outputName = templates[filePath].attributes.title;
  } else {
    const componentPath = bioObject.path.replace('src/', '').replace('.hbs', '');
    templates[filePath] = {'title': bioObject.componentName, 'description': bioObject.description, 'variant': false, 'category': bioObject.category, 'outputName': (bioObject.category).replace(' ', '_').toLowerCase() + '.' + bioObject.componentName.toLowerCase()};
    templates[filePath].body = '{{> '+ bioObject.layout +'\r\n\tcontentMain=\"' + componentPath + '\"\r\n}}\r\n';
    const completeComponentPath = filePath.substr(0, filePath.lastIndexOf('/'));
    const componentRootPath = componentPath.substr(0, componentPath.lastIndexOf('/'));

    bioObject.componentVariants.forEach((variant) => {
      const cleanFileName = variant.file.replace('.hbs', '');
      const variantPath = componentRootPath + '/' + variant.file.replace('.hbs', '');
      const mergedVariantPath = completeComponentPath + '/' + cleanFileName;
      const outputVariantName =  (bioObject.category).toLowerCase() + '.' + bioObject.componentName.replace(' ', '_').toLowerCase() + '-' + cleanFileName.split('/')[cleanFileName.split('/').length-1];
      templates[mergedVariantPath] = {'title': variant.name, 'description': variant.description, 'variant': true, 'category': bioObject.category,  'outputName': outputVariantName};
      const layout = 'layouts/layout.style-guide';
      templates[mergedVariantPath].body = '{{> '+ layout +'\r\n\tcontentMain=\"' + variantPath + '\"\r\n}}\r\n';
      templates[mergedVariantPath].precompiled = handlebars.compile(
        templates[mergedVariantPath].body
      );
    });
  }

  templates[filePath].precompiled = handlebars.compile(
    templates[filePath].body
  );

};

const removeTemplate = filePath => {
  if (templates.hasOwnProperty(filePath)) {
    delete templates[filePath];
  }
};

const loadPartials = () => {
  const paths = globule.find(partialGlobPatterns);
  for (const filePath of paths) {
    loadPartial(filePath);
  }
};

const loadPartial = filePath => {
  handlebars.registerPartial(
    transformCwdPathToPartialName(filePath),
    handlebars.compile(fs.readFileSync(filePath, 'utf8'))
  );
};

const removePartial = filePath => {
  handlebars.unregisterPartial(transformCwdPathToPartialName(filePath));
};

const loadHelpers = () => {
  const bioHelpers = require('./../lib/hb2-helpers');
  bioHelpers(handlebars);

  if (config.global.handlebarsHelper) {
    const projectHbsHelpersPath = path.join(
      config.global.cwd,
      config.global.src,
      config.global.resources,
      config.global.handlebarsHelper
    );

    try {
      const projectHelpers = require(projectHbsHelpersPath);
      projectHelpers(handlebars);
    } catch (e) {
      const colors = require('colors/safe');
      console.log(
        colors.yellow(
          `static:hb: Trying to load "${projectHbsHelpersPath}" into helpers.\n${
            e.message
          }\nSee global.handlebarsHelper property in https://github.com/biotope/biotope-build/blob/master/config.js`
        )
      );
    }
  }
};

const loadJsonData = () => {
  // load package.json
  const packagePath = path.join(config.global.cwd, 'package.json');
  const packageData = require(packagePath);
  nestedProp.set(
    globalData,
    [config.global.dataObject, 'package'].join('.'),
    packageData
  );

  // load browser support data
  if (config.browserSupport.file) {
    try {
      const browserSupportData = require(config.browserSupport.file);
      nestedProp.set(
        globalData,
        config.browserSupport.property,
        browserSupportData
      );
    } catch (e) { }
  }

  // load JSON files
  const jsonFiles = globule.find(jsonGlobPatterns);
  for (const filePath of jsonFiles) {
    loadJsonFile(filePath);
  }
};

const loadJsonFile = filePath => {
  try {
    const jsonContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const objectPropertyPath = transformCwdFilePathToObjectPropertyPath(
      filePath
    );
    nestedProp.set(
      globalData,
      [config.global.dataObject, objectPropertyPath].join('.'),
      jsonContent
    );
  } catch (e) {
    const colors = require('colors/safe');
    console.log(
      colors.red(`hbs:error loading JSON file "${filePath}": "${e.message}"`)
    );
  }
};

const loadIconData = () => {
  const iconFiles = globule.find(iconGlobPatterns);
  const iconData = [];

  for (const iconPath of iconFiles) {
    const parsedIconPath = path.parse(iconPath);
    iconData.push(parsedIconPath.name.toLowerCase());
  }

  nestedProp.set(
    globalData,
    [config.global.dataObject, 'icons'].join('.'),
    iconData
  );
};

const loadIndexrData = () => {
  nestedProp.set(
    globalData,
    [config.global.dataObject, 'indexr'].join('.'),
    prepareTemplateDataForIndexr()
  );
};

const loadEnvData = () => {
  const setupEnvVars = require('../lib/env-helper');
  const pathToEnvObject = [config.global.dataObject, 'env'].join('.');
  const existingEnvData = nestedProp.get(
    globalData,
    pathToEnvObject
  ) || {};
  const envData = Object.assign({}, existingEnvData, setupEnvVars(false));

  nestedProp.set(
    globalData,
    pathToEnvObject,
    envData
  );
};

const renderTemplate = templatePath => {
  const templateContent = templates[templatePath];

  // Extend global data with site specific data
  nestedProp.set(
    globalData,
    [config.global.dataObject, config.frontMatter.property].join('.'),
    templateContent.attributes
  );

  try {
    const content = templateContent.precompiled(globalData);
    const parsedPath = path.parse(templatePath);
    const targetPath = path.join(
      config.global.cwd,
      config.global.dev,
      `${templateContent.outputName}.html`
    );

    fs.ensureDirSync(path.parse(targetPath).dir);
    fs.writeFileSync(targetPath, content);
  } catch (e) {
    const colors = require('colors/safe');
    console.log(colors.red(`hbs:error "${templatePath}": "${e.message}"`));
  }
};

gulp.task('init:hb2', cb => {
  loadHelpers();
  loadTemplates();
  loadPartials();
  loadJsonData();
  loadIconData();
  loadIndexrData();
  loadEnvData();
  cb();
});

gulp.task('static:hb2', cb => {
  for (const templatePath in templates) {
    renderTemplate(templatePath);
  }

  cb();
});

gulp.task('watch:templates:hb2', () => {
  const runSequence = require('run-sequence');
  const watch = require('gulp-watch');

  watch(templateGlobPatterns, config.watch, function (vinyl) {
    let path = vinyl.path;

    if (config.global.isWin) {
      path = normalizeWinPath(path);
    }

    switch (vinyl.event) {
    case 'unlink':
      removeTemplate(path);
      break;

    default:
      loadTemplate(path);
    }

    loadIndexrData();
    runSequence('static:hb2', 'livereload');
  });
});

gulp.task('watch:partials:hb2', () => {
  const runSequence = require('run-sequence');
  const watch = require('gulp-watch');

  watch(partialGlobPatterns, config.watch, function (vinyl) {
    switch (vinyl.event) {
    case 'unlink':
      removePartial(vinyl.path);
      break;

    default:
      loadPartial(vinyl.path);
    }

    runSequence('static:hb2', 'livereload');
  });
});

gulp.task('watch:jsons:hb2', () => {
  const runSequence = require('run-sequence');
  const watch = require('gulp-watch');

  watch(jsonGlobPatterns, config.watch, function (vinyl) {
    switch (vinyl.event) {
    case 'unlink':
      const colors = require('colors/safe');
      console.log(
        colors.yellow(
          `Runtime removal of JSON files is not yet implemented. Go for it... (${
            vinyl.path
          } was removed)`
        )
      );
      break;

    default:
      loadJsonFile(vinyl.path);
    }

    runSequence('static:hb2', 'livereload');
  });
});

gulp.task('watch:icons:hb2', () => {
  const runSequence = require('run-sequence');
  const watch = require('gulp-watch');

  watch(iconGlobPatterns, config.watch, function () {
    loadIconData();
    runSequence('static:hb2', 'livereload');
  });
});

const getRelativePathToCwdSource = filePath => {
  const cwdSourcePath = path.join(config.global.cwd, config.global.src);
  return path.relative(cwdSourcePath, filePath);
};

const removeExtensionFromPath = filePath => {
  const parsedPath = path.parse(filePath);
  return path.join(parsedPath.dir, parsedPath.name);
};

const transformCwdPathToPartialName = filePath => {
  const pathWithoutExtension = removeExtensionFromPath(filePath);
  return getRelativePathToCwdSource(pathWithoutExtension).replace(/\\/g, '/');
};

const transformCwdFilePathToObjectPropertyPath = filePath => {
  const partialFilePath = transformCwdPathToPartialName(filePath);
  return partialFilePath
    .replace(/\\/g, '/')
    .split('/')
    .map(folder => camelCase(folder))
    .join('.');
};

const normalizeWinPath = filePath => {
  return filePath.replace(/\\/g, '/');
};

const prepareTemplateDataForIndexr = () => {
  const sortedTemplates = [];
  const blacklistedTemplates = [
    normalizeWinPath(
      path.join(config.global.cwd, config.global.src, 'index.hbs')
    ),
    normalizeWinPath(
      path.join(config.global.cwd, config.global.src, 'browserSupport.hbs')
    ),
    normalizeWinPath(
      path.join(config.global.cwd, config.global.src, 'style-guide.hbs')
    )
  ];

  console.log(templates);

  for (const template in templates) {
    if (blacklistedTemplates.indexOf(template) !== -1) {
      continue;
    }

    templates[template].filePath = template;
    templates[template].parsedFile = path.parse(template);
    templates[template].currentCategory = templates[template].category ;
    templates[template].priority = templates[
      template
    ].parsedFile.name.substring(0, 1);
    if(!templates[template].variant) {
      sortedTemplates.push(templates[template]);
    }
  }

  sortedTemplates.sort((a, b) => {
    if (a.parsedFile.name < b.parsedFile.name) {
      return -1;
    }
    if (a.parsedFile.name > b.parsedFile.name) {
      return 1;
    }
    return 0;
  });

  let lastCategory;

  sortedTemplates.forEach(template => {
    template.newSection = false;

    if (lastCategory !== template.currentCategory) {
      lastCategory = template.currentCategory;
      template.newSection = true;
    }
  });

  return sortedTemplates;
};