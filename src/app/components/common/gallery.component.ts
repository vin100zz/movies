import { Component, Input, OnInit } from '@angular/core';

export class GalleryData {
  mode: string; // show or person
  display: string; // scroll or wrap
  shows: any[]; // shows with tqgs
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
    const show = this.data.shows.find(x => x['id'] === showId && x['type'] === showType);
    if (show) {
      if (show['watched'] === 'true') {
        return 'watched';
      }
      if (show['tags'].length) {
        return 'tagged';
      }
    }
    return '';
  }

}
