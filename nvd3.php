<?php
/*
Plugin Name: NVD3 Visualisations
Plugin URI: http://wordpress.org/extend/plugins/d3-simplecharts/
Description: Draw business class interactive charts from any data set of files or own custom functions.
Version: 1.2.3
Author: Jouni Santara
Organisation: TERE-tech ltd 
Author URI: http://www.linkedin.com/in/santara
License: GPL2
*/

// All included ext.files
function write_headers($rood_dir) { 
	echo '<!-- Start of NVD3 -->';

	$root = 'wp-content/plugins/'.$rood_dir.'/';
	// D3.js lib
	// echo '<script src="'.$root.'d3.v3.1.5.js"></script>'; // Uncomment if problems with new d3 v3.4.6 below
	echo '<script src="'.$root.'d3.min.js"></script>';
	// NVD3.js lib
	echo '<link href="'.$root.'nv.d3.css" rel="stylesheet" type="text/css">';
	
	echo '<script src="'.$root.'nv.d3.min.js"></script>';  // Comment if you need to develope NVD3 core
	// echo '<script src="'.$root.'nv.d3.js"></script>'; // & edit this source file

	echo '<script src="'.$root.'xml2json.js"></script>';  // Used for XML data sets reading (TODO)
	// NVD3 Visualisations
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
	rootpath = '<?php echo WP_PLUGIN_URL.'/'.$rood_dir.'/data/' ?>';
</script>
<?php
	return WP_PLUGIN_URL . '/'.$rood_dir.'/';
}

// Nice demo gallery for the most of NVD3 chart types - START
function demoCharts($data) {

	$rood_dir='nvd3-visualisations';
	write_headers($rood_dir);
	$count = demoContainers();
	$root = setRootDir($rood_dir);
	// $root = 'wp-content/plugins/nvd3/';
	echo '<script src="'.$root.'examples/gallery.js"></script>';

	// $count = 11;
	if ($data['count'])	$count = $data['count'];
	$xmldemo = 0;
	if ($data['xmldemo'] == 'true' || $data['xmldemo'] == 1)	$xmldemo = 1;

	echo '<script> nvd3Demos('.$count.', '.$xmldemo.'); </script>'; // How many demos to show 
}
add_shortcode("demosGallery", "demoCharts"); 

function demoContainers() { 

	echo '<style type="text/css" media="screen">';
	echo '.demo_nvd3 {vertical-align:bottom;} ';
	echo '.odds_nvd3 {background-color:#FFEBCD;} ';
	echo '.title_nvd3 {color: navy; text-shadow:2px 2px darkgray;} ';
	echo '</style>';

	echo '<table><tbody><tr class="demo_nvd3">';
	echo '<td id="chart1" class="odds_nvd3"></td>';
	echo '<td id="chart2"></td>';
	echo '<td id="chart3" class="odds_nvd3"></td>';
	echo '</tr><tr class="demo_nvd3">';
	echo '<td id="chart4"></td>';
	echo '<td id="chart5" class="odds_nvd3"></td>';
	echo '<td id="chart6"></td>';
	echo '</tr><tr class="demo_nvd3">';
	echo '<td id="chart7" class="odds_nvd3"></td>';
	echo '<td id="chart8"></td>';
	echo '<td id="chart9" class="odds_nvd3"></td>';
	echo '</tr><tr class="demo_nvd3">';
	echo '<td id="chart10"></td>';
	echo '<td id="chart11" class="odds_nvd3"></td>';
	echo '<td id="chart12"></td>';
	echo '</tr></tbody></table>';

	return 12; // Count of cells / demos
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

	$infile = '';  // Input data file name / rel.path
	if ($data['datafile'])
		$infile = $data['datafile'];

	$container = 'span'; // Def.type of container
	if ($data['type']) // User's choice
		$container = $data['type'];

	$height = '250'; // Def.height of chart (must exist)
	if ($data['height']) // User's choice
		$height = $data['height'];
	$width = ' width:450';  // Def. width
	if ($data['width'])
		$width = ' width:'.$data['width'];

	$options = '';  // Def. options
	if ($data['options'])
		$options = ', '.$data['options'];

	$html = '<'.$container.' id="chart'.$id.'">';
	$html .= "<svg style='height:".$height."px;".$width."px;'/>";
	$html .= "</".$container.">"; 

	$js = "jsChart('".$id."', '".$infile."', '".$ctype."', {height:'".$height."', ".$width."} ".$options." );";

	$jsCall = "<script>".$js."</script>";

	return $html . $jsCall;
}
add_shortcode("jsChart", "newChart");

?>
