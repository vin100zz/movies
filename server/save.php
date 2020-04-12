<?php

include_once "business.php";

$id = $_GET["id"];
$type = $_GET["type"];
$data = file_get_contents('php://input');

saveShow($id, $type, $data);
getShow($id, $type);

?>
