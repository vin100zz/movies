<?php

include_once "db.php";

$result = DBAccess::query("SELECT * FROM tag");

print json_encode($result, JSON_PRETTY_PRINT);

?>