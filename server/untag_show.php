<?php

include_once "db.php";

$showId = $_GET["showId"];
$showType = $_GET["showType"];
$tagId = $_GET["tagId"];

DBAccess::exec("DELETE FROM tag_per_show WHERE show_id='$showId' AND show_type='$showType' AND tag_id='$tagId'");

?>
