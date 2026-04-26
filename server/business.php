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

function stripShowData($json) {
  // Champs racine à conserver
  $keep = [
    'id', 'original_language',
    'original_title', 'title',        // movie
    'original_name', 'name',          // serie
    'overview', 'tagline',
    'vote_average',
    'backdrop_path', 'poster_path',
    'runtime', 'release_date',        // movie
    'first_air_date', 'last_air_date', // serie
    'number_of_seasons', 'number_of_episodes',
  ];

  $stripped = [];
  foreach ($keep as $key) {
    if (isset($json[$key])) {
      $stripped[$key] = $json[$key];
    }
  }

  // genres : garder uniquement le nom
  if (isset($json['genres'])) {
    $stripped['genres'] = array_map(function($g) { return ['name' => $g['name']]; }, $json['genres']);
  }

  // images.backdrops : garder uniquement file_path
  if (isset($json['images']['backdrops'])) {
    $stripped['images']['backdrops'] = array_map(
      function($b) { return ['file_path' => $b['file_path']]; },
      $json['images']['backdrops']
    );
  }

  // videos.results : garder uniquement type et key
  if (isset($json['videos']['results'])) {
    $stripped['videos']['results'] = array_map(
      function($v) { return ['type' => $v['type'], 'key' => $v['key']]; },
      $json['videos']['results']
    );
  }

  // credits.crew : garder uniquement les Directors (id, name, profile_path)
  if (isset($json['credits']['crew'])) {
    $stripped['credits']['crew'] = array_values(array_map(
      function($c) { return ['id' => $c['id'], 'name' => $c['name'], 'profile_path' => $c['profile_path']]; },
      array_filter($json['credits']['crew'], function($c) { return $c['job'] === 'Director'; })
    ));
  }

  // credits.cast : garder les 15 premiers (id, name, character, profile_path)
  if (isset($json['credits']['cast'])) {
    $cast15 = array_slice($json['credits']['cast'], 0, 15);
    $stripped['credits']['cast'] = array_map(
      function($c) { return ['id' => $c['id'], 'name' => $c['name'], 'character' => $c['character'], 'profile_path' => $c['profile_path']]; },
      $cast15
    );
  }

  // similar.results : champs légers uniquement
  $lightFields = ['id', 'title', 'name', 'release_date', 'first_air_date', 'vote_average', 'poster_path'];
  if (isset($json['similar']['results'])) {
    $stripped['similar']['results'] = array_map(
      function($s) use ($lightFields) { return array_intersect_key($s, array_flip($lightFields)); },
      $json['similar']['results']
    );
  }

  // recommendations.results : champs légers uniquement
  if (isset($json['recommendations']['results'])) {
    $stripped['recommendations']['results'] = array_map(
      function($s) use ($lightFields) { return array_intersect_key($s, array_flip($lightFields)); },
      $json['recommendations']['results']
    );
  }

  return $stripped;
}

function saveShow($id, $type, $title, $data) {
  $show = DBAccess::singleRow("
    SELECT *
    FROM show
    WHERE id='$id' AND type='$type'
  ");

  if (!$show) {
    $json = json_decode($data, true);
    $json = stripShowData($json);

    $title = str_replace("'", "''", $title);
    $year = substr($type === "M" ? $json["release_date"] : $json["first_air_date"], 0, 4);
    $rating = $json["vote_average"];
    $duration = isset($json["runtime"]) ? $json["runtime"] : '';
    $picture = $json["poster_path"];

    $data = json_encode($json, JSON_UNESCAPED_UNICODE);
    $data = str_replace("'", "''", $data);

    $sqlDuration = $duration ? ("'$duration'") : "NULL";

    DBAccess::exec("INSERT INTO show(id, type, title, year, rating, duration, picture, data) VALUES ('$id', '$type', '$title', '$year', '$rating', $sqlDuration, '$picture', '$data')");
  }
}

function resyncShow($id, $type, $title, $data) {
  $json = json_decode($data, true);
  $json = stripShowData($json);

  $title = str_replace("'", "''", $title);
  $year = substr($type === "M" ? $json["release_date"] : $json["first_air_date"], 0, 4);
  $rating = $json["vote_average"];
  $duration = isset($json["runtime"]) ? $json["runtime"] : '';
  $picture = $json["poster_path"];

  $data = json_encode($json, JSON_UNESCAPED_UNICODE);
  $data = str_replace("'", "''", $data);

  $sqlDuration = $duration ? ("'$duration'") : "NULL";

  DBAccess::exec("UPDATE show SET rating='$rating', picture='$picture', duration=$sqlDuration, data='$data' WHERE id='$id' AND type='$type'");
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
      SELECT id, type, title, year, rating, telerama_rating, duration, picture, watched
      FROM show, tag_per_show
      WHERE show.id=tag_per_show.show_id AND show.type=tag_per_show.show_type AND tag_per_show.tag_id='$tagId'
    ");
  }

  print json_encode($result, JSON_PRETTY_PRINT);
}

?>