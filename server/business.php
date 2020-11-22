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

function saveShow($id, $type, $title, $data) {
  $show = DBAccess::singleRow("
    SELECT *
    FROM show
    WHERE id='$id' AND type='$type'
  ");

  if (!$show) {
    $json = json_decode($data, true);

    $title = str_replace("'", "''", utf8_decode($title));
    $year = substr($type === "M" ? $json["release_date"] : $json["first_air_date"], 0, 4);
    $rating = $json["vote_average"];
    $picture = $json["poster_path"];

    $data = utf8_decode($data);
    $data = str_replace("'", "''", $data);

    DBAccess::exec("INSERT INTO show(id, type, title, year, rating, picture, data) VALUES ('$id', '$type', '$title', '$year', '$rating', '$picture', '$data')");
  }
}

function resyncShow($id, $type, $title, $data) {
  $json = json_decode($data, true);

  $title = str_replace("'", "''", utf8_decode($title));
  $year = substr($type === "M" ? $json["release_date"] : $json["first_air_date"], 0, 4);
  $rating = $json["vote_average"];
  $picture = $json["poster_path"];

  $data = utf8_decode($data);
  $data = str_replace("'", "''", $data);

  DBAccess::exec("UPDATE show SET rating='$rating', picture='$picture', data='$data' WHERE id='$id' AND type='$type'");
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
      SELECT id, type, title, year, rating, picture, watched
      FROM show, tag_per_show
      WHERE show.id=tag_per_show.show_id AND show.type=tag_per_show.show_type AND tag_per_show.tag_id='$tagId'
    ");
  }

  print json_encode($result, JSON_PRETTY_PRINT);
}

?>