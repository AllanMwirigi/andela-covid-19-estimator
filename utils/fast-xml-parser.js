
var Parser = require("fast-xml-parser").j2xParser;
// var he = require('he');

//default options need not to set
// var defaultOptions = {
//     attributeNamePrefix : "@_",
//     attrNodeName: "@", //default is false
//     textNodeName : "#text",
//     ignoreAttributes : true,
//     cdataTagName: "__cdata", //default is false
//     cdataPositionChar: "\\c",
//     format: false,
//     indentBy: "  ",
//     supressEmptyNode: false,
//     tagValueProcessor: a=> he.encode(a, { useNamedReferences: true}),// default is a=>a
//     attrValueProcessor: a=> he.encode(a, {isAttributeValue: isAttribute, useNamedReferences: true})// default is a=>a
// };
var parser = new Parser();
module.exports = parser;