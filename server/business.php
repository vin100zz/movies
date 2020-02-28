<?php

include_once "db.php";

function getShow($id, $type) {
	$show = DBAccess::singleRow("
	  SELECT *
	  FROM show
	  WHERE id='$id' AND type='$type'
	");

	if (!$show) {
	  return;
	}

	$show["data"] = json_decode($show["data"]);

	$show["tags"] = DBAccess::singleColumn("
	  SELECT id
	  FROM tag, tag_per_show
	  WHERE tag.id=tag_per_show.tag_id AND tag_per_show.show_id='$id' AND tag_per_show.show_type='$type'
	");

	print json_encode($show, JSON_PRETTY_PRINT);
}

function saveShow($id, $type, $data) {
  $show = DBAccess::singleRow("
    SELECT *
    FROM show
    WHERE id='$id' AND type='$type'
  ");

  if (!$show) {
    DBAccess::exec("INSERT INTO show(id, type, data) VALUES ('$id', '$type', '$data')");
  }  
}



?>