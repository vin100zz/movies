<?php

include_once "business.php";

$id = $_GET["id"];
$type = $_GET["type"];
$rating = $_GET["rating"];

// Si rating est vide, on met NULL, sinon on utilise la valeur
if ($rating === '') {
    $sqlRating = "NULL";
} else {
    $sqlRating = "'" . intval($rating) . "'";
}

DBAccess::exec("UPDATE show SET telerama_rating=$sqlRating WHERE id='$id' AND type='$type'");

getShow($id, $type);

?>

