<?php

set_time_limit(300); // 5 minutes

include_once "business.php";

$shows = DBAccess::query("SELECT * FROM show WHERE duration=''");

$nbShows = count($shows);

for ($i=0; $i<$nbShows; ++$i) {
  $show = $shows[$i];
  $json = json_decode($show["data"], true);

  $id = $show["id"];

  //print_r("Processing show " .$id . "<br/>");

  $title = str_replace("'", "''", array_key_exists("original_title", $json) ? $json["original_title"] : $json["original_name"]);
  $year = substr($show["type"] === "M" ? $json["release_date"] : $json["first_air_date"], 0, 4);
  $rating = $json["vote_average"];
  $duration = isset($json["runtime"]) ? $json["runtime"] : '';
  $picture = $json["poster_path"];

  $sqlDuration = $duration ? ("'$duration'") : "NULL";

  DBAccess::exec("UPDATE show SET title='$title', year='$year', rating='$rating', duration=$sqlDuration, picture='$picture' WHERE id='$id'");
}


?>