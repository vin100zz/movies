<?php

include_once "business.php";

$id = $_GET["id"];
$type = $_GET["type"];

getShow($id, $type);

?>