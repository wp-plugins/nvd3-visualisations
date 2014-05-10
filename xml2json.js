/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 1.0
	Author:  Stefan Goessner/2006, Jouni Santara/2014
	Web:     http://goessner.net/ 
*/
// Main function to convert XML obj -> JSON obj / string
function xml2json(xml, tab, juststring) {
   var X = {
      toObj: function(xml) {
         var o = {};
         if (xml.nodeType==1) {   // element node ..
            if (xml.attributes.length)   // element with attributes  ..
               for (var i=0; i<xml.attributes.length; i++)
                  o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
            if (xml.firstChild) { // element has child nodes ..
               var textChild=0, cdataChild=0, hasElementChild=false;
               for (var n=xml.firstChild; n; n=n.nextSibling) {
                  if (n.nodeType==1) hasElementChild = true;
                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                  else if (n.nodeType==4) cdataChild++; // cdata section node
               }
               if (hasElementChild) {
                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                     X.removeWhite(xml);
                     for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType == 3)  // text node
                           o["#text"] = X.escape(n.nodeValue);
                        else if (n.nodeType == 4)  // cdata node
                           o["#cdata"] = X.escape(n.nodeValue);
                        else if (o[n.nodeName]) {  // multiple occurence of element ..
                           if (o[n.nodeName] instanceof Array)
                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                           else
                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                        }
                        else  // first occurence of element..
                           o[n.nodeName] = X.toObj(n);
                     }
                  }
                  else { // mixed content
                     if (!xml.attributes.length)
                        o = X.escape(X.innerXml(xml));
                     else
                        o["#text"] = X.escape(X.innerXml(xml));
                  }
               }
               else if (textChild) { // pure text
                  if (!xml.attributes.length)
                     o = X.escape(X.innerXml(xml));
                  else
                     o["#text"] = X.escape(X.innerXml(xml));
               }
               else if (cdataChild) { // cdata
                  if (cdataChild > 1)
                     o = X.escape(X.innerXml(xml));
                  else
                     for (var n=xml.firstChild; n; n=n.nextSibling)
                        o["#cdata"] = X.escape(n.nodeValue);
               }
            }
            if (!xml.attributes.length && !xml.firstChild) o = null;
			// START
			if (o == "0")
				o = 0;
			else if (o == "true")
				o = true;
			else if (o == "false")
				o = false;
			else if (typeof(o) == 'string') // Forcing numeric type casting 
				if (+o)
					o = +o;
			// END
         }
         else if (xml.nodeType==9) { // document.node
            o = X.toObj(xml.documentElement);
         }
         else
            alert("unhandled node type: " + xml.nodeType); 
         return o;
      },
      toJson: function(o, name, ind) {
		 var inelement = false;
		 var json = name ? ("\""+name+"\"") : "";
		 if (name == "element" || +name || name == "0") {
			json = "";
		}

         if (o instanceof Array) {
            // xtrace.push(typeof(o));
			for (var i=0,n=o.length; i<n; i++)
               if (typeof o[i] != "function")
			   o[i] = X.toJson(o[i], "", ind+"\t");
            // json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
			if (name != "values")
			json += "[" + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
			else
			json += (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join(""));
			if (name == "element")
				outofelement = true;
			// xtrace.pop();
         }
		 else if (o == null)
            json += (name&&":") + "null";
         else if (typeof(o) == "object") {
            if (o.element)
			if (name == 'values')
					o = o.element;
			var noelements = true;
			var arr = []; 
            for (var m in o) {
				if (typeof o[m] != "function")
					arr[arr.length] = X.toJson(o[m], m, ind+"\t");
				if (m=="element")
					noelements = false;
			}
			if (name == "values" || name == "root") { // Case of array object
			   json += (name?":[":"[") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "]";
			} else {
				// var element = (json == "");
				if (!outofelement || noelements) { 
					if (+name || name == "0" || name == "element") // Numeric index cases
						json += "{";
					else
						{ json += (name?":{":"{"); } }
			   json += (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join(""));
			   if (!outofelement || noelements) {
					json += "}";
					outofelement = false;
					}
			   }
			   // xtrace.pop();
         }
         else if (typeof(o) == "string")
            json += (name&&":") + "\"" + o.toString() + "\""; 
         else
            json += (name&&":") + o.toString();
		 return json;
      },
      innerXml: function(node) {
         var s = ""
         if ("innerHTML" in node)
            s = node.innerHTML;
         else {
            var asXml = function(n) {
               var s = "";
               if (n.nodeType == 1) {
                  s += "<" + n.nodeName;
                  for (var i=0; i<n.attributes.length;i++)
                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                  if (n.firstChild) {
                     s += ">";
                     for (var c=n.firstChild; c; c=c.nextSibling)
                        s += asXml(c);
                     s += "</"+n.nodeName+">";
                  }
                  else
                     s += "/>";
               }
               else if (n.nodeType == 3)
                  s += n.nodeValue;
               else if (n.nodeType == 4)
                  s += "<![CDATA[" + n.nodeValue + "]]>";
               return s;
            };
            for (var c=node.firstChild; c; c=c.nextSibling)
               s += asXml(c);
         }
         return s;
      },
      escape: function(txt) {
         return txt.replace(/[\\]/g, "\\\\")
                   .replace(/[\"]/g, '\\"')
                   .replace(/[\n]/g, '\\n')
                   .replace(/[\r]/g, '\\r');
      },
      removeWhite: function(e) {
         e.normalize();
         for (var n = e.firstChild; n; ) {
            if (n.nodeType == 3) {  // text node
               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                  var nxt = n.nextSibling;
                  e.removeChild(n);
                  n = nxt;
               }
               else
                  n = n.nextSibling;
            }
            else if (n.nodeType == 1) {  // element node
               X.removeWhite(n);
               n = n.nextSibling;
            }
            else                      // any other node
               n = n.nextSibling;
         }
         return e;
      }
   };
   var outofelement = false;
//   var xtrace = new Array(); // For debugs

   if (typeof xml == "string")
	xml = str2XML(xml);
	// console.info(X.toObj(X.removeWhite(xml)));

   if (xml.nodeType == 9) // document node
      xml = xml.documentElement;
   var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
   var data = "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";

   // console.info(data);
   // Turn txt type into JS object
	data = jQuery.parseJSON(data);

	data = data.root;
	if (data[0].length) // Data nested in [[  ... ]] array
		data = data[0];

   if (juststring)
		return JSON.stringify(data);
	else
		return data;
}

function str2XML(cells) {

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

// Old approach (xml->json): using pattern matching rules
// Unsupported.
function buildXML(data) {
// TODO: find a way to force type cast float for bottom level nodes of JS

	var xmlDoc = 0; // debug: change this global
	if (window.DOMParser)
		{
		parser=new DOMParser();
		xmlDoc=parser.parseFromString(data,"text/xml");
		}
	else // Internet Explorer
		{
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.loadXML(data); 
		}

		data = xml2json(xmlDoc, '  ');
		data = data.replace(/"element":/g, "");
		data = data.replace(/\{\[/g, "[");
		data = data.replace(/\]\}/g, "]");
		
		var forceArr = false;
		if (data.indexOf("\{\{") > 0) {
			data = data.replace(/\{\{/g, "{");
			data = data.replace(/\}\}/g, "}");
			forceArr = true;
		}
		// console.info(data);
		data = jQuery.parseJSON( data );
		data = data['root'];

		if (forceArr)
			return new Array(data);
		return data;
}
