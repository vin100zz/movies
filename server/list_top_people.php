<?php

include_once "db.php";

$rows = DBAccess::query("
  SELECT id, type, title, year, rating, telerama_rating, duration, picture, watched, data
  FROM show
  WHERE watched='true'
");

$directors = [];
$actors = [];

foreach ($rows as $row) {
  $data = json_decode($row['data'], true);
  if (!$data) {
    continue;
  }

  $showLight = [
    'id' => $row['id'],
    'type' => $row['type'],
    'title' => $row['title'],
    'year' => $row['year'],
    'rating' => $row['rating'],
    'telerama_rating' => $row['telerama_rating'],
    'duration' => $row['duration'],
    'picture' => $row['picture'],
    'watched' => $row['watched'],
  ];

  if (isset($data['credits']['crew'])) {
    $seenDirectorIds = [];
    foreach ($data['credits']['crew'] as $crew) {
      $personId = $crew['id'];
      if (isset($seenDirectorIds[$personId])) {
        continue;
      }
      $seenDirectorIds[$personId] = true;

      if (!isset($directors[$personId])) {
        $directors[$personId] = ['personId' => $personId, 'personName' => $crew['name'], 'shows' => []];
      }
      $directors[$personId]['shows'][] = $showLight;
    }
  }

  if (isset($data['credits']['cast'])) {
    $seenActorIds = [];
    foreach ($data['credits']['cast'] as $cast) {
      $personId = $cast['id'];
      if (isset($seenActorIds[$personId])) {
        continue;
      }
      $seenActorIds[$personId] = true;

      if (!isset($actors[$personId])) {
        $actors[$personId] = ['personId' => $personId, 'personName' => $cast['name'], 'shows' => []];
      }
      $actors[$personId]['shows'][] = $showLight;
    }
  }
}

function peopleWithAtLeastShowCount($people, $minShows) {
  $people = array_values(array_filter($people, function($p) use ($minShows) { return count($p['shows']) >= $minShows; }));
  usort($people, function($a, $b) { return count($b['shows']) - count($a['shows']); });
  return $people;
}

print json_encode([
  'directors' => peopleWithAtLeastShowCount($directors, 3),
  'actors' => peopleWithAtLeastShowCount($actors, 3),
], JSON_PRETTY_PRINT);

?>
