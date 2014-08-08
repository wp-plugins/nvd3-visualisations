
charts = new Array();
bootup = 1;

// API component to draw charts directly on WP page by one JS call

function jsChart(id, infile, type, dims, options) {

	if (bootup) {
		bootup = 0;
		checkJQ();
	}

	// Default size of chart: VGA screen
	var height = '480';
	var width = ' width:640'; //px; ';
	if (options.height && options.width) {
		height = options.height;
		width = ' width:'+options.width; //+'px; ';
	} else if (dims) {
		height = dims['height'];
		width = ' width:'+dims['width']; //+'px; ';
	}

	if (!options)
		options = new Object();

	// console.info(height); // {height:'200', width:'350'}

	var svg = "<svg id='svg"+id+"' style='height:"+height+"px; "+width+"px; '/>";
	jQuery('#chart'+id).empty();

	if (typeof options.noPopup)
	if (! options.noPopup ) {
		if (!options.title)
			options.title = 'My ('+type+') chart';
		if (!options.height && !options.width) {
			options.height = +dims['height'];
			options.width = +dims['width'];
		}
//	var svg = '<svg id="svg'+id+'" style="height:'+height+'px; '+width+'"/>";
		var popup = '';
		if (!options.inPopup)
			popup = '<img src="'+rootpath+'../icons/newindow.png" style="float:left"><br />';
		var inopts = '<script> opts=new Object('+JSON.stringify(options)+'); </script>';
		var strid = "'"+id+"' ";
		popup = inopts+'<a onclick="svg2Win('+strid+', opts)" style="cursor:pointer" >'+popup+'</a>';
		jQuery('#chart'+id).append(popup);
	}
	jQuery('#chart'+id).append(svg);

	// svgChart(id);
	type = type.toLowerCase();
	dataRead(infile, id, type, options);
}

// Data reader from different sources: demos / own file / direct input options / JSON 
function dataRead(infile, id, type, options) {

	// console.info(infile);
	ginfile = infile; // make global

	if (infile == '')
		demoShows(id, '', type, options);
	else if (infile.indexOf(".json") > 0)
	d3.json(infile,function(error,data) {
		// console.info(data);
		// jsonbody = data;
		// printLines(data);
		chartSelector(id, data, type, options);
	});
	else if (infile.indexOf('.xml') > 0)
	d3.text(infile,function(error,data) { // d3.xml has parsing problems
//		data = buildXML(data);
		data = xml2json(data, ' ');
		chartSelector(id, data, type, options); 
	});
	else if (infile.indexOf(".tsv") > 0)
	d3.tsv(infile,function(error,data) { 
//		console.info(data);
		data = parseJSON(data,type);
//		console.info(data);
//		console.info(options);
		chartSelector(id, data, type, options);

	options.datatype = 'tsv';
	options.infile = infile;
	if ((options.exports || options.chartpicker) && !options.inPopup) { // Record data & options into DOM
		if (typeof chartData == 'undefined')
			chartData = new Array();
		chartData[id] = new Object( options );
	}
	});
	else if (infile.indexOf('.csv') > 0)
	d3.csv(infile,function(error,data) {
		// console.info(data);
		data = parseJSON(data,type);
		chartSelector(id, data, type, options);

	options.datatype = 'csv';
	options.infile = infile;
	if ((options.exports || options.chartpicker) && !options.inPopup) { // Record data & options into DOM
		if (typeof chartData == 'undefined')
			chartData = new Array();
		chartData[id] = new Object( options );
	}
	});
	else if (options.values) { // Direct input (like D3 simplecharts plugin has)
//		console.info(options);
		var titles = ['Labels','DataSet1','DataSet2','DataSet3'];
		if (options.series)  // Name of data's columns given
		if (!options.inPopup && options.series != 'Labels') {
			var arr = ['Labels'];
			titles = arr.concat(options.series);
			options.series = titles;
		}
		var out = new Array();
		for (i=0; i<options.values.length; i++) {
			var o = new Object();
			if (options.labels)
				o[ titles[0] ] = options.labels[i];
			else
				o[ titles[0] ] = i+1;
			o[ titles[1] ] = options.values[i];
			out.push(o);
		}
//		console.info(out);
		var data = parseJSON(out, type);
		chartSelector(id, data, type, options);

	options.datatype = 'direct';
	options.infile = 'foo';
	if ((options.exports || options.chartpicker) && !options.inPopup) { // Record data & options into DOM
		if (typeof chartData == 'undefined')
			chartData = new Array();
		chartData[id] = new Object( options );
	}
	}
	else if (typeof infile == 'object') // Direct data set by JSON variable (= formats on examples folder)
		chartSelector(id, infile, type, options);
}
function recordOptions(options) {


}

function printLines(data) {
	var tab = '	';
	var newline = "\n";
	var out = '';
	for (line=0; line<data.length; line++) {
		if (data[line].values)
			for (line2=0; line2<data[line].values.length; line2++)
				out += data[line].values[line2][0] +tab+ data[line].values[line2][1] +newline;
		out += 'DATA SET'+newline;
	}
	console.info(out);
}

function parseJSON(data, chart) {

		var lines = new Array();
		var titles = new Array();
		for (line=0; line<data.length; line++) {
			var colss = new Array();
			for (label in data[line]) {
				colss.push(data[line][label]);
				if (line == 0) titles.push(label);
			}
			lines.push(colss);
		}
		// console.info(titles);
		// console.info(lines);
		var res = new Array();
		if (chart == 'pie' || chart == 'donut')
			for (t=0; t<lines.length; t++)
					res.push(new Object( { "label":lines[t][0], "value":+lines[t][1] } ));
		else if (chart == 'discretebar')
			for (t=1; t<titles.length; t++)  // 1st column passed (eq t=0)
				res.push(new Object( { "key":titles[t], "values":forceNumb(lines, t) } ));
		else if (chart == 'stackedarea'  || chart == 'lineplusbar'  || chart == 'cumulativeline')
			for (t=1; t<titles.length; t++)  // 1st column passed (eq t=0)
				res.push(new Object( { "key":titles[t], "values":forceNumb2(lines, t) } ));
		else // multibars etc
			for (t=1; t<titles.length; t++)  // 1st column passed (eq t=0)
				res.push(new Object( { "key":titles[t], "values":getCol(t,lines) } ));

		// console.info(res);
		return res;

	return data;
}
function forceNumb(arr, t) {  // Name data points + force numbers type for values 

	for (i=0; i<arr.length; i++) {
		arr[i]['label'] = arr[i][0];
		if (+arr[i][1] || arr[i][1] == '0')
			arr[i]['value'] = +arr[i][1];
	}
	return arr;
}

function forceNumb2(arr, t) {  // Name data points + force numbers type for values 

	var out = new Array();
	for (i=0; i<arr.length; i++) {
		if (+arr[i][t] || arr[i][t] == '0')
			out.push( new Array( +arr[i][0], +arr[i][t] ) );
	}
	return out;
}

function getCol(colname, lines) {
	var out = new Array();
	for (i=0; i<lines.length; i++) // Note: forcing numerical value out
		if (lines[i][colname]) {
		if (! +lines[i][colname]) console.warning( 'Illegal value on input:'+lines[i][colname] );
		var cell = new Object( {"y": (+lines[i][colname]), "x":lines[i][0]  } );
		out.push( cell );
	}
	return out;
}

function demoShows(id, data, type, options) {

	// Demo data sets for gallery
	var demos = { lineplusbar:'linePlusBarData.json', simpleline:'simpleLineData.json', cumulativeline:'cumulativeLineData.json', stackedarea: 'stackedAreaData.json', discretebar:'discreteBarData.json', horizontalmultibar:'multibarData.json', pie:'pieData.json', donut:'pieData.json', bullet:'bulletData.json', scatterbubble:'scatterData.json', multibar:'multiData.json', viewfinder:'viewFinderData.json' };

	if (options.xmldemo)
		demos[type] = demos[type].replace(/json/g, 'xml');

	// Home dir of demo data sets
	var infile = 'wp-content/plugins/nvd3/data/'+demos[type];
	if (rootpath) // Global URL of root set by shortcode of WP
		 infile = rootpath + demos[type];

	var desc = 'Data File: data/'+demos[type];
	var subs = '<sup> ?</sup>';
	var msg = '<b class="title_nvd3" title="'+desc+'">Chart Type: '+type+subs+'</b>';
	msg = '<br /><a href="'+infile+'" target="_blank">'+msg+'</a>';

	var pp = rootpath+'../postchart.php?new=';
	var ctype = '&type='+type;
	var filepath = '&filepath='+demos[type];
	var tt = 'Clone data set from this example into your new draft on WordPress';

	var shortmsg = '<br />Add this into: ';

	var idmenu = "gmenu"+id;
	var mpostpage = '<select id='+idmenu+'><option value="post">New Post</option><option value="page">New Page</option></select>';

	var idmenu2 = "gformat"+id;
	var mformat = '<select id='+idmenu2+'><option value="json">JSON data</option><option value="xml">XML data</option><option value="csv">CSV data</option><option value="tsv">TSV data</option></select>';

	var query = rootpath+"../postchart.php?type="+type;
	var ctype = demos[type];
	var mbutt = '<button style="cursor:pointer" onclick="newpost2('+sQuote(query)+', '+sQuote(ctype)+', '+sQuote(idmenu)+', '+sQuote(idmenu2)+')" title="'+tt+'">New Chart</button>'

	var aform = shortmsg + mpostpage + ' in ' + mformat + mbutt;

	if (infile.indexOf(".json") > 0)
	d3.json(infile,function(error,data) {
		chartSelector(id, data, type, options);
		console.info('Drawing chart demo "'+type+'" from a file: data/'+demos[type]);
		jQuery("#chart"+id).append(msg+aform);
	});
	else if (infile.indexOf('.xml') > 0)
	d3.text(infile,function(error,data) { // d3.xml has parsing problems
//		data = buildXML(data);
		data = xml2json(data, '  ');
		// console.info(data);
		chartSelector(id, data, type, options);
		console.info('Drawing chart demo "'+type+'" from a XML file: data/'+demos[type]); // demos[type]
		jQuery("#chart"+id).append(msg+aform);
	});
}
function sQuote(w) { return " '"+w+"' "; }

function newpost(linkjson, linkxml, id) {

	var choice = jQuery('#'+id).val();

	if (choice == 'xmlpage' || choice == 'jsonpage') {
		linkjson = linkjson.replace('new=post', 'new=page');
		linkxml = linkxml.replace('new=post', 'new=page');
	}

	if (choice == 'jsonpost' || choice == 'jsonpage')
		window.open(linkjson);
	else if (choice == 'xmlpost'  || choice == 'xmlpage')
		window.open(linkxml);
}
function newpost2(alink, afile, id, id2) {

	var post_type = jQuery('#'+id).val();
	var data_format = jQuery('#'+id2).val();

	alink = alink + '&new=' + post_type;
	if (data_format != 'json')
		alink = alink + '&filepath='+afile.replace('json', data_format);
	else
		alink = alink + '&filepath='+afile;

	console.info(alink);
	window.open(alink);
}

function chartSelector(id, data, type, options) {

	if (type == 'lineplusbar')
		NVD3linePlusBar(id, data, options);
	else if (type == 'simpleline')
		NVD3simpleLine(id, data, options);
	else if (type == 'scatterbubble')
		NVD3ScatterBubble(id, data, options);
	else if (type == 'viewfinder')
		NVD3viewFinder(id, data, options)
	else if (type == 'multibar')
		NVD3MultiBar(id, data, options);
	else if (type == 'cumulativeline')
		NVD3cumulativeLineData(id, data, options);
	else if (type == 'stackedarea')
		NVD3stackedArea(id, data, options);
	else if (type == 'discretebar')
		NVD3discreteBar(id, data, options);
	else if (type == 'horizontalmultibar')
		NVD3horizontalMultiBar(id, data, options);
	else if (type == 'pie')
		NVD3Pie(id, data, options);
	else if (type == 'donut')
		NVD3Donut(id, data, options); 
	else if (type == 'bullet')
		NVD3Bullet(id, data, options);

/*
	nvd3Dump = JSON.stringify(data);
//	xdata = "'data'";
	var cbutt = '<br /><button onclick="copyToClipboard()">Copy Data</button>';
	jQuery("#chart"+id).append(cbutt);
*/
}
// Axis should be time formatted with chart ?
function timeStamp(x, options) {
	if (options.xtime)
		return d3.time.format('%x')(new Date(x));

	return x;
}

/* ALL Supported NVD3 Chart Types: 1 function/type */

// Drawing chart: linePlusBar
function NVD3linePlusBar(chartID, data, options) {

  nv.addGraph(function() {
	  var chart = nv.models.linePlusBarChart()
            .margin(setMargin({top: 30, right: 90, bottom: 50, left: 90}, options))
            //We can set x data accessor to use index. Reason? So the bars all appear evenly spaced.
            .x(function(d,i) { return i })
            .y(function(d,i) {return d[1] })
            ;

	  chart.xAxis.tickFormat(function(d) {
        var dx = data[0].values[d] && data[0].values[d][0] || 0;
		return timeStamp(dx, options);
      });

/* Uncomment => original demo show
	  chart.xAxis.tickFormat(function(d) {
        var dx = data[0].values[d] && data[0].values[d][0] || 0;
        return d3.time.format('%x')(new Date(dx))
      });

      chart.y1Axis
          .tickFormat(d3.format(',f'));

      chart.y2Axis
          .tickFormat(function(d) { return d3.format(',f')(d) });

    chart.y1Axis
		.axisLabel(data[0]['key']);
    chart.y2Axis
		.axisLabel(data[1]['key']);

    chart.y1Axis
        .tickFormat(d3.format(',.1%')); 
*/
	chart.bars.forceY([0]);

	chart.options(options);
	shadowEffects(chartID, options);

	  d3.select("#svg"+chartID)
        .datum(data)
        .transition()
        .duration(500)
        .call(chart);
/*
  if (options.style) { // TODO: better way to set different styles for 2 series
	d3.selectAll('#svg'+chartID+' rect').style(options.style); 
	d3.selectAll('#svg'+chartID+' path').style(options.style);
	}
*/
	colorSegments('lineplusbar',options,chartID,data.length);

      nv.utils.windowResize(chart.update); 

      return chart;
  });
}
// Drawing chart: cumulativeLineData
function NVD3cumulativeLineData(chartID, data, options) {
 
  nv.addGraph(function() {
    var chart = nv.models.cumulativeLineChart()
                  .margin(setMargin({left: 50, right: 50, bottom: 50}, options))
				  .x(function(d) { return d[0] })
                  .y(function(d) { return d[1]/100 }) //adjusting, 100% is 1.00, not 100 as it is in the data
                  .color(d3.scale.category10().range())
                  .useInteractiveGuideline(true)
                  ;

    // console.info(data);

	 chart.xAxis
        .tickFormat(function(d) {
			return timeStamp(d, options)
          });

    chart.yAxis
        .tickFormat(d3.format( setFormat(',.1%',options) ));

	  chart.options(options);
	shadowEffects(chartID, options);

	  d3.select("#svg"+chartID)
        .datum(data)
        .call(chart);

	colorSegments('cumulativeline',options,chartID,data.length);

    //TODO: Figure out a good way to do this automatically
    nv.utils.windowResize(chart.update); 

	return chart;
  });
}
// Drawing chart: stackedArea
function NVD3stackedArea(chartID, data, options) { 

  nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
                  .margin(setMargin({left:50, right: 50, bottom: 50}, options))
                  .x(function(d) { return d[0] })   //We can modify the data accessor functions...
                  .y(function(d) { return d[1] })   //...in case your data is formatted differently.
                  .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
                  .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                  .transitionDuration(500)
                  .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                  .clipEdge(true);

    //Format x-axis labels with custom function.
    chart.xAxis
        .tickFormat(function(d) { 
			return timeStamp(d, options)
    });

    chart.yAxis
        .tickFormat(d3.format( setFormat(',.2r',options) ));

    chart.options(options);
	shadowEffects(chartID, options);

	d3.select("#svg"+chartID)
      .datum(data)
      .call(chart);

	colorSegments('stackedarea',options,chartID,data.length);

    nv.utils.windowResize(chart.update);

    return chart;
  });
}
// Drawing chart: discreteBar
function NVD3discreteBar(chartID, data, options) {

nv.addGraph(function() {
  var chart = nv.models.discreteBarChart()
      .margin(setMargin({left: 50, bottom: 50}, options))
	  .x(function(d) { return d.label })    //Specify the data accessors.
      .y(function(d) { return d.value })
      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
      .tooltips(false)        //Don't show tooltips
      .showValues(true)       //...instead, show the bar value right on top of each bar.
      .transitionDuration(350)
      ;

    chart.yAxis
        .tickFormat(d3.format( setFormat('.3r',options) ));

	chart.options(options);
	shadowEffects(chartID, options);

  d3.select("#svg"+chartID)
      .datum(data)
      .call(chart);

 	colorSegments('discretebar',options,chartID,data.length);

  nv.utils.windowResize(chart.update);

  return chart;
});
}
// Drawing chart: horizontalMultiBar
function NVD3horizontalMultiBar(chartID, data, options) {

  nv.addGraph(function() {
    var chart = nv.models.multiBarHorizontalChart()
        .margin(setMargin({left: 70, bottom: 50}, options))
		.x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .showValues(true)           //Show bar value next to each bar.
        .tooltips(true)             //Show tooltips on hover.
        .transitionDuration(350)
        .showControls(true);        //Allow user to switch between "Grouped" and "Stacked" mode.

    chart.yAxis
        .tickFormat(d3.format( setFormat(',.2r',options) ));

	chart.options(options);
	shadowEffects(chartID, options);

	d3.select("#svg"+chartID)
        .datum(data)
        .call(chart);
  
	colorSegments('horizontalmultibar',options,chartID,data.length);

    nv.utils.windowResize(chart.update);

    return chart;
  });

}
// Drawing chart: ScatterBubble
function NVD3ScatterBubble(chartID, data, options) {

nv.addGraph(function() {
  var chart = nv.models.scatterChart()
                .margin(setMargin({left: 50, bottom: 50}, options))
				.showDistX(true)    //showDist, when true, will display those little distribution lines on the axis.
                .showDistY(true)
                .transitionDuration(350)
                .color(d3.scale.category10().range());

  //Configure how the tooltip looks.
  chart.tooltipContent(function(key) {
      return '<h3>' + key + '</h3>';
  });

  //Axis settings
  chart.xAxis.tickFormat(d3.format( setFormat('.02f',options) ));
  chart.yAxis.tickFormat(d3.format( setFormat('.02f',options) ));

  //We want to show shapes other than circles.
  chart.scatter.onlyCircles(false);

  // var myData = randomData(4,40);
  // console.info( JSON.stringify(myData) );

	chart.options(options);
	shadowEffects(chartID, options);

  d3.select("#svg"+chartID)
      .datum(data)
      .call(chart);

	colorSegments('scatterbubble',options,chartID,data.length);

  nv.utils.windowResize(chart.update);

  return chart;
});
}
// Drawing chart: MultiBar
function NVD3MultiBar(chartID, data, options) {

nv.addGraph(function() {
    var chart = nv.models.multiBarChart()
      .margin(setMargin({left: 50, bottom: 50}, options))
	  .transitionDuration(350)
      .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
      .rotateLabels(0)      //Angle to rotate x-axis labels.
      .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
      .groupSpacing(0.1)    //Distance between each group of bars.
	  .x(function(d,i) { return i })
    ;
/*
    chart.xAxis
        .tickFormat(d3.format(',f'));
*/
	chart.xAxis.tickFormat(function(d) {
		var dx = data[0].values[d] && data[0].values[d]["x"] || 0;
		return timeStamp(dx, options);
    });

    chart.yAxis
        .tickFormat(d3.format( setFormat('.2r',options) ));
//   console.info( JSON.stringify( exampleData() ) );

	chart.options(options);
	shadowEffects(chartID, options);

    d3.select("#svg"+chartID)
        .datum(data)
        .call(chart);

	colorSegments('multibar',options,chartID,data.length);

    nv.utils.windowResize(chart.update);

    return chart;
});
}
// Drawing chart: viewFinder
function NVD3viewFinder(chartID, data, options) {

nv.addGraph(function() {
  var chart = nv.models.lineWithFocusChart()
	.margin(setMargin({left: 50, bottom: 50}, options))
	.x(function(d,i) { return i })
  ;
/*
  chart.xAxis
      .tickFormat(d3.format(',f'));
*/
	chart.xAxis.tickFormat(function(d) {
        var dx = data[0].values[d] && data[0].values[d]["x"] || 0;
		return timeStamp(dx, options);
    }); 

  chart.yAxis
      .tickFormat(d3.format('.2r'));

  chart.y2Axis
      .tickFormat(d3.format( setFormat(',.2r',options) ));

	chart.options(options);
	shadowEffects(chartID, options);

    d3.select("#svg"+chartID)
      .datum(data)
      .transition().duration(500)
      .call(chart);

	colorSegments('viewfinder',options,chartID,data.length);

  nv.utils.windowResize(chart.update);

  return chart;
});
}
// Drawing chart: simpleLine
function NVD3simpleLine(chartID, data, options) { 

/*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
nv.addGraph(function() {
  var chart = nv.models.lineChart()
                .margin(setMargin({left: 50, bottom: 50}, options))  //Adjust chart margin wider.
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                .transitionDuration(350)  //how fast do you want the lines to transition?
                .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
  .x(function(d,i) { return i })
  ;

	chart.xAxis.tickFormat(function(d) {
		var dx = data[0].values[d] && data[0].values[d]["x"] || 0;
		return timeStamp(dx, options);
    });

  chart.yAxis     //Chart y-axis settings
      .tickFormat(d3.format( setFormat('.2r',options) ));

	chart.options(options);
	shadowEffects(chartID, options);

  d3.select("#svg"+chartID) 
      .datum(data)         //Populate the <svg> element with chart data...
      .call(chart);          //Finally, render the chart!

	colorSegments('simpleline',options,chartID,data.length);

  //Update the chart when window resizes.
  nv.utils.windowResize(function() { chart.update() });
  return chart;
});
}
// Drawing chart: Pie
function NVD3Pie(chartID, data, options) {

//Regular pie chart example
nv.addGraph(function() {
  var chart = nv.models.pieChart()
      .margin(setMargin({left: 10, bottom: 50}, options))
	  .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .showLabels(true);

	chart.valueFormat = d3.format( setFormat('.2r',options) );

	chart.options(options);
	shadowEffects(chartID, options);

	d3.select("#svg"+chartID)
        .datum(data)
        .transition().duration(700)
        .call(chart);

	colorSegments('pie',options,chartID,data.length);

  return chart;
});
}
// Drawing chart: Donut
function NVD3Donut(chartID, data, options) {

//Donut chart example
nv.addGraph(function() {
  var chart = nv.models.pieChart()
      .margin(setMargin({left: 10, bottom: 50}, options))
	  .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .showLabels(true)     //Display pie labels
      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
      .labelType("percent") //Configure what type of data to show in the label: "key", "value" or "percent"
      .donut(true)          //Turn on Donut mode. Makes pie chart looks tasty!
      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
      ;

	chart.valueFormat = d3.format( setFormat('.2r',options) );

	chart.options(options);
	shadowEffects(chartID, options);

	d3.select("#svg"+chartID)
        .datum(data)
        .transition().duration(700)
        .call(chart);

	colorSegments('donut',options,chartID,data.length);

  return chart;
});
}
// Drawing chart: Bullet
function NVD3Bullet(chartID, data, options) {

nv.addGraph(function() {  
  var chart = nv.models.bulletChart()
				.margin(setMargin({left: 150, bottom: 50}, options));

	chart.options(options);

	d3.select("#svg"+chartID)
      .datum(data)
      .transition().duration(1000)
      .call(chart);

  return chart;
});
}

function colorSegments(type,options,chartID,size) {

  initCB();

  var classname = 0;
  if (options.colorbrewer) if (options.colorbrewer.segment)
		classname = options.colorbrewer.segment;

  var action = 'fill';
  if (!classname) {
  if (type == 'pie' || type == 'donut')
	classname = ' .nv-slice';
	else if (type == 'horizontalmultibar' || type == 'discretebar')
		classname = ' .nv-bar';
	else if (type == 'stackedarea')
		classname = ' .nv-area';
	else if (type == 'scatterbubble' || type == 'lineplusbar' || type == 'multibar')
		classname = ' .nv-group';
	else if (type == 'simpleline'  || type == 'cumulativeline' || type == 'viewfinder') {
		classname = ' .nv-group';
		action = 'stroke';
		}
	}

	var customs = false;
	// Fixed palettes of colorbrewer.js
	if (options.colorbrewer)
	if (options.colorbrewer.palette)
	if (colorbrewer[options.colorbrewer.palette]) {
		var amount = size;
		if (options.colorbrewer.amount)
			amount = options.colorbrewer.amount;
		if (amount < 3) amount = 3;
		else if (amount > colorbrewer[options.colorbrewer.palette].max)
			amount = colorbrewer[options.colorbrewer.palette].max;
		var colors = d3.scale.ordinal().range(colorbrewer[options.colorbrewer.palette][amount]);
		customs = true;
	}
	// Own custom colors (eq options.colors:'red,green,blue' or options.colors:{startbar:'red', endbar:'lime'} )
	if (options.colors)
		if (typeof options.colors == 'string')  {
			var colors = d3.scale.ordinal().range(options.colors.split(','));
			customs = true;
	}	 else { // Object => interpolating of colours 
			if (options.colors.startbar && options.colors.endbar)
				var colors = d3.scale.ordinal().range(gradientColors(options.colors.startbar, size, options.colors.endbar));
			customs = true;
		}

	if (customs && type != 'lineplusbar' && type != 'multibar') { // TODO: colors of blocked types
		d3.selectAll('#svg'+chartID+classname).style(action, function(d, i) { return colors(i); });
		// Legend's coloring
		d3.selectAll('#svg'+chartID+' .nv-legend-symbol').style("fill", function(d, i) { return colors(i); });
		d3.selectAll('#svg'+chartID+' .nv-legend-symbol').style("stroke", function(d, i) { return colors(i); });
	} else
	if (options.style) // Example: {"fill":"navy"}
		d3.selectAll('#svg'+chartID+classname).style(options.style);

	if (options.shadows)
		d3.selectAll('#svg'+chartID+classname).style( { filter:"url(#blackshadows)" } );
}

function recolor(type,chartID,i) { // TODO
}

function initCB() {
	for (x in colorbrewer)
	if (colorbrewer[x]['max'])
		return;
	else
	for (j in colorbrewer[x]) {
		colorbrewer[x]['max'] = colorbrewer[x][j].length;
	}
}

// Generates smooth colors based on given starting and ending colors and returns its HTML color codes
function gradientColors(startColor, steps, endColor) {

if (startColor && endColor) { // && !args2js.colors && args2js.colors.length != args2js.data.length)

	var colors = new Array();
	if (!startColor.length)  // We give up coloring task for the CSS declarations over here
		return '';

	var csteps = 0;
	if (!endColor) {
		var acolor = d3.hsl(startColor);
		// Defining proper lightness change step
		if (acolor.l > 0.5) { // Starting color is over 50% from all lightness => going to darken it
			csteps = acolor.l / (steps); // Target range: (startColor lightness ... black/0)
			ssteps = acolor.s / steps;
		} else {  // ... or brighten up
			csteps = (1-acolor.l) / (steps); // Target range: (startColor lightness ... white/1)
			ssteps = (1-acolor.s) / steps;
		}
		// Generating colors (without endColor given)
		var thecolor = acolor;
		for (i=0; i<steps; i++) {
			colors.push(thecolor.toString());
			// console.info(acolor.l);
			// thecolor = d3.hsl(d3.hsl(thecolor).h, d3.lab(thecolor).s+ssteps, d3.lab(thecolor).l+csteps);
			if (acolor.l > 0.49)
				thecolor = thecolor.darker(csteps*4);
			else
				thecolor = thecolor.brighter(csteps*4);
		}
	} else {  
		// Here we have start and end color traveling from => to by using steps of given color changes
		// We encode start and end colors by using Lab's color model's components from HTML's color strings
		var startColor = d3.lab(startColor);
		var Lab_start = new Array(startColor.l, startColor.a, startColor.b);
		var endColor = d3.lab(endColor);
		var Lab_end = new Array(endColor.l, endColor.a, endColor.b);

		steps = steps - 1;
		// Time to define (L,a,b) linear steps for each components change and build result
		var L_step = (-Lab_start[0]+Lab_end[0]) / steps;
		var a_step = (-Lab_start[1]+Lab_end[1]) / steps;
		var b_step = (-Lab_start[2]+Lab_end[2]) / steps;
		// Generating color ramp by using these steps together from start to end color
		var thecolor = startColor;
		for (i=0; i<steps+1; i++) {
			colors.push(thecolor.toString());
			thecolor = d3.lab(d3.lab(thecolor).l+L_step, d3.lab(thecolor).a+a_step, d3.lab(thecolor).b+b_step);
		}
		// Why use D3's Lab (vs HSL) model here: 'father of all humans coloring models :-)':
		// *** http://www.photozone.de/colorimetric-systems-and-color-models
	}

	return colors;
} else
	return new Array(); // empty array
}

function shadowEffects(chartID, options) {

if (options.shadows) {
	// filters go in defs element
	var svg = d3.select("#svg"+chartID);
	var defs = svg.append("defs");
 
	// create filter with id #drop-shadow
	// height=130% so that the shadow is not clipped
	var filter = defs.append("filter")
		.attr("id", "blackshadows")
		.attr("height", "130%");
 
	// SourceAlpha refers to opacity of graphic that this filter will be applied to
	// convolve that with a Gaussian with standard deviation 3 and store result
	// in blur
	filter.append("feGaussianBlur")
		.attr("in", "SourceAlpha")
		.attr("stdDeviation", 5)
		.attr("result", "blur");
 
	// translate output of Gaussian blur to the right and downwards with 2px
	// store result in offsetBlur
	filter.append("feOffset")
		.attr("in", "blur")
		.attr("dx", 5)
		.attr("dy", 5)
		.attr("result", "offsetBlur");
 
	// overlay original SourceGraphic over translated blurred opacity by using
	// feMerge filter. Order of specifying inputs is important!
	var feMerge = filter.append("feMerge");
 
	feMerge.append("feMergeNode")
		.attr("in", "offsetBlur")
	feMerge.append("feMergeNode")
		.attr("in", "SourceGraphic");
}
// Background's coloring / picts
if (options)
	if (options['background-image'] || options['backgroundimage']) {
		if (options['backgroundimage'])
			options['background-image'] = options['backgroundimage'];
		var pict = options['background-image'];
		var xloc = 0;
		var yloc = 0;
		if (typeof pict == 'object') {
			console.info(typeof pict.x);
			if (typeof pict.x == 'number')
				xloc = pict.x;
			if (typeof pict.y == 'number')
				yloc = pict.y;
			pict = pict['backgroundimage'];
		}
		if (pict.indexOf(',')) {  // An array of picts given => make a random choice from them
			pict = pict.replace(/ /g, '');	// Trim off all white spaces
			pict = pict.replace(/\t/g, '');
			var picts = pict.split(',');
			pict = picts[ Math.floor(Math.random() * picts.length) ];
		}
		var svg = d3.selectAll('#svg'+chartID);
		svg.append("svg:image")
		.attr("xlink:href", pict)
			.attr("width", options.width)
			.attr("height", options.height)
			.attr("x", xloc)
			.attr("y", yloc);
	} else if (options['background-color'] || options['backgroundcolor']) {
			if (options['backgroundcolor'])
				options['background-color'] = options['backgroundcolor'];
			var svg = d3.selectAll('#svg'+chartID);
			svg.append("rect")
				.attr("fill", options['background-color'])
				.attr("width", options.width)
				.attr("height", options.height);
}
}

// End of coloring funcs

function setMargin(m, options) {

  if (options.margin)
	return options.margin;

  return m;
}
function setFormat(m, options) {

  if (options.format)
	return options.format;

  return m;
}

function checkJQ() {

	if ('undefined' == typeof window.jQuery)
		window.alert('Please, load jQuery to use NVD3 visualisations properly.');
	else
		console.info('jQuery: %ok%');
}

// A test for WP shortcode's calls
function svgChart(chartID, infile, type, dims, options) {

charts.push(chartID+' ');

nv.addGraph(function() {
    var chart = nv.models.lineChart();

    chart.xAxis
        .axisLabel("X-axis Label");

    chart.yAxis
        .axisLabel("Y-axis Label")
        .tickFormat(d3.format("d"))
        ;

	// var cID = charts.pop();
	var cID = charts[charts.length-1];
	d3.select("#chart"+cID+" svg")
        .datum(myData())
        .transition().duration(500).call(chart);

    nv.utils.windowResize(
            function() {
                chart.update();
            }
        );
	return chart;
});

};
function saveData(header, databox, filename) {

	var mydata = encodeURIComponent( jQuery('#'+databox).val() );
	mydata = jQuery('#'+header).html() + mydata;
	// console.info(mydata);
	// var rec = { infile: filename, data: mydata };
	var query = 'http://www.tere-tech.eu/balticfinns/wp-content/plugins/nvd3-visualisations/updatechart.php';

	jQuery.post( query, { infile: filename, indata: mydata }, function( data ) {
		if (data)
			location.reload();  // Ok, reload view on browser & chart(s)
		else
			alert('Data Set failed to write!');
	}); //, "json");
}

// Converter between different data inputs
function dataConvert(intype, input, output) {

	var data = jQuery('#'+input).val();
	var tab = '';

	if (intype == 'json')
		data = json22xml(jQuery.parseJSON(data), tab, true);
	else if (intype == 'xml')
		data = xml2json(data, tab, true);

	jQuery('#'+output).empty();
	jQuery('#'+output).val(data);
}
// A function to show SVG element in a new window
  function svg2Win(svgid, options) {

	if (typeof chartData != 'undefined')
	if (chartData[svgid])
		if (chartData[svgid]['exports'] || chartData[svgid]['chartpicker'])
			options = chartData[svgid];
 
	var drawButts = false;
	if (typeof chartData == 'object')
		if (chartData[svgid])
		if (chartData[svgid]['chartpicker'])
			drawButts = true;

	var header = '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> ';
	var svgstyle = jQuery("#svg"+svgid).attr("style");
	var viewbox = ' viewBox="0 0 '+options.width+' '+options.height+'" ';
	var svg = '<svg id="svg'+svgid+'" '+viewbox+' >' + jQuery('#svg'+svgid).html() + '</svg>'; 
	// height="100%" width="100%"

	var css = rootpath+"../nv.d3.css"; 
	css = '<link rel="stylesheet" href="'+css+'" type="text/css" media="all"/> ';

	if (options['exports']  || drawButts) {
		var jQ = '<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script> ';
		var cb = '<script src="'+rootpath+'../colorbrewer.js"></script> ';
		css = jQ + cb + css + '<script src="'+rootpath+'../d3.min.js"></script> ' + '<script src="'+rootpath+'../nv.d3.min.js"></script> ' + '<script src="'+rootpath+'../wpcharts.js"></script> ';
	}

/* TODO: resize buttons of chart
	var smallerB = '<button style="font-size:xx-small" onClick="svgscaler('+svgid+', -1)"> « </button> ';
	var biggerB = '<button style="font-size:xx-small" onClick="svgscaler('+svgid+', +1)"> » </button> ';
*/
	var printIco = '<img src="'+rootpath+'../icons/print.gif">';
	var printB = '<button style="float:right; cursor:pointer;" onClick="window.print()" title="Print This Chart on Paper">'+printIco+'</button> ';

//	options.exports = 1;
	var expB = ''; var svgB = '';
	if (options.exports) {
		expB = '<img src="'+rootpath+'../icons/excel.png">';
		var expID = "'svg"+svgid+"'";
		expB = '<button style="float:right; cursor:pointer;" onClick="exportData('+expID+',\'csv\')" title="Export Data into Excel or Other Spreadsheets Software">'+expB+'</button> ';
		svgB = '<img src="'+rootpath+'../icons/svgedit.png">';
		var expID = "'chart"+svgid+"'";
		svgB = '<button style="float:right; cursor:pointer;" onClick="exportData('+expID+',\'svg\')" title="Export Chart into Illustrator or SVG Editor Software">'+svgB+'</button> ';
	}

	var title = "D3 Chart";
	if (typeof options.title != 'undefined')
		title = options.title;
	var html = header+' <html><head> <title> '+title+' </title> ' +css+'</head> ';

	html = html + '<body>'; // + css;
	if (typeof chartData == 'object')
	if (chartData[svgid])
	if (chartData[svgid]['exports']  || drawButts) {
		html = html + '<script>chartData = ' + JSON.stringify(chartData[svgid]) + '; chartData.inPopup=true; rootpath="'+ rootpath +'"; function getChartData() { return chartData; } </script>';
	}

	html = html + '<table class="svgtable" >';
	html = html + '<tr><td>';
	if (typeof options.title != 'undefined')
			html = html + '<b>' + options.title + '</b>';

//	html = html + '<p style="float:right">' + smallerB + biggerB + '</p>';
	var cid = "'chart"+svgid+"'";
	var sid = "'svg"+svgid+"'";
	var resize = ' resize:both; overflow:auto; ';
	if (typeof options.noResize != 'undefined')
	if (options.noResize)
		resize = '';

	var pickers = ''; // Charts picker's butts
	if (drawButts) {
		// All legal chart types (TODO: horizontalmultibar, scatterbubble, add)
		var types = { 'lineplusbar':1, 'simpleline':1, 'cumulativeline':1, 'stackedarea':1, 'discretebar':1,'horizontalmultibar':1, 'pie':1, 'donut':1, 'bullet':1, 'scatterbubble':1, 'multibar':1, 'viewfinder':1 };
		var typesTSV = { 'simpleline':1, 'cumulativeline':1, 'stackedarea':1, 'discretebar':1,'pie':1, 'donut':1, 'multibar':1, 'viewfinder':1 };

		options.inPopup = true;
		if (options.datatype == 'direct')
			pickers = '<td>'+popButt('pie',svgid, options, types)+popButt('donut',svgid, options, types)+popButt('discretebar',svgid, options, types)+popButt('multibar',svgid, options, types)+popButt('simpleline',svgid, options, types)+popButt('viewfinder',svgid, options, types)+'</td>'
		else if (options.datatype == 'tsv' || options.datatype == 'csv') {
			var pickers = '';
			for (t in typesTSV)
				pickers = pickers + popButt(t, svgid, options, types);
			pickers = '<td>'+pickers+'</td>';
		}
	}

	html = html + '</td></tr><tr><td class="svgchart" ><div id="chart'+svgid+'" style="'+svgstyle+resize+' " onmouseup="document.getElementById('+sid+').style.height = document.getElementById('+cid+').style.height; document.getElementById('+sid+').style.width = document.getElementById('+cid+').style.width;">';
	html = html + svg + '</div>';
	html = html + '</td>'+pickers+'</tr><tr><td>'+printB+expB+svgB+'</td><tr><tr><td id="databuffer" style="color:gray"></td></tr></table></body></html>';

	var cwidth = 100 + parseInt(options.width);
	var cheight = 100 + parseInt(options.height);
	myWindow=window.open('','','location=0,status=0,menubar=0,width='+cwidth+',height='+cheight);

	myWindow.document.write(html);
   }
   
 function popButt(atype,id,ops,types) {
 
if (! types[atype])
		return '';

if (typeof ops['chartpicker'] == 'string') { // chartpicker is a list of valid types: 'pie,multibar' etc
	var asks = ops['chartpicker'].split(',');
	if (asks.indexOf(atype) == -1)
		return '';
	}

 // if (ops.exports) ops.exports = false;
 // ops.inPopup = true;
// ops.title = atype;

 var jsCall = " jsChart('" +id+ "','"+ops.infile+"','" +atype+ "',{}, getChartData() ); ";
 
 return '<button onclick="'+jsCall+'" title="'+atype+' chart"><img src="'+rootpath+'../icons/'+atype+'.png"></button><br />'
 }

// Resizing of a chart on its popup window
function svgscaler(svgid, dir) {

	var sizer = 0.1;

	// Old existing whole canvas of chart
	var svgH = parseInt(jQuery('#chart'+svgid).attr('height'));
	var svgW = parseInt(jQuery('#chart'+svgid).attr('width'));

	// Resize of it
	jQuery('svg').attr('height',svgH + dir*Math.round(svgH*sizer));
	jQuery('svg').attr('width',svgW + dir*Math.round(svgW*sizer));
	// console.info(svgW);

	// Resize of chart itself
	var svgG = '.g'+svgid; // Group of svg objects
	var oldT = jQuery(svgG).attr('transform');
	// Magic of resizing svg chart
	var diffW = Math.round(svgW*(1+sizer)/2);
	var diffH = Math.round(svgH*(1+sizer)/2);
//	console.info(svgW);
//	console.info(diffW);

	if (diffW == diffH) { // For Pies: its center must move when scaled down/up too
		var moveC = ' translate('+diffW+','+diffH+') ';
		sizer = 1+2*sizer;
		jQuery(svgG).attr('transform', moveC+' scale('+ sizer +') '); 
	} else {
		sizer = 1+sizer;
		jQuery(svgG).attr('transform', oldT+' scale('+ sizer +') '); 
	}
	// Scaling window size around a chart
	var w=parseInt(window.innerWidth);
	var h=parseInt(window.innerHeight);
	window.innerWidth = Math.round(w*sizer);
	window.innerHeight = Math.round(h*sizer);
}

// Parse JSON data structure into TSV table
function json2tsv(input) {

	var data = jQuery('#'+input).val();
	data = jQuery.parseJSON(data);
	// console.info(data);
	if (typeof data[0] == 'object' && !data[0].value)
		data = data[0];

	var keys = new Array();
	var values = new Array();
	var labels = new Array();

	if (typeof data == 'object')
	for (cell in data) {
		if (cell == 'key')
			keys.push(data[cell]);
		if (cell == 'values')
			for (i=0; i<data[cell].length ; i++) {
				var dcell = data[cell][i];
				if (dcell.label)
					labels.push(dcell.label);
				if (dcell.value || dcell.value=='0')
					values.push(dcell.value);
			}
		// Simple case
		if (+cell || cell == '0') { // Simple arr of tuples: [label,value]...[label,value]
			labels.push(data[cell]['label']);
			values.push(data[cell]['value']);
		}
	}
	var tab = '	';
	var newline = '\n';
	var tsv = new Array();
	var tsvstr = '';

	tsv.push('keys'+tab+keys[0]);
	tsvstr = 'keys'+tab+keys[0];
	for (i=0; i<values.length; i++)
		tsvstr += newline + labels[i]+tab+values[i];
		// tsv.push(labels[i]+tab+values[i]);
	console.info(tsvstr);
}
/*
function copyToClipboard() { // copyToClipboard(cdata)
//  console.info(field);
  window.prompt("Copy chart's data: Ctrl+C", JSON.stringify(nvd3Dump));
//  window.alert(JSON.stringify(nvd3Dump));
}
*/
// Exporting all types of chart's data
function exportData(id, format) {

	// Building temp file's download name (up to 100 diff. files)
//	var filename = 'tmp_' + id +'_'+Math.floor((Math.random()*100)+1);	
	// Download link
//	var icon = '<img src="'+rootpath+'../icons/excel.png'+'" />';
//	var link = '<button title="Export Chart in Excel format"><a href="'+rootpath+'../tmp/'+filename+'.'+format+'">'+icon+'</a></button>';

	var closeMe = '<button style="float:right; font-size:xx-small" title="Close" onclick="removeMe(\'databuff\')"> [X] </button><br />';

	var data = chartData;
	if (format == 'csv') { 
		var dataout = data.series[0]+';'+data.title+"\n";
		var cols = dataout.length;
		if (data.labels.length == data.values.length && data.datatype == 'direct')
		for (line in data.labels) 
			if (data.values[line]) {
				var line = data.labels[line] + ';' + data.values[line] +"\n";
				dataout = dataout + line;
				if (line.length > cols)
					cols = line.length; 
		}
		var inBox = 'Data<br /><textarea id="databuff" rows="20" cols="'+cols+'" style="color:darkgray">'+dataout+'</textarea>';
		jQuery("#databuffer").html(closeMe+inBox); 
	} else if(format == 'svg') {
		console.info(id);
		var svgX = document.getElementById(id).innerHTML;  // Fetch chart's all svg
		// console.info(svgX);
		var inBox = 'SVG Chart<br /><textarea id="databuff" rows="20" cols="30" style="color:darkgray">'+svgX+'</textarea>';
		jQuery("#databuffer").html(closeMe+inBox);
		// console.info(query);
	} 
	/* else { // TODO: csv & tsv files processing part here
		var jdata = ' "points":' + JSON.stringify(dataout); // 'data = ' + 
		if (data.title)
			jdata = '"title":"'+ data.title +'", '+jdata;
		jdata = 'data = { ' + jdata + ' }';

		$.post(query, { fname: filename, svg: jdata, type:ext })
			.done(function() {
			console.info('download ready!');	
		});
	}
	*/
}
function removeMe(obj) {
	$('#'+obj).remove();
}

// Data set generator, original mychart.js example

function myData() {
    var series1 = [];
    for(var i =1; i < 100; i ++) {
        series1.push({
            x: i, y: 100 / i
        });
    }
    return [
        {
            key: "Series #1",
            values: series1,
            color: "#0000ff"
        }
    ];
}