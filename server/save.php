<?php

include_once "business.php";

$id = $_GET["id"];
$type = $_GET["type"];

$data = utf8_decode(file_get_contents('php://input'));
$data = str_replace("'", "''", $data);

saveShow($id, $type, $data);
getShow($id, $type);

?>
