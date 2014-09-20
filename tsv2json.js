
// Basic function to convert TSV & CSV format data into valid JSON format for types of NVD3 charts

function tsv2json(tsv, csv, type) {

	if (csv) {	// CSV string with ";" or "," separators of cols
		if (csv.indexOf(";") > -1)
			tsv = csv.replace(/;/g, "\t");
		else if (csv.indexOf(",") > -1)
			tsv = csv.replace(/,/g, "\t");
	}

	var myJSON = d3.tsv.parse(tsv);
	var myNVD3 = JSON2NVD3(myJSON, type);

	return JSON.stringify(myNVD3);
}

// Parses TSV based input data into JSON based on chart's type
function JSON2NVD3(data, chart) {

		var lines = new Array();
		var titles = new Array();
		for (line=0; line<data.length; line++) {
			var colss = new Array();
			for (label in data[line]) {
				colss.push(data[line][label]);
				if (line == 0 && label != 'max' && label != 'min' && label != 'numericSortReverse') 
					titles.push(label);
			}
			lines.push(colss);
		}
		// console.info(titles);
		// console.info(lines);
		var res = new Array();
		if (chart == 'pie' || chart == 'donut')
			for (t=0; t<lines.length; t++)
					res.push(new Object( { "label":lines[t][0], "value":operator(+lines[t][1]) } ));
		else if (chart == 'discretebar')
			for (t=1; t<titles.length; t++)  // 1st column passed (eq t=0)
				res.push(new Object( { "key":titles[t], "values":forceNumb(lines, t) } ));
		else if (chart == 'stackedarea'  || chart == 'lineplusbar'  || chart == 'cumulativeline')
			for (t=1; t<titles.length; t++)  // 1st column passed (eq t=0)
				res.push(new Object( { "key":titles[t], "values":forceNumb2(lines, t) } ));
		else // multibars etc
			for (t=1; t<titles.length; t++)  // 1st column passed (eq t=0)
				res.push(new Object( { "key":titles[t], "values":getCol(t,lines) } ));

//		console.info(res);
		return res;

//	return data;

function forceNumb(arr, t) {  // Name data points + force numbers type for values 

	for (i=0; i<arr.length; i++) {
		arr[i]['label'] = arr[i][0];
		if (+arr[i][1] || arr[i][1] == '0')
			arr[i]['value'] = operator(+arr[i][1]);
	}
	return arr;
}

function forceNumb2(arr, t) {  // Name data points + force numbers type for values 

	var out = new Array();
	for (i=0; i<arr.length; i++) {
		if (+arr[i][t] || arr[i][t] == '0')
			out.push( new Array( +arr[i][0], operator(+arr[i][t]) ) );
	}
	return out;
}

function getCol(colname, lines) {
	var out = new Array();
	for (i=0; i<lines.length; i++) // Note: forcing numerical values output
		if (lines[i][colname] && +lines[i][colname]) {
//		if (! +lines[i][colname]) console.warning( 'Illegal value on input:'+lines[i][colname] );
		var cell = new Object( {"y": (operator(+lines[i][colname])), "x":lines[i][0]  } );
		out.push( cell );
	}
	return out;
}

function operator(x) { return x; }
} // parseJSON