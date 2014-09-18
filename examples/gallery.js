
function nvd3Demos(pcs, xmldemo) { // pcs = nro of html containers where charts appearvar xml = false;if (xmldemo)  // XML versions of demos asked	xml = true;// All valid names of chart types// ******************************// simpleline	linePlusBar	scatterbubble	viewfinder	multibar	multibar	// cumulativeline	stackedarea	discretebar	horizontalmultibar	donut	pie	bulletjsChart(pcs, '', 'linePlusBar', {height:'200', width:'350'}, { showLegend: true, tooltips: true, transitionDuration: 3000, useInteractiveGuideline: true, xtime: true, xmldemo: xml, shadows:'black', backgroundcolor:'SandyBrown' });
pcs--;// minY:1000000jsChart(pcs, '', 'bullet', {height:'250', width:'300'}, { showLegend: true, xmldemo: xml });pcs--;
jsChart(pcs, '', 'simpleline', {height:'250', width:'300'}, { showLegend: false, transitionDuration:3000, xmldemo: xml, shadows:'black', minY:-1.5, maxY:1.5 });
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
jsChart(pcs, '', 'horizontalmultibar', {height:'250', width:'400'}, { showLegend: false, xmldemo: xml, shadows:'black'  });
pcs--;
jsChart(pcs, '', 'donut', {height:'250', width:'300'}, { showLegend: true, xmldemo: xml, shadows:'black' });pcs--;jsChart(pcs, '', 'pie', {height:'250', width:'300'}, { showLegend: true, xmldemo: xml, shadows:'black' });
}
