<?php

include_once "business.php";

$name = $_GET["name"];

$name = str_replace("'", "''", utf8_decode($name));

$id = $_GET["id"];

$result = DBAccess::exec("UPDATE tag SET label='$name' WHERE id='$id'");

listTagsWithShows();

?>