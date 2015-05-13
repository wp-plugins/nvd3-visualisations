<?php
//	Read standard mySQL table, store into simple CSV/TSV file & return the name of tmp file back

	$host = spec_letters($_GET['host']);
	$user = spec_letters($_GET['user']);
	$pwd = spec_letters($_GET['pwd']);
	$db = spec_letters($_GET['db']);
	$table = spec_letters($_GET['table']);

	$lastrows = $_GET['rows'];
	if (! $lastrows)
		$lastrows = 0;

function spec_letters($str)	{	return utf8_decode($str);	};

// Uncomment next line(s) & fill own mySQL login info, if necessary by security
// $user = 'your_account';
// $pwd = 	'your_password';

	mysql_connect($host, $user, $pwd);
	@mysql_select_db($db) or die("Unable to select database");

	$sep = "\t";
	$newline = "\n";
	$qry = mysql_query("SELECT * FROM ".$table);

	$titles = array();
	$memory = array();
	while($row = mysql_fetch_assoc($qry)) {
		if (empty($titles))
			$titles = array_keys($row);
//		array_push($memory, $row);
		$datarows .= implode($sep, $row).$newline;
	}
	$stuff = implode($sep, $titles).$newline.$datarows;
//	echo $stuff;
	$file = 'mysql'.mt_rand(1,10).'.tsv';
	file_put_contents('data/tmp/'.$file, $stuff);
	echo json_encode('tmp/'.$file);
	return; // main
?>