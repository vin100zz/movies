<?php

include_once "db.php";

$result = DBAccess::query("SELECT id, type, watched FROM show");

for ($i=0; $i<count($result); ++$i) {
  $showId = $result[$i]['id'];
  $showType = $result[$i]['type'];
  $result[$i]["tags"] = DBAccess::query("
  	SELECT tag.id, tag.label
  	FROM tag, tag_per_show
  	WHERE tag_per_show.tag_id=tag.id AND tag_per_show.show_id=$showId AND tag_per_show.show_type='$showType'
  ");
}

print json_encode($result, JSON_PRETTY_PRINT);

?>