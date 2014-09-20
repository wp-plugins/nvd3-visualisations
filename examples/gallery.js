// Generate the charts picking tool for real data's templatefunction nvd3Charter(myID) {var xml = false; // For debug of XML demo files// All valid names of chart types// ******************************	var types = ['simpleline', 'lineplusbar', 'scatterbubble', 'viewfinder', 'multibar', 'cumulativeline',	'stackedarea',	'discretebar',	'horizontalmultibar',	'donut',	'pie',	'bullet'];var pcs = types.length;var tabs = '';var charts = '';for (i=0; i<pcs; i++) {	var myChart = '<span id="chart'+i+'">Empty Chart ('+(i+1)+') Container</span>';	tabs = tabs + '<li><a href="#tabs-' + i + '" style="font-size:10px">' + types[i] + '</a></li>';	charts = charts + '<div id="tabs-' + i + '">'+myChart+'</div>'; } var buildTabs = '<script> jQuery(function() { jQuery( "#tabs" ).tabs(); }); </script>';  var msg = "Select here your chart's basic type, its data source, and where new chart can appear on WordPress.<br />"; var res = msg + buildTabs + '<div id="tabs"><ul>' + tabs + '</ul>' + charts + '</div>';  jQuery("#"+myID).html(res); // Print out chart's container  var h = 350; var w = 850;  for (i=0; i<pcs; i++) { // Generate all types of charts	var timeaxis = false;	if (types[i] == 'cumulativeline' || types[i] == 'stackedarea' || types[i] == 'lineplusbar')		timeaxis = true;	jsChart(i, '', types[i], {height:h, width:w}, { xtime: timeaxis, showLegend: true, xmldemo: xml, shadows:'black', backgroundcolor:'darkgray'  }); } return;}// Old gallery in table format, call: []
function nvd3Demos(pcs, xmldemo) { // pcs = nro of html containers where charts appearvar xml = false;if (xmldemo)  // XML versions of demos asked	xml = true;// All valid names of chart types// ******************************// simpleline	linePlusBar	scatterbubble	viewfinder	multibar	multibar	// cumulativeline	stackedarea	discretebar	horizontalmultibar	donut	pie	bulletjsChart(pcs, '', 'linePlusBar', {height:'250', width:'350'}, { showLegend: true, tooltips: true, transitionDuration: 3000, useInteractiveGuideline: true, xtime: true, xmldemo: xml, shadows:'black', backgroundcolor:'SandyBrown' });
pcs--;// minY:1000000 jsChart(pcs, '', 'bullet', {height:'250', width:'300'}, { showLegend: true, xmldemo: xml });pcs--;
jsChart(pcs, '', 'simpleline', {height:'250', width:'300'}, { showLegend: false, transitionDuration:3000, xmldemo: xml, shadows:'black', domain:{minY:-1.5, maxY:2} });
pcs--;
jsChart(pcs, '', 'scatterbubble', {height:'250', width:'300'}, { showLegend: true, xmldemo: xml, shadows:'black' });
pcs--; 
jsChart(pcs, '', 'viewfinder', {height:'250', width:'300'}, { showLegend: true, xmldemo: xml, shadows:'black' });
pcs--;
jsChart(pcs, '', 'multibar', {height:'250', width:'300'}, { showLegend: false, xmldemo: xml, shadows:'black'  });
pcs--;
jsChart(pcs, '', 'cumulativeline', {height:'250', width:'300'}, { showLegend: false, xmldemo: xml, xtime: true, shadows:'black', backgroundcolor:'SkyBlue' });
pcs--;var bg_pict = rootpath + '../backgrounds/';
jsChart(pcs, '', 'stackedarea', {height:'250', width:'300'}, { showLegend: false, xmldemo: xml, xtime: true, shadows:'black', backgroundimage:bg_pict+'continents1.jpg'  });
pcs--;
jsChart(pcs, '', 'discretebar', {height:'250', width:'300'}, { color: ['red','green','blue','orange','brown','navy','yellow','black'], xmldemo: xml, shadows:'black', backgroundimage:bg_pict+'continents11.jpg', minY:-200 });
pcs--; 
jsChart(pcs, '', 'horizontalmultibar', {height:'250', width:'450'}, { showLegend: false, xmldemo: xml, shadows:'black'  });
pcs--;
jsChart(pcs, '', 'donut', {height:'250', width:'300'}, { showLegend: true, xmldemo: xml, shadows:'black' });pcs--;jsChart(pcs, '', 'pie', {height:'250', width:'300'}, { showLegend: true, xmldemo: xml, shadows:'black' });
}
