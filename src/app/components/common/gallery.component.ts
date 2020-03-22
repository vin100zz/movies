import { Component, Input, OnInit } from '@angular/core';
import { ShowService } from 'src/app/services/show.service';

export class GalleryData {
  mode: string; // show or person
  display: string; // scroll or wrap
  items: Object[];
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  @Input() data: GalleryData;

  shows: Object[] = [];

  constructor(private showService: ShowService) {
  }

  ngOnInit() {
    this.showService.listShowsWithTags().subscribe(shows => this.shows = shows);
  }

  getPosterMark(showId: string, showType: string): string {
    const show = this.shows.find(x => x['id'] === showId && x['type'] === showType);
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
