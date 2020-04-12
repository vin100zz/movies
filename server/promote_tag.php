<?php

include_once "business.php";

$tagId = $_GET["tagId"];

$tags = DBAccess::query("SELECT id, rank FROM tag ORDER BY rank");

$tagRank = null;

for ($i=0; $i<count($tags); ++$i) {
  if (intval($tags[$i]["rank"]) !== $i) {
    $tags[$i]["rank"] = $i;
    $tags[$i]["changed"] = true;
  } else {
    $tags[$i]["changed"] = false;
  }

  if ($tags[$i]["id"] == $tagId) {
    $tagRank = $i;
  }
}

if ($tagRank > 0) {
  $tags[$tagRank]["rank"]  = $tagRank - 1;
  $tags[$tagRank]["changed"] = true;

  $tags[$tagRank-1]["rank"]  = $tagRank;
  $tags[$tagRank-1]["changed"] = true;
}

for ($i=0; $i<count($tags); ++$i) {
  $tag = $tags[$i];
  if ($tag["changed"]) {
    DBAccess::exec("UPDATE tag SET rank='" . $tag["rank"] . "' WHERE id=" . $tag["id"]);
  }
}

listTagsWithShows();

?>
