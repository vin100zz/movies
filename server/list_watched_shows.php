<?php

include_once "db.php";

$result = DBAccess::query("
  SELECT id, type, title, year, rating, telerama_rating, duration, picture, watched, watched_at
  FROM show
  WHERE watched='true'
  ORDER BY (watched_at IS NULL) ASC, watched_at DESC, rowid DESC
");

print json_encode($result, JSON_PRETTY_PRINT);

?>
