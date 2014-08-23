<?php
/* 
Plugin Name: NVD3 Visualisations
Plugin URI: http://wordpress.org/extend/plugins/d3-simplecharts/
Description: Draw business class interactive charts from any data set of files or own custom functions.
Version: 1.6.5
Author: Jouni Santara
Organisation: TERE-tech ltd 
Author URI: http://www.linkedin.com/in/santara
License: GPL2 
*/

// All included ext.files
function write_headers($rood_dir) {  
	echo '<!-- Start of NVD3 -->'; 

	$root = plugins_url().'/'.$rood_dir.'/'; 	// Single, MU-site, and SSL setups of WP
												// http://codex.wordpress.org/Function_Reference/plugins_url

	// D3.js lib
	// echo '<script src="'.$root.'d3.v3.1.5.js"></script>'; // Uncomment if problems with new d3 v3.4.6 below
	echo '<script src="'.$root.'d3.min.js"></script>';
	// NVD3.js lib
	echo '<link href="'.$root.'nv.d3.css" rel="stylesheet" type="text/css">';

	echo '<script src="'.$root.'nv.d3.min.js"></script>';  // Comment if you need to develope NVD3 core lib
	// echo '<script src="'.$root.'nv.d3.js"></script>'; // activate & edit this source file + minimize when ready

	echo '<script src="'.$root.'xml2json.js"></script>';  // Used for XML data sets reading
	echo '<script src="'.$root.'json2xml.js"></script>';  // Used for JSON/XML conversions
	echo '<script src="'.$root.'colorbrewer.js"></script>'; // Predefined pretty coloring sets

	// NVD3 Visualisations main routines
	echo '<script src="'.$root.'wpcharts.js"></script>';

	echo '<!-- End of NVD3 -->';
}
// Uncomment & write headers part of *every* blog page (=> no need to [loadNVD3])
// add_action('wp_head', 'write_headers');
// Note: to make it faster ext.files not included on page/post with no charts.

function myroot() { // Finding root directory for JavaScript
	$rood_dir='nvd3-visualisations';
	write_headers($rood_dir);
	setRootDir($rood_dir);
}
add_shortcode("rootDir", "myroot");
add_shortcode("loadNVD3", "myroot");

function setRootDir($rood_dir) {  
?>
<script>
	rootpath = '<?php echo plugins_url().'/'.$rood_dir.'/data/' ?>';
</script>
<?php
	return plugins_url() . '/'.$rood_dir.'/';
}

// Nice demo gallery for the most of NVD3 chart types - START
function demoCharts($data) {

	$rood_dir='nvd3-visualisations';
	write_headers($rood_dir);
	$skeleton = demoContainers();
	$count = $skeleton["count"]; // How many demos to show 
	$root = setRootDir($rood_dir);
	// $root = 'wp-content/plugins/nvd3/';
	echo '<script src="'.$root.'examples/gallery.js"></script>';

	// $count = 11;
	if ($data['count'])	$count = $data['count'];
	$xmldemo = 0;
	if ($data['xmldemo'] == 'true' || $data['xmldemo'] == 1)	$xmldemo = 1;

	return $skeleton["places"] . '<script> nvd3Demos('.$count.', '.$xmldemo.'); </script>';
}
add_shortcode("demosGallery", "demoCharts"); 

function demoContainers() { 

	
	$html = '<style type="text/css" media="screen">';
	$html .= '.demo_nvd3 {vertical-align:bottom;} ';
	$html .= '.odds_nvd3 {background-color:#FFEBCD;} ';
	$html .= '.title_nvd3 {color: navy; text-shadow:2px 2px darkgray;} ';
	$html .= '</style>';

	$html .= '<table><tbody><tr class="demo_nvd3">';
	$html .= '<td id="chart1" class="odds_nvd3"></td>';
	$html .= '<td id="chart2"></td>';
	$html .= '</tr><tr class="demo_nvd3">';
	$html .= '<td id="chart3"></td>';
	$html .= '<td id="chart4" class="odds_nvd3"></td>';
	$html .= '</tr><tr class="demo_nvd3">';
	$html .= '<td id="chart5" class="odds_nvd3"></td>';
	$html .= '<td id="chart6"></td>';
	$html .= '</tr><tr class="demo_nvd3">';
	$html .= '<td id="chart7"></td>';
	$html .= '<td id="chart8" class="odds_nvd3"></td>';
	$html .= '</tr><tr class="demo_nvd3">';
	$html .= '<td id="chart9" class="odds_nvd3"></td>';
	$html .= '<td id="chart10"></td>';
	$html .= '</tr><tr class="demo_nvd3">';
	$html .= '<td id="chart11"></td>';
	$html .= '<td id="chart12" class="odds_nvd3"></td>';
	$html .= '</tr></tbody></table>';

	// echo $html;

	return array("count"=>12, "places"=>$html); // Count of cells / demos
}
// Demos - END

// API for the shortcode [jsChart] on WP
function newChart($data) { 

	$id = mt_rand(10,10000);
	if ($data['id']) // User's own defined ID of container
		$id = $data['id'];

	$ctype = 'simpleline';  // Def. chart's type
	if ($data['type'])
		$ctype = $data['type'];

// *** Direct input values turns to options of input data
	$values = '';
	if ($data['values']) {		// Input format: (1,2,3, ...) OR ((1,2,3),(11,22,33), ...)
		$infile = 'foo'; // special flag of direct simple input
		$x = trim($data['values']);
		$x = str_replace("("," ",$x);
		$x = str_replace(")"," ",$x);
		$values = ' values:[' . $x . '] ';
		if ($data['labels']) {
			$x = str_replace("("," ",$data['labels']);
			$x = str_replace(")"," ",$x);
			$x = ' labels:[' . $x . '] ';
			$values = $values . ', ' . $x;
		}
		if ($data['series']) {
			$x = str_replace("("," ",$data['series']);
			$x = str_replace(")"," ",$x);
			$x = ' series:[' . $x . '] ';
			$values = $values . ', ' . $x;
		}
	} else if ($data['class'])  { // Direct data coming from class (& ID's) of tags
		$values = ' class:"' . $data['class'] . '" ';
		if (strpos($data['class'],'id:') > 0) // Object input: {id:"mytable", bgcolor:"blue"}
			$values = ' class:' . $data['class'] . ' ';
		$infile = 'foo'; // special flag of direct simple input
	}

	$options = '';  // Def. options for charts
	if ($data['options']) {
		$options = ', ###'.trim($data['options']);
		if ($values != '')
			$values = $values.',';
		$options = str_replace('###{', '{'.$values.' ', $options);
	} else if ($infile = 'foo' && $values)
		$options = ', { ' . $values . ' }';
// ***

  // Input data file name / rel.path
	if ($data['datafile']) {
		$infile = $data['datafile'];
		$options = str_replace('}', ', infile:"'.$infile.'" }', $options);
	}

	$container = 'div'; // Def.type of container
	if ($data['container']) // User's choice
		$container = $data['container'];

	$height = '250'; // Def.height of chart (must exist)
	if ($data['height']) // User's choice
		$height = $data['height'];
	$width = ' width:450';  // Def. width
	if ($data['width'])
		$width = ' width:'.$data['width'];

	$bgcolor = '';  // Back color
	if ($data['backgroundcolor']) // background-color
		$bgcolor = ' background-color:'.$data['backgroundcolor']. ';';
	$border = '';  // Border style around
	if ($data['border'])
		$border = ' border:'.$data['border']. ';'; 

	$float = ' float:none; ';  
	if ($data['float']) // Embed on right/left
	if ($data['float'] == 'right' || $data['float'] == 'right') {
		$float = ' float:'.$data['float']. ';';
		$container = 'span';  // Best element for container
		$border = ''; // Visually ugly with span tag
	}

	$margin = '';  // Margins around charts
	if ($data['margin'])
		$margin = ' margin:'.$data['margin'].'; '; 

	$jsfunc = 0;  // Case of data's generating JavaScript
	if ($data['js'])
		$jsfunc = 1;

//	$resize = ' resize:both; overflow:auto; ';
	$html = '<'.$container.' id="chart'.$id.'" style="'.$float.$bgcolor.$border.$margin.' ">';
	$html .= "<svg style='height:".$height."px;".$width."px;'/>";
	$html .= "</".$container.">"; 

	if ($jsfunc == 0)  // File name to ext.data file
	  	$infile = "'" . $infile . "'";


	$js = "jsChart('".$id."', ".$infile.", '".$ctype."', {height:'".$height."', ".$width."} ".$options." );";

	$jsCall = "<script>".$js."</script>";

	return $html . $jsCall;
}
add_shortcode("jsChart", "newChart");
/*
// Generata JSON variable from direct data input
function buildTSV($data) {

	
	$values = $data['values'];
	$values = str_replace('(', '', $values);
	$values = str_replace(')', '', $values);
	$values = explode(',',$data['values']);
	$labels = 0;
	if ($data['labels'])
		$labels = explode(',',$data['labels']);
	// TODO: generate TSV temp file and return its name back

	return '';
}
*/
// Print out data editor for a given data set
function genEditor($data) {

if (get_post_status() == 'publish')
	return; // Hide editor from public

$owndata = $data["infile"];
// $chart = $data["type"];

$chartdata = file_get_contents($owndata);

$jscall = "saveData('xmlheader', 'dataset', '".$owndata."')";
$json2xml = "dataConvert('json', 'jsonset', 'xmlset')";
$xml2json = "dataConvert('xml', 'xmlset', 'jsonset')";
$json2tsv = "json2tsv('jsonset')";

$syntax = '';
$syntaxedit = '';
$converter = '';
$convertbox = '';
$jsondata = '';
$xmldata = '';
$header = '';
if (strpos($owndata,'.json')) {
	$syntaxedit = '<div class="nvd3_editor">Edit your data set here and check syntax of JSON.
<iframe name="(c) 2013 Jos de Jong" src="http://www.jsoneditoronline.org/" width="100%" height="500"></iframe></div>';
	$syntax='JSON Editor';
	
	$converter = 'Data Converter';
	$jsondata = $chartdata;
}
if (strpos($owndata,'.xml')) {
	$header = explode("<root>", $chartdata);
	$chartdata = "<root>" . $header[1];
	$header = $header[0];

	$syntaxedit = '<div class="nvd3_editor">Edit your data set here and check syntax of XML.
<iframe src="http://www.freeformatter.com/xml-formatter.html" width="100%" height="500"></iframe></div>';
	$syntax='XML Editor';

	$converter = 'Data Converter</sup>';
	$xmldata = $chartdata;
}
$msg = '<p>Here is your new chart created by NVD3 Visualisations: <b>edit, publish & enjoy it!</b></p> ';
// $datalink = 'Data File: <a href="'.$owndata.'" target="_blank"><b>'.$owndata.'</b></a>';
$datatitle = 'Data File: '.$owndata;

// Return whole editor for a post/page
return $msg.'<link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
<script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
<br />

  <script>
  $(function() { $( "#tabs" ).tabs(); });
  </script>

<div id="tabs">
  <ul>
    <li><a href="#dataedit-1" title="'.$datatitle.'">Chart Data Set</a></li>
    <li><a href="#dataedit-2">'.$syntax.'</a></li>
    <li><a href="#dataedit-3">'.$converter.'</a></li>
  </ul>

  <div id="dataedit-1">
<div class="nvd3_editor">
<button onclick="'.$jscall.'" style="cursor:pointer">Save & Refresh Chart</button><br />
<textarea id="dataset" class="nvd3_editor_text" cols="70" rows="240">
'.$chartdata.'
</textarea>
<span id="xmlheader" style="display: none;">'.$header.'</span>
</div>
  </div>

  <div id="dataedit-2">
    '.$syntaxedit.'
  </div>

  <div id="dataedit-3">
	<textarea id="jsonset" class="nvd3_editor_text" cols="40" rows="240">
		'.$jsondata.'
	</textarea>
	<button onclick="'.$json2tsv.'" style="cursor:pointer">Clone TSV Chart</button>
	<br />
	<button onclick="'.$json2xml.'" style="cursor:pointer">JSON to XML</button>
	<button onclick="'.$xml2json.'" style="cursor:pointer">XML to JSON</button>
	<br />
	<textarea id="xmlset" class="nvd3_editor_text" cols="40" rows="240">
		'.$xmldata.'
	</textarea>
  </div>
  
</div>
	';
}
add_shortcode("dataEditor", "genEditor");
?>
