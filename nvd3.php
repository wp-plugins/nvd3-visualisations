<?php
/* 
Plugin Name: NVD3 Visualisations
Plugin URI: http://wordpress.org/extend/plugins/nvd3-visualisations/
Description: Draw business class interactive charts from any data set of files or own custom functions.
Version: 1.8.4
Author: Jouni Santara
Organisation: TERE-tech ltd 
Author URI: http://www.linkedin.com/in/santara
License: GPL2 
*/

// Global of currently active CMS system 
$cms = 'wordpress';
// $cms = 'drupal';

if ($cms == 'wordpress')
	require_once "drupal_foo.php";

function myroot($cms) { // Finding root directory for JavaScript + major include libs
	if (! $cms)
		$cms = 'wordpress';

	write_headers($cms);
	setRootDir($cms);
}
 if ($cms == "wordpress") {
	add_shortcode("rootDir", "myroot");
	add_shortcode("loadNVD3", "myroot");
 }

function setRootDir($cms) {
	if ($cms == 'drupal')
		$path = '../' . drupal_get_path('module', 'nvd3_visualisations') . '/';
	else
		$path = plugins_url() . '/nvd3-visualisations/';
?>
<script>
	rootpath = '<?php echo $path . 'data/' ?>';
	cms = '<?php echo $cms ?>';
</script>
<?php
	return $path;
}

// All included ext.files
function write_headers($cms) {

	if ($cms == 'drupal') {
		setRootDir($cms);
		$root = '../' . drupal_get_path('module', 'nvd3_visualisations') . '/';
		$libs = array($root.'d3.min.js', $root.'nv.d3.css', $root.'nv.d3.min.js', $root.'nv.d3.min.js', $root.'xml2json.js', $root.'json2xml.js', $root.'tsv2json.js', $root.'colorbrewer.js', $root.'locale.js', $root.'wpcharts.js', $root.'examples/gallery.js');
		return $libs;
	}

	$root = '';
	if ($cms != 'wordpress')
		return;

//	$root =  dirname(__FILE__) . '/';
	$root = plugins_url().'/nvd3-visualisations/'; 	// Single, MU-site, and SSL setups of WP
												// http://codex.wordpress.org/Function_Reference/plugins_url
	$incs = '<!-- Start of NVD3 -->';
	// D3.js lib
	// $incs = $incs . '<script src="'.$root.'d3.v3.1.5.js"></script>'; // Uncomment if problems with new d3 v3.4.6 below
	$incs = $incs . '<script src="'.$root.'d3.min.js"></script>';
	// NVD3.js lib
	$incs = $incs . '<link href="'.$root.'nv.d3.css" rel="stylesheet" type="text/css">'; 

	$incs = $incs . '<script src="'.$root.'nv.d3.min.js"></script>';  // Comment this line if you need to develop NVD3 core lib
	// $incs = $incs . '<script src="'.$root.'nv.d3.js"></script>'; 		// + activate & edit this source file + minimize to above file

	$incs = $incs . '<script src="'.$root.'xml2json.js"></script>';  // Used for XML data sets reading
	$incs = $incs . '<script src="'.$root.'json2xml.js"></script>';  // Used for JSON -> XML conversions
	$incs = $incs . '<script src="'.$root.'tsv2json.js"></script>';  // Used for TSV -> JSON converting tool

	$incs = $incs . '<script src="'.$root.'colorbrewer.js"></script>'; // Predefined pretty coloring sets

	// NVD3 Visualisations main routines
	$incs = $incs . '<script src="'.$root.'locale.js"></script>';
	$incs = $incs . '<script src="'.$root.'wpcharts.js"></script>';

	$incs = $incs . '<!-- End of NVD3 -->';
//	$incs = $incs . '<script>console.info("I am Drupal!");</script>';

	echo $incs;
}
/*
function genLinks($html) {
$js = 'jQuery(document).ready(function () { console.info("xxx"); jQuery("head").append("'.$html.'"); });';
drupal_add_js($js,
  array('type' => 'inline', 'scope' => 'footer', 'weight' => 5)
);
}
*/
// Uncomment & get lib files on *every* blog's page/post (eq no need to [loadNVD3] when you call chart's shorcode)
// add_action('wp_head', 'write_headers');
// Note: to make it faster ext.files NOT included on page/post with no charts.

function Gallery_WP($data) {

	// Libs for UX
	echo '<link rel="stylesheet" href="//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css">';
	echo '<script src="//code.jquery.com/jquery-1.11.2.js"></script>';
	echo '<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>';

	myroot('wordpress');
	$root = setRootDir('wordpress');
	echo '<script src="'.$root.'examples/gallery.js"></script>';

	echo '<span id="mycharts"></span>';
	echo '<script> nvd3Charter("mycharts"); </script>';
}
 if ($cms == "wordpress") {
	add_shortcode("NVD3Picker", "Gallery_WP");
	add_shortcode("demosGallery", "Gallery_WP");
 }
 
// Nice demo gallery for the most of NVD3 chart types - START
function demoCharts($data) {

	write_headers(0);
	$skeleton = demoContainers();
	$count = $skeleton["count"]; // How many demos to show 
	$root = setRootDir('wordpress');
	echo '<script src="'.$root.'examples/gallery.js"></script>';

	// $count = 11;
	if ($data['count'])	$count = $data['count'];
	$xmldemo = 0;
	if ($data['xmldemo'] == 'true' || $data['xmldemo'] == 1)	$xmldemo = 1;

	return $skeleton["places"] . '<script> nvd3Demos('.$count.', '.$xmldemo.'); </script>';
}
 if ($cms == "wordpress") {
	add_shortcode("demosGallery_old", "demoCharts");
 }

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

function filterIn($x, $name, $quotes) { 

	$x = trim($x);
	$sep = ",";
	if (strpos($x, "\t") > -1)	// tab => ","
		$x = str_replace("\t", $sep, $x);
	if (strpos($x, ";") > -1)  // ";" => ","
		$x = str_replace(";", $sep, $x);
	if ($quotes && strpos($x, "'") === false && strpos($x, '"') === false) // Automatic quotes: "x","y" ...
		$x = '"' . str_replace($sep, '"'.$sep.'"', $x) . '"';
	if (! strpos($x, "javascript:")) {
		$x = str_replace("(", " ", $x);
		$x = str_replace(")" ," ", $x);
	}

	// Build valid JS array ready
	$x = ' '.$name.':[' . $x . '] ';
	return $x;
}

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
	if ($data['values']) {		// Input format: (1,2,3, ...) OR TODO: ((1,2,3),(11,22,33), ...)
		$infile = 'foo'; 		// special flag of direct simple input set
		$values = filterIn($data['values'], 'values', false);
		if ($data['labels']) {
			$values = $values . ', ' .filterIn($data['labels'], 'labels', true);
		}
		if ($data['series']) {
			$values = $values . ', ' .filterIn($data['series'], 'series', true);
		}
		if ($data['links'])
			$values = $values . ', ' .filterIn($data['links'], 'links', true);
	} else if ($data['class'])  { // Direct data coming from class (& ID's) of tags
		$values = ' class:"' . $data['class'] . '" ';
		if (strpos($data['class'],'id:') > 0) // Object input: {id:"mytable", bgcolor:"blue"}
			$values = ' class:' . $data['class'] . ' ';
		$infile = 'foo'; // special flag of direct simple input
	} else if ($data['table'])  { // Direct data coming from  table
		$values = ' table:"' . $data['table'] . '" ';
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
if ($cms == "wordpress") {
	add_shortcode("jsChart", "newChart");
 }
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

$ctype = $data["type"];

$chartdata = file_get_contents($owndata);

$jscall = "saveData('xmlheader', 'dataset', '".$owndata."')";
$json2xml = "dataConvert('json', 'jsonset', 'xmlset', '".$ctype."')";
$xml2json = "dataConvert('xml', 'xmlset', 'jsonset', '".$ctype."')";
$tsv2json = "dataConvert('tsv', 'jsonset', 'xmlset', '".$ctype."')";
$csv2json = "dataConvert('csv', 'jsonset', 'xmlset', '".$ctype."')";
$json2tsv = "json2tsv('jsonset')";

$syntax = '';
$syntaxedit = '';
$converter = '';
$convertbox = '';
$jsondata = '';
$xmldata = '';
$header = '';
if (strpos($owndata,'.json') || strpos($owndata,'.tsv') || strpos($owndata,'.csv')) {
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
$msg = '<br /><p>Here is your new chart created by NVD3 Visualisations: <b>edit, publish & enjoy it!</b></p> ';
// $datalink = 'Data File: <a href="'.$owndata.'" target="_blank"><b>'.$owndata.'</b></a>';
$datatitle = 'Data File: '.$owndata;
/*
	echo '<link rel="stylesheet" href="//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css">';
	echo '<script src="//code.jquery.com/jquery-1.11.2.js"></script>';
	echo '<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>';
*/
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
	<br />
	<button onclick="'.$json2xml.'" style="cursor:pointer">JSON to XML</button>
	<button onclick="'.$xml2json.'" style="cursor:pointer">XML to JSON</button>
	<br />
	<button onclick="'.$tsv2json.'" style="cursor:pointer" title="Data columns separated by TABs">TSV to JSON</button>
	<button onclick="'.$csv2json.'" style="cursor:pointer" title="Data columns separated by ; or , letters">CSV to JSON</button>
	<br />
	<textarea id="xmlset" class="nvd3_editor_text" cols="40" rows="240">
		'.$xmldata.'
	</textarea>
  </div>
  
</div>
	';
}
 if ($cms == "wordpress") {
	add_shortcode("dataEditor", "genEditor");
 }
?>
