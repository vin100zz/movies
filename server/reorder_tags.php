<?php

include_once "business.php";

$param = file_get_contents('php://input');

$orderedTagIds = json_decode($param);

$sql = "";

for ($i=0; $i<count($orderedTagIds); ++$i) {
  $id = $orderedTagIds[$i];
  $rank = $i + 1;
	$sql = $sql . "UPDATE tag SET rank=$rank WHERE id='$id'; ";
}

// print "sql=" . $sql . "<<<";

$tags = DBAccess::exec($sql);

listTagsWithShows();

?>
