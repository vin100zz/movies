<?php

include_once "db.php";

$id = $_GET["id"];
$type = $_GET["type"];

DBAccess::exec("DELETE FROM shows WHERE id='$id' AND type='$type'");

?>
