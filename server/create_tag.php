<?php

include_once "business.php";

$name = $_GET["name"];

$result = DBAccess::exec("INSERT INTO tag(label) VALUES ('$name')");

listTagsWithShows();

?>