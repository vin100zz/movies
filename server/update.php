<?php

include_once "db.php";

$id = $_GET["id"];
$type = $_GET["type"];
$watched = $_GET["watched"];
$toWatch = $_GET["toWatch"];

DBAccess::exec("UPDATE shows SET watched='$watched', towatch='$toWatch' WHERE id='$id' AND type='$type'");

$show = DBAccess::singleRow("SELECT * FROM shows WHERE id='$id' AND type='$type'");
$show["data"] = json_decode($show["data"]);
print json_encode($show, JSON_PRETTY_PRINT);

?>