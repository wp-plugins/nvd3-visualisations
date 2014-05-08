<?php
// Update chart's data file

/* All WP functions env. */
require_once('../../../wp-load.php');

if(! is_user_logged_in()) {
	echo 'Sorry, you must be logged in for creating new charts.';
	return;
} else {

global $current_user; // Use global
get_currentuserinfo(); // Make sure global is set, if not set it.

	$role = $current_user->roles[0];
	// Remove last role if not like anybody who logged in to edit charts of draft posts
	$role =  'author'  || $role == 'editor' || $role == 'administrator' || $role == 'subscriber';
	$cabs = $current_user->allcaps;
	$postable = $cabs[level_2] || $cabs[level_3] || $cabs[level_4];

	$rightsok = 0;
	if ($role || $postable)
		$rightsok = 1;
	if (! $rightsok) {
		echo 'Sorry, not enough user rights to update data.';
		return;
	}
}

$infile = $_POST['infile'];
$data = rawurldecode($_POST['indata']);

if (strpos($infile,'.tsv') || strpos($infile,'.csv'))
	$data = trim($data);
// echo json_encode($data);

$wrote = file_put_contents('../../../'.$infile, $data);

if ($wrote)
	echo 1;
else
	echo 0;

?>