<?php

include_once "business.php";

$shows = DBAccess::query("SELECT * FROM show WHERE title IS NULL");

for ($i=0; $i<count($shows); ++$i) {
	$show = $shows[$i];
  $json = json_decode($show["data"], true);

  $id = $show["id"];
  $title = str_replace("'", "''", array_key_exists("original_title", $json) ? $json["original_title"] : $json["original_name"]);
	$year = substr($show["type"] === "M" ? $json["release_date"] : $json["first_air_date"], 0, 4);
  $rating = $json["vote_average"];
  $picture = $json["poster_path"];

  DBAccess::exec("UPDATE show SET title='$title', year='$year', rating='$rating', picture='$picture' WHERE id='$id'");
}


?>