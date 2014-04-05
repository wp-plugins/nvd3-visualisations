<?php
/*
Plugin Name: NVD3 Visualisations
Plugin URI: http://wordpress.org/extend/plugins/d3-simplecharts/
Description: Draw attractive & accurate interactive charts from any data set of files / own functions.
Version: 1.0.0
Author: Jouni Santara
Organisation: TERE-tech ltd 
Author URI: http://www.linkedin.com/in/santara
License: GPL2
*/

// All included files to headers part of blog page
function write_headers($rood_dir) { 
	echo '<!-- Start of NVD3 -->'; 
	// $root = 'wp-content/plugins/nvd3/';
	$root = 'wp-content/plugins/'.$rood_dir.'/';
	// D3.js
	echo '<script src="'.$root.'d3.v3.js"></script>';
	// NVD3.js
	echo '<link href="'.$root.'nv.d3.css" rel="stylesheet" type="text/css">';
	
	echo '<script src="'.$root.'nv.d3.min.js"></script>';  // Comment if you need to develope NVD3 core
	// echo '<script src="'.$root.'nv.d3.js"></script>'; // & edit this source file

	echo '<script src="'.$root.'xml2json.js"></script>';  // Used for XML data sets reading (TODO)
	// NVD3 tools
	echo '<script src="'.$root.'wpcharts.js"></script>';
	// echo '<script src="'.$root.'mychart.js"></script>'; 
	echo '<!-- End of NVD3 -->';
}
// add_action('wp_head', 'write_headers'); // Disabled: to make it faster for blog if charts are not on page/post.

// Nice demo gallery for the most of NVD3 chart types - START
function demoCharts($data) {

	$rood_dir='nvd3-visualisations';
	write_headers($rood_dir);
	demoContainers();
	$root = setRootDir($rood_dir);
	// $root = 'wp-content/plugins/nvd3/';
	echo '<script src="'.$root.'examples/gallery.js"></script>';
	
	$count = 10;
	if ($data['count'])	$count = $data['count'];
	echo '<script> nvd3Demos('.$count.'); </script>'; // How many demos to show
}
add_shortcode("demosGallery", "demoCharts"); 

function demoContainers() { 

	echo '<table><tbody><tr>';
	echo '<td id="chart1"></td>';
	echo '<td id="chart2"></td>';
	echo '<td id="chart3"></td>';
	echo '</tr><tr>';
	echo '<td id="chart4"></td>';
	echo '<td id="chart5"></td>';
	echo '<td id="chart6"></td>';
	echo '</tr><tr>';
	echo '<td id="chart7"></td>';
	echo '<td id="chart8"></td>';
	echo '<td id="chart9"></td>';
	echo '</tr><tr>';
	echo '<td id="chart10"></td>';
	echo '<td id="chart11"></td>';
	echo '<td id="chart12"></td>';
	echo '</tr></tbody></table>';
}
// Demos - END

// Generate a chart into its place holder dynamically
function new_chart($data) { 

	$container = $data['type']; // Frequent container's types: span / div
	$id = $data['id']; // Need to have unique ID for every chart
	$height = $data['height'];  // Height of svg chart for browser
	$width = '';
	if ($data['width'])
		$width = ' width:'.$data['width'].'px ';

	echo '<'.$container.' id="chart'.$id.'">';
	echo "<svg style='height:".$height."px;".$width."'/>";
	echo "</".$container.">";

	genJS($id);  // Generate JavaScript lines
}
add_shortcode("svgChart", "new_chart");

function myroot() { // Finding root directory for JS
	write_headers();
	setRootDir();
}
add_shortcode("rootDir", "myroot");
add_shortcode("loadNVD3", "myroot");

function genJS($id) {
?>
<script>
	svgChart('<?php echo $id; ?>');
</script>
<?php
}

function setRootDir($rood_dir) {  
?>
<script>
	rootpath = '<?php echo WP_PLUGIN_URL.'/'.$rood_dir.'/data/' ?>';
</script>
<?php
	return WP_PLUGIN_URL . '/'.$rood_dir.'/';
}
?>
