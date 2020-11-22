<?php

include_once "business.php";

$id = $_GET["id"];
$type = $_GET["type"];
$title = $_GET["title"];

$title = str_replace("'", "''", utf8_decode($title));

$data = file_get_contents('php://input');

resyncShow($id, $type, $title, $data);

?>
