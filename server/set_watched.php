<?php

include_once "business.php";

$id = $_GET["id"];
$type = $_GET["type"];
$watched = $_GET["watched"];

if ($watched === "true") {
	$watchedAt = date('Y-m-d H:i:s');
	DBAccess::exec("UPDATE show SET watched='$watched', watched_at='$watchedAt' WHERE id='$id' AND type='$type'");
} else {
	DBAccess::exec("UPDATE show SET watched='$watched', watched_at=NULL WHERE id='$id' AND type='$type'");
}

getShow($id, $type);

?>
