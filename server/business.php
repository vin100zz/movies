<?php

include_once "db.php";

$today = date('Y-m-d', time());
$dbTodayPath = '../db_backup/shows-' .  $today . '.sqlite';

if (!file_exists($dbTodayPath)) {
	copy('shows.sqlite', $dbTodayPath);
}

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

function listTags() {
	$result = DBAccess::query("SELECT * FROM tag");
	print json_encode($result, JSON_PRETTY_PRINT);
}

function listTagsWithShows() {
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
}

?>