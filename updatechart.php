<?php
// Update chart's data file

// echo json_encode($_POST);

$infile = $_POST['infile'];
$data = rawurldecode($_POST['indata']);

// echo json_encode($data);

$wrote = file_put_contents('../../../'.$infile, $data);

// echo json_encode($wrote);

if ($wrote)
	echo 1;
else
	echo 0;
?>