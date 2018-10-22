
declare const __STYLE__: string;
// tslint:disable-next-line:no-any
const loaderDocument = (global as any).document;
// tslint:disable-next-line:no-var-requires
let style = require(__STYLE__);

if (typeof style === 'string') {
  style = [[module.id, style, '']];
}

const content = (style && style[0] && style[0][1]) || '';
const cssInJavacript = style.hasOwnProperty('toString');
const isCustomElement = style.toString().indexOf(':host') >= 0;
const autoApplyStyle = cssInJavacript && !isCustomElement;

if (autoApplyStyle) {
  const element = loaderDocument.createElement('style');
  element.innerHTML = content;
  loaderDocument.head.appendChild(element);
}

module.exports = {
  ...(style.locals || style),
  toString: () => !autoApplyStyle ? content : '',
};
