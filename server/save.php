<?php

include_once "business.php";

$id = $_GET["id"];
$type = $_GET["type"];
$title = $_GET["title"];

$data = file_get_contents('php://input');

saveShow($id, $type, $title, $data);
getShow($id, $type);

?>
