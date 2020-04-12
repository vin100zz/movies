import { Component, Input, OnInit } from '@angular/core';
import { ShowWithTags } from 'src/app/model/show';

export class GalleryData {
  mode: string; // show or person
  display: string; // scroll or wrap
  shows: ShowWithTags[]; // shows with tqgs
  displayWatchedOnly: boolean;
  items: Object[];
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  @Input() data: GalleryData;

  constructor() {
  }

  ngOnInit() {
  }

  getPosterMark(showId: string, showType: string): string {
    const matchingShow = this.data.shows.find(show => show.id + '' === showId + '' && show.type === showType);
    if (matchingShow) {
      if (matchingShow.watched) {
        return 'watched';
      }
      if (!this.data.displayWatchedOnly && matchingShow.tags.length) {
        return 'tagged';
      }
    }
    return '';
  }

}
