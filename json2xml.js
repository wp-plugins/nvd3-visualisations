/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 1.0
	Author:  Stefan Goessner/2006, Jouni Santara/2014
	Web:     http://goessner.net/ 
*/
function json2xml(o, tab) {
   var toXml = function(v, name, ind) {
      recdepth++;

	  var xml = "";
	  if (v instanceof Array) {
         if (!inarray)  // Inside 1st array recursion - remember it
			arraylevel = recdepth;
		 inarray = true;
		 xstack.push(new Array("##A##",v));
		 for (var i=0, n=v.length; i<n; i++)
            { xml += ind + toXml(v[i], name, ind+"\t") + "\n";
			 }
		 if (name == "values" && inarray) { // Standard notation for array elements
			if (recdepth > arraylevel)
				xml = "\n<element>\n" + xml + "\n</element>"; // Down under top
			else
				xml = "\n<values>\n" + xml + "\n</values>";  // Top level cell
		} else
			 xml = "\n<" + name + ">\n" + xml + "\n</" + name + ">"; // Other type cells
		
		if (arraylevel == recdepth) // Out of array's all recursions
			inarray = false;
      }
      else if (typeof(v) == "object") {
		 xstack.push(new Array("##O##",v));
         if (name == "values")
			xml = toXml(v, "element", "\t");
		 else {
		 var hasChild = false;
			xml += ind + "<" + name;
         for (var m in v) {
            if (m.charAt(0) == "@")
               xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
            else
               hasChild = true;
         }
         xml += hasChild ? ">" : "/>";
         if (hasChild) {
            for (var m in v) {
               if (m == "#text")
                  xml += v[m];
               else if (m == "#cdata")
                  xml += "<![CDATA[" + v[m] + "]]>";
               else if (m.charAt(0) != "@")
                  xml += toXml(v[m], m, ind+"\t");
            }
            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "\t</" + name + ">";
         }
		 }
      }
      else {
		 // xstack.push(new Array("##X##",v));
         if (inarray && name == "values")
			xml = ind + "<element>" + v.toString() + "</element>";
		 else
			xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
      }
	  recdepth--;
      return xml;
   }, 
   xml="";
   var inarray = false;
   var recdepth = 0;
   var arraylevel = 0;
   var xstack = new Array();
   for (var m in o)
      xml += toXml(o[m], m, "");
   // console.info(xstack);
   return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}

// Main function to convert JSON obj -> XML obj
function json22xml(data, tab) {

		// Create tree of xml with its root
		var cells = '';
		if (!data.length)
			cells = cells + '<element>\n' + json2xml(data,tab) + '\n</element>';
		else
		for (i=0; i<data.length; i++)
			cells = cells + '<element>\n' + json2xml(data[i],tab) + '\n</element>';
		cells = '<root>\n' + cells + '\n</root>';

	console.info(cells);
	// xmlDoc = 0; // debug: change this global
	// Convert txt tags into XML object
	if (window.DOMParser)
		{
		parser=new DOMParser();
		xmlDoc=parser.parseFromString(cells,"text/xml");
		}
	else // Internet Explorer
		{
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.loadXML(cells); 
		}
	return xmlDoc;
}