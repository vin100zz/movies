<?php

include_once "db.php";

$result = DBAccess::query("SELECT * FROM tag");

for ($i=0; $i<count($result); ++$i) {
  $tagId = $result[$i]['id'];
  $result[$i]["shows"] = DBAccess::query("
  	SELECT *
  	FROM show, tag_per_show
  	WHERE show.id=tag_per_show.show_id AND show.type=tag_per_show.show_type AND tag_per_show.tag_id='$tagId'
  ");

  for ($j=0; $j<count($result[$i]["shows"]); ++$j) {
    $result[$i]["shows"][$j]["data"] = json_decode($result[$i]["shows"][$j]["data"]);
  }
}

print json_encode($result, JSON_PRETTY_PRINT);

?>