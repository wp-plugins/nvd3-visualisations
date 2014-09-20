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

$direct = '';
if ($_GET['filepath'])
	$owndata = copyEx($dataset, $_GET['filepath']);
else if ($_GET['template']) { // Direct input or from Document cells
	$direct = genTemplate($_GET['template']);
	$owndata = '';
	}

// New Post/Page content from up -> down
$title = '"Own Data Chart"';
$scolor = ' "Black" ';
$scaler = '"*1"';
$ctitle = '"Calculate:"';
$cunit = '"unit"';
$shortcodes = "[loadNVD3] <br /> [jsChart type='".$ctype."' datafile='".$owndata."' ".$direct." height=250  width=450 float='none' border='3px outset gray' backgroundcolor='darkgray' options='{ shadows:".$scolor.", showLegend: true, tooltips: true, showControls: true, noPopup: false, noResize: false, title: ".$title.", chartpicker:true, exports:false, autocoloring:true, calculator:".$scaler.", calculatorlock:false, calculatorhide:false, calculatortitle:".$ctitle.", calculatorunit:".$cunit." }' ] ";

$datacells = '';
$editarea = '<br />[dataEditor type="'.$ctype.'" infile="'.$owndata.'"]';
if ($direct) { 
	$editarea = ''; // No file editor for templates inside doc
	
	if ($_GET['template'] == 'table')  // Template of table with its id (TODO: autocoloring fix)
		$datacells = getHelp('table') . '<p><b>Example Array</b><br />' . getArray('mypets') . '</p>';

	if ($_GET['template'] == 'table2')  // Template of 2x2 table with its id
		$datacells = getHelp('table2') . '<p><b>Example Array</b><br />' . getBigArray('mypets') . '</p>';

	if ($_GET['template'] == 'cells')  // Template of separate doc's data cells with their class & id tags.
		$datacells = getHelp('cells') . '<p><b>Example Sentence + its Live Data</b><br />I have <span id="Cats" class="mypets">14</span> cats and <span id="Cows" class="mypets">2</span> cows plus <span id="Birds" class="mypets">11</span> birds at my home as pets.</p>';

	if ($_GET['template'] == 'direct')  // Template of separate doc's data cells with their class & id tags.
		$datacells = getHelp('direct');

	$datacells .= '<br />';
}

$my_post = array(
  'post_title'    => 'NVD3 Chart',
  'post_content'  => $datacells.$shortcodes.$editarea, // .$editor, 
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

	$link = '../../../?'.$post.'&preview=true';

	echo '<script> window.location.href="' .$link. '"; </script>';
	return '<a href="'.$link.'"> OPEN NEW CHART </a>';
}

// Segments of templates for jsChart call
function genTemplate($type) {

	if ($type == 'direct') {
		$values = ' values="(177,77,17)" ';
		$labels = ' labels="(cats,dogs,birds)" ';
		$series = ' series="(Pets)" ';
		return $values.$labels.$series; 
	}
	if ($type == 'table' || $type == 'table2') {
		return ' table="mypets" '; 
	}
	if ($type == 'cells') {
		return ' class="mypets" '; 
	}
}

function getArray($id) {

return '
<table id="'.$id.'">
<tbody>
<tr>
<td></td>
<td align="LEFT" bgcolor="#C5000B">Cats</td>
</tr>
<tr>
<td align="LEFT" bgcolor="#66CC99">Year 2000</td>
<td align="RIGHT" bgcolor="#C5000B">7</td>
</tr>
<tr>
<td align="LEFT" bgcolor="#66CC99">Year 2005</td>
<td align="RIGHT" bgcolor="#C5000B">2</td>
</tr>
<tr>
<td align="LEFT" bgcolor="#66CC99">Year 2010</td>
<td align="RIGHT" bgcolor="#C5000B">12</td>
</tr>
</tbody>
</table>
';

}

function getBigArray($id) {  // 2x2 html array back

return '
<table id="'.$id.'">
<tbody>
<tr>
<td height="17"></td>
<td bgcolor="yellow">Cats</td>
<td bgcolor="lime">Cows</td>
<td bgcolor="blue">Birds</td>
</tr>
<tr>
<td bgcolor="pink" height="17">Year 2000</td>
<td bgcolor="yellow">7</td>
<td bgcolor="lime">18</td>
<td bgcolor="blue">1</td>
</tr>
<tr>
<td bgcolor="pink" height="17">Year 2005</td>
<td bgcolor="yellow">2</td>
<td bgcolor="lime">9</td>
<td bgcolor="blue">2</td>
</tr>
<tr>
<td bgcolor="pink" height="17">Year 2010</td>
<td bgcolor="yellow">12</td>
<td bgcolor="lime">4</td>
<td bgcolor="blue">3</td>
</tr>
</tbody>
</table>
';
}

function getHelp($type) {

	$t = '<b>Steps for Your Own Data</b><br />';

	$h = '';
	if ($type == 'table'  || $type == 'table2')
		$h = $t.'<ol><li>Copy & Paste your table from <b>OpenOffice Calc</b> here.</li><li>Go HTML mode and copy ID of tiny example table below for your imported new table.</li><li>Remove example table & this text.</li><li>Check: that 2nd row colors of background of table are copied to chart properly from your table.</li><li>Refine the look by <b>autocoloring</b> option & edit rest of document normally ready + publish.</li></ol><br />';
	if ($type == 'cells')
		$h = $t.'<ol><li>Write / copy your text content normally into this page.</li><li>Move to HTML mode and copy <b>span tag</b> from one number of example below.</li><li>Use this html to mark your own embedded numbers.</li><li>Update each ID to name your data cell as you wish.</li><li>Edit rest of document normally ready & publish it.</li></ol><br />';
	if ($type == 'direct')
		$h = $t.'<ol><li>Move to HTML mode and check call of shortcode for its chart below.</li><li>Copy & paste your own data into between "(" and ")" brackets of values, labels, and series.</li><li>Edit rest of document normally ready & publish it.</li></ol><br />';

	$style = ' style="background-color:darkgray; color:navy; border: 3px outset gray " ';
	return '<div '.$style.'>' . $h . '</div>';
}
?>