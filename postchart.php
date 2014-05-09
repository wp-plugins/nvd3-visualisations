<?php

// Create post / page object from charts gallery's input - all automa(g/t)ically
// Including features: set its status draft + create some proper tags keywords
// Requirements: a caller needs to be logged in & having rights to publish on blog.
//
// Inputs: type of chart & URL path to the file of data [& new= post/page]

/* All WP functions env. */
require_once('../../../wp-load.php');

// User's role & level check
$cabs = 0;
if(! is_user_logged_in()) {
	echo 'Sorry, you must be logged in for creating new charts.';
	return;
}

global $current_user; // Use global
get_currentuserinfo(); // Make sure global is set, if not set it.

	$role = $current_user->roles[0];
	$role = $role == 'author'  || $role == 'editor' || $role == 'administrator';
	$cabs = $current_user->allcaps;
	$postable = $cabs[level_2] || $cabs[level_3] || $cabs[level_4];

// echo $role	.' ...<br />';
// echo $postable	.' ...<br />';
// var_dump( $cabs );

$rightsok = 0;
if ($role || $postable)  // High enough role or high enough levels
	$rightsok = 1;

// echo $rightsok	.' ...<br />';

if (! $rightsok) {
	echo 'Sorry, your user rights are not enough to create & edit new charts (you need at least rights of Author and you are now: '.json_encode($current_user->roles).').';
	return;
}

$root = 'wp-content/plugins/nvd3-visualisations/';
$dataset = $root.'data/simpleLineData.json';
if ($_GET['filepath'])
	$dataset = $root.'data/'.$_GET['filepath'];

$ctype = 'simpleline';
if ($_GET['type'])
	$ctype = $_GET['type'];
	
$posttype = 'post';
if ($_GET['new'])
	$posttype = $_GET['new'];

$role = $current_user->roles[0];
$rightsok = $role == 'editor' || $role == 'administrator';
if ($posttype == 'page')
if (! $rightsok)  { // High enough role for edit pages
	echo 'Sorry, your user rights are not enough to create & edit pages of blog (you need at least rights of Editor and you are now: '.json_encode($current_user->roles).').';
	return;
}

$owndata = copyEx($dataset, $_GET['filepath']);

// New Post/Page content from up -> down
$shortcodes = "[loadNVD3] [jsChart type='".$ctype."' datafile='".$owndata."' height=250  width=450 options='{showLegend: true, tooltips: true, showControls: true}' ] ";
$editarea = '<br />[dataEditor infile="'.$owndata.'" type="'.$ctype.'"]'; 

$my_post = array(
  'post_title'    => 'NVD3 Chart',
  'post_content'  => $shortcodes.$editarea, // .$editor, 
  'post_status'   => 'draft', 
  'post_type'     => $posttype, // page
  'tags_input'    => array('NVD3', 'charts', 'SVG')
);

// Insert the post into the database
$error = wp_insert_post( $my_post ); 
if ($error == 0)
	echo 'You were denied to publish NVD3 chart - contact admin of blog !';
else
	echo 'Done! You move next to see chart in a few secs (if not click here: ' . move2js($error, $posttype).')';

return;

function copyEx($dataset, $filename) {

$dirname = '../../../charts_nvd3/';  // root folder of blog

if (!file_exists($dirname)) {
    mkdir($dirname, 0777);
}
$data = file_get_contents('data/' . $filename);
// Test that filename is not existing yet
$addon = '';
if ( file_exists($dirname . $filename) ) // Add random part 2 new file name
	$addon = uniqFile($dirname, $filename);

$fpath = $dirname . $addon . $filename; 
file_put_contents($fpath, $data);

return 'charts_nvd3/' . $addon . $filename;
}
// Find unique data file name
function uniqFile($dirname, $filename) {
	$max = 1000; // Make this bigger if more data sets needed
	for ($i=1; $i<2*$max; $i++) { // Fast Guess
		$addon = mt_rand(1,$max); 
		if (! file_exists($dirname . $addon . $filename) )
			return $addon;
	}

	return 0;
}

function move2js($post, $type) {

	if ($type == 'post')
		$post= 'p='.$post;
	else
		$post= 'page_id='.$post;

	$link = 'http://www.tere-tech.eu/balticfinns/?'.$post.'&preview=true';

	echo '<script> window.location.href="' .$link. '"; </script>';
	return '<a href="'.$link.'"> OPEN NEW CHART </a>';
}
?>