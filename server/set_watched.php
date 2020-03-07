<?php

include_once "business.php";

$id = $_GET["id"];
$type = $_GET["type"];
$watched = $_GET["watched"];

DBAccess::exec("UPDATE show SET watched='$watched' WHERE id='$id' AND type='$type'");

getShow($id, $type);

?>
