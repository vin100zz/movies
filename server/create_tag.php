<?php

include_once "business.php";

$name = $_GET["name"];

$name = str_replace("'", "''", utf8_decode($name));

$result = DBAccess::exec("INSERT INTO tag(label, rank) VALUES ('$name', 999)");

listTagsWithShows();

?>