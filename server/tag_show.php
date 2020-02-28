<?php

include_once "db.php";

$showId = $_GET["showId"];
$showType = $_GET["showType"];
$tagId = $_GET["tagId"];

DBAccess::exec("INSERT INTO tag_per_show(show_id, show_type, tag_id) VALUES ('$showId', '$showType', '$tagId')");

?>
