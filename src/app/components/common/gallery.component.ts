import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LightShow, ShowWithTags } from 'src/app/model/show';

export class GalleryData {
  mode: string; // show or person
  display: string; // scroll or wrap
  shows: ShowWithTags[]; // shows with tags
  hideWatchedShows: boolean = false;
  displayWatchedIconOnly: boolean = false;
  items: Object[];
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnChanges {

  @Input() data: GalleryData;

  posterMarkMap: Map<string, string> = new Map();

  constructor() {
  }

  ngOnInit() {
    this.buildPosterMarkMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.buildPosterMarkMap();
    }
  }

  trackByItem(index: number, item: any): any {
    return (item.showId !== undefined ? item.showId + '_' + item.showType : null) ?? item.id ?? index;
  }

  private buildPosterMarkMap(): void {
    this.posterMarkMap = new Map();
    if (!this.data?.items) { return; }
    for (const item of this.data.items as any[]) {
      if (item.showId !== undefined) {
        const key = item.showId + '_' + item.showType;
        this.posterMarkMap.set(key, this.getPosterMark(item.showId, item.showType));
      }
    }
  }

  getPosterMark(showId: string, showType: string): string {
    const matchingShow = this.data.shows.find(show => show.id + '' === showId + '' && show.type === showType);
    if (matchingShow) {
      if (matchingShow.watched) {
        return 'watched';
      }
      if (!this.data.displayWatchedIconOnly && matchingShow.tags.length) {
        return 'tagged';
      }
    }
    return '';
  }

}
