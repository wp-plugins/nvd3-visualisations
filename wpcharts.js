
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
	var width = ' width:640px; ';
	if (dims) {
		height = dims['height'];
		width = ' width:'+dims['width']+'px; ';
	}

	if (!options)
		options = new Object(); 

	// console.info(height); // {height:'200', width:'350'}

	var svg = "<svg id='svg"+id+"' style='height:"+height+"px; "+width+"'/>";
	jQuery('#chart'+id).empty();
	jQuery('#chart'+id).html(svg);

	// svgChart(id);
	type = type.toLowerCase();
	dataRead(infile, id, type, options);
}

// Data reader from different sources: demos / own file / function's output 
function dataRead(infile, id, type, options) {

	// console.info(infile);

	if (infile == '')
		demoShows(id, '', type, options);
	else if (infile.indexOf(".json") > 0)
	d3.json(infile,function(error,data) {
		// console.info(data);
		chartSelector(id, data, type, options);
	});
	else if (infile.indexOf('.xml') > 0)
	d3.text(infile,function(error,data) { // d3.xml has parsing problems
		data = buildXML(data);
		chartSelector(id, data, type, options); 
	});
	else if (typeof infile == 'object') // Direct input of data set
		chartSelector(id, infile, type, options);
/* TODO
	else if (infile.indexOf(".tsv") > 0)
	d3.tsv(infile,function(error,data) {
		// console.info(data);
		chartSelector(id, data, type, options);
	});
	else if (infile.indexOf('.csv') > 0)
	d3.csv(infile,function(error,data) {
		chartSelector(id, data, type, options);
	});

	else
		demoShows(id, '', type, options);
*/
}
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

		// var dataX = recursiveTraveller(data);

		if (forceArr)
			return new Array(data);
		return data;
}

/* Failed effort to type cast all bottom nodes into floats / ints
// This is causing the errors of showing out some chart types right - TODO.
function recursiveTraveller(data) {
	if (cycleable(data))
	for (var cell in data)
	
		if (cycleable(data[cell]))
		for (var cell2 in data[cell])
		
			if (cycleable(data[cell][cell2]))
			for (var cell3 in data[cell][cell2])
			
				if (cycleable(data[cell][cell2][cell3]))
				for (var cell4 in data[cell][cell2][cell3])
				
					if (cycleable(data[cell][cell2][cell3][cell4]))
					for (var cell5 in data[cell][cell2][cell3][cell4])
			
						if (cycleable(data[cell][cell2][cell3][cell4][cell5]))
						for (var cell6 in data[cell][cell2][cell3][cell4][cell5])
						
							if (cycleable(data[cell][cell2][cell3][cell4][cell5][cell6]))
							for (var cell7 in data[cell][cell2][cell3][cell4][cell5][cell6]) {
								var x = +data[cell][cell2][cell3][cell4][cell5][cell6][cell7];
								data[cell][cell2][cell3][cell4][cell5][cell6][cell7] = +x;
							}
							else
								if (data[cell][cell2][cell3][cell4][cell5][cell6][cell7])
								console.info(data[cell][cell2][cell3][cell4][cell5][cell6][cell7]);
						else {
							var x = cycleable(data[cell][cell2][cell3][cell4][cell5][cell6]);
							data[cell][cell2][cell3][cell4][cell5][cell6] = x; }
					else {
						var x = cycleable(data[cell][cell2][cell3][cell4][cell5]);
						data[cell][cell2][cell3][cell4][cell5] = x; }
				else {
					var x = cycleable(data[cell][cell2][cell3][cell4]);
					data[cell][cell2][cell3][cell4] = x; }
			else {
				var x = cycleable(data[cell][cell2][cell3]);
				data[cell][cell2][cell3] = x; }
		else {
			var x = cycleable(data[cell][cell2]);
			data[cell][cell2] = x; }
	else {
		var x = cycleable(data[cell]);
		data[cell] = cycleable(x); }

	console.info(data);
	return data;
}
function cycleable(data) {
	if (typeof data == 'object' || typeof data == 'array')
		return true;
//	console.info(typeof +data);
	if (typeof data != 'string')
		return data;
	var x = data-1;
//	console.info(x);
	return x+1;
}
*/
function demoShows(id, data, type, options) {

	// Demo data sets for gallery
	var demos = { lineplusbar:'linePlusBarData.json', simpleline:'simpleLineData.json', cumulativeline:'cumulativeLineData.json', stackedarea: 'stackedAreaData.json', discretebar:'discreteBarData.json', horizontalmultibar:'multibarData.json', pie:'pieData.json', donut:'pieData.json', bullet:'bulletData.json', scatterbubble:'scatterData.json', multibar:'multiData.json', viewfinder:'viewFinderData.json' };

	if (options.xmldemo)
		demos[type] = demos[type].replace(/json/g, 'xml');

	// Home dir of demo data sets
	var infile = 'wp-content/plugins/nvd3/data/'+demos[type];
	if (rootpath) // Global URL of root set by shortcode of WP
		 infile = rootpath + demos[type];

	var desc = 'Demo from file: data/'+demos[type];
	var subs = '<sup> ?</sup>';
	if (infile.indexOf(".json") > 0)
	d3.json(infile,function(error,data) {
		// console.info(data);
		chartSelector(id, data, type, options);
		console.info('Drawing chart demo "'+type+'" from a file: data/'+demos[type]);
		jQuery("#chart"+id).append('<br /><b class="title_nvd3" title="'+desc+'">Chart Type: '+type+subs+'</b>');
	});
	else if (infile.indexOf('.xml') > 0)
	d3.text(infile,function(error,data) { // d3.xml has parsing problems
		data = buildXML(data);
		chartSelector(id, data, type, options);
		console.info('Drawing chart demo "'+type+'" from a XML file: data/'+demos[type]); // demos[type]
		jQuery("#chart"+id).append('<br /><b class="title_nvd3" title="'+desc+'">Chart Type: '+type+subs+'</b>');
	});
}

function chartSelector(id, data, type, options) {

	if (type == 'lineplusbar')
		linePlusBar(id, data, options);
	else if (type == 'simpleline')
		simpleLine(id, data, options);
	else if (type == 'scatterbubble')
		ScatterBubble(id, data, options);
	else if (type == 'viewfinder')
		viewFinder(id, data, options)
	else if (type == 'multibar')
		MultiBar(id, data, options);
	else if (type == 'cumulativeline')
		cumulativeLineData(id, data, options);
	else if (type == 'stackedarea')
		stackedArea(id, data, options);
	else if (type == 'discretebar')
		discreteBar(id, data, options);
	else if (type == 'horizontalmultibar')
		horizontalMultiBar(id, data, options);
	else if (type == 'pie')
		Pie(id, data, options);
	else if (type == 'donut')
		Donut(id, data, options); 
	else if (type == 'bullet')
		Bullet(id, data, options);
}
// Axis should be time formatted with chart ?
function timeStamp(x, options) {
	if (options.xtime)
			return d3.time.format('%x')(new Date(x))
	else
		return x
}

/* ALL Supported NVD3 Chart Types: 1 function/type */

// Drawing chart: linePlusBar
function linePlusBar(chartID, data, options) {
 
  nv.addGraph(function() {
	  var chart = nv.models.linePlusBarChart()
            .margin({top: 30, right: 90, bottom: 50, left: 90})
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

	  d3.select("#svg"+chartID)
        .datum(data)
        .transition()
        .duration(500)
        .call(chart);

      nv.utils.windowResize(chart.update); 

      return chart;
  });
}
// Drawing chart: cumulativeLineData
function cumulativeLineData(chartID, data, options) {
 
  nv.addGraph(function() {
    var chart = nv.models.cumulativeLineChart()
                  .x(function(d) { return d[0] })
                  .y(function(d) { return d[1]/100 }) //adjusting, 100% is 1.00, not 100 as it is in the data
                  .color(d3.scale.category10().range())
                  .useInteractiveGuideline(true)
                  ;

    // console.info(data);

	 chart.xAxis
        .tickValues([1078030800000,1122782400000,1167541200000,1251691200000])
        .tickFormat(function(d) {
            return d3.time.format('%x')(new Date(d))
          });

    chart.yAxis
        .tickFormat(d3.format(',.1%')); 

	  chart.options(options);

	  d3.select("#svg"+chartID)
        .datum(data)
        .call(chart);

    //TODO: Figure out a good way to do this automatically
    nv.utils.windowResize(chart.update); 

	return chart;
  });
}
// Drawing chart: stackedArea
function stackedArea(chartID, data, options) {

  nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
                  .margin({right: 100})
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
          return d3.time.format('%x')(new Date(d)) 
    });

    chart.yAxis
        .tickFormat(d3.format(',.2f'));

    chart.options(options);

	d3.select("#svg"+chartID)
      .datum(data)
      .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
}
// Drawing chart: discreteBar
function discreteBar(chartID, data, options) {

nv.addGraph(function() {
  var chart = nv.models.discreteBarChart()
      .x(function(d) { return d.label })    //Specify the data accessors.
      .y(function(d) { return d.value })
      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
      .tooltips(false)        //Don't show tooltips
      .showValues(true)       //...instead, show the bar value right on top of each bar.
      .transitionDuration(350)
      ;

    chart.options(options);

  d3.select("#svg"+chartID)
      .datum(data)
      .call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});
}
// Drawing chart: horizontalMultiBar
function horizontalMultiBar(chartID, data, options) {

  nv.addGraph(function() {
    var chart = nv.models.multiBarHorizontalChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .margin({top: 30, right: 20, bottom: 50, left: 175})
        .showValues(true)           //Show bar value next to each bar.
        .tooltips(true)             //Show tooltips on hover.
        .transitionDuration(350)
        .showControls(true);        //Allow user to switch between "Grouped" and "Stacked" mode.

    chart.yAxis
        .tickFormat(d3.format(',.2f'));

	chart.options(options);

	d3.select("#svg"+chartID)
        .datum(data)
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });

}
// Drawing chart: ScatterBubble
function ScatterBubble(chartID, data, options) {

nv.addGraph(function() {
  var chart = nv.models.scatterChart()
                .showDistX(true)    //showDist, when true, will display those little distribution lines on the axis.
                .showDistY(true)
                .transitionDuration(350)
                .color(d3.scale.category10().range());

  //Configure how the tooltip looks.
  chart.tooltipContent(function(key) {
      return '<h3>' + key + '</h3>';
  });

  //Axis settings
  chart.xAxis.tickFormat(d3.format('.02f'));
  chart.yAxis.tickFormat(d3.format('.02f'));

  //We want to show shapes other than circles.
  chart.scatter.onlyCircles(false);

  // var myData = randomData(4,40);
  // console.info( JSON.stringify(myData) );

	chart.options(options);

  d3.select("#svg"+chartID)
      .datum(data)
      .call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});
}
// Drawing chart: MultiBar
function MultiBar(chartID, data, options) {

nv.addGraph(function() {
    var chart = nv.models.multiBarChart()
      .transitionDuration(350)
      .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
      .rotateLabels(0)      //Angle to rotate x-axis labels.
      .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
      .groupSpacing(0.1)    //Distance between each group of bars.
    ;

    chart.xAxis
        .tickFormat(d3.format(',f'));

    chart.yAxis
        .tickFormat(d3.format(',.1f'));
//   console.info( JSON.stringify( exampleData() ) );

	chart.options(options);

    d3.select("#svg"+chartID)
        .datum(data)
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
});
}
// Drawing chart: viewFinder
function viewFinder(chartID, data, options) {

nv.addGraph(function() {
  var chart = nv.models.lineWithFocusChart();

  chart.xAxis
      .tickFormat(d3.format(',f'));

  chart.yAxis
      .tickFormat(d3.format(',.2f'));

  chart.y2Axis
      .tickFormat(d3.format(',.2f'));

	chart.options(options);

    d3.select("#svg"+chartID)
      .datum(data)
      .transition().duration(500)
      .call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});
}
// Drawing chart: simpleLine
function simpleLine(chartID, data, options) {

/*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
nv.addGraph(function() {
  var chart = nv.models.lineChart()
                .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                .transitionDuration(350)  //how fast do you want the lines to transition?
                .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
  ;

  chart.xAxis     //Chart x-axis settings
      .axisLabel('Time (ms)')
      .tickFormat(d3.format(',r'));

  chart.yAxis     //Chart y-axis settings
      .axisLabel('Voltage (v)')
      .tickFormat(d3.format('.02f'));

//  var myData = sinAndCos();   //You need data...

	chart.options(options);

  d3.select("#svg"+chartID) 
      .datum(data)         //Populate the <svg> element with chart data...
      .call(chart);          //Finally, render the chart!

  //Update the chart when window resizes.
  nv.utils.windowResize(function() { chart.update() });
  return chart;
});
}
// Drawing chart: Pie
function Pie(chartID, data, options) {

//Regular pie chart example
nv.addGraph(function() {
  var chart = nv.models.pieChart()
      .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .showLabels(true);

	chart.options(options);

	d3.select("#svg"+chartID)
        .datum(data)
        .transition().duration(350)
        .call(chart);

  return chart;
});
}
// Drawing chart: Donut
function Donut(chartID, data, options) {

//Donut chart example
nv.addGraph(function() {
  var chart = nv.models.pieChart()
      .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .showLabels(true)     //Display pie labels
      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
      ;

	chart.options(options);

	d3.select("#svg"+chartID)
        .datum(data)
        .transition().duration(350)
        .call(chart);

  return chart;
});
}
// Drawing chart: Bullet
function Bullet(chartID, data, options) {

nv.addGraph(function() {  
  var chart = nv.models.bulletChart();

	chart.options(options);

	d3.select("#svg"+chartID)
      .datum(data)
      .transition().duration(1000)
      .call(chart);

  return chart;
});
}

function checkJQ() {

	if ('undefined' == typeof window.jQuery)
		window.alert('Please, load jQuery to use NVD3 tools properly.');
	else
		console.info('jQuery: ok.');
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