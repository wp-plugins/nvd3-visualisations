
function nvd3Demos(pcs) { // pcs = nro of html container where chart appears

jsChart(pcs, '', 'linePlusBar', {height:'200', width:'350'}, { showLegend: true, tooltips: true, transitionDuration: 3000, useInteractiveGuideline: true, xtime: true });
pcs--;
jsChart(pcs, '', 'simpleline', {height:'250', width:'300'}, { showLegend: false, transitionDuration:3000});
pcs--;
jsChart(pcs, '', 'scatterbubble', {height:'250', width:'300'}, { showLegend: true });
pcs--;
jsChart(pcs, '', 'viewfinder', {height:'250', width:'300'}, { showLegend: true });
pcs--;
jsChart(pcs, '', 'multibar', {height:'250', width:'300'}, { showLegend: false });
pcs--;
jsChart(pcs, '', 'cumulativeline', {height:'250', width:'300'}, { showLegend: false });
pcs--;
jsChart(pcs, '', 'stackedarea', {height:'250', width:'300'}, { showLegend: false });
pcs--;
jsChart(pcs, '', 'discretebar', {height:'250', width:'300'}, { color: ['red','green','blue','orange','brown','navy','yellow','black'] });
pcs--;
jsChart(pcs, '', 'horizontalmultibar', {height:'250', width:'400'}, { showLegend: false });
pcs--;
jsChart(pcs, '', 'pie', {height:'250', width:'300'}, { showLegend: true });
}
