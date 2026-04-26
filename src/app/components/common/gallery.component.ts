import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
  styleUrls: ['./gallery.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush  // 3. Évite les cycles de détection inutiles
})
export class GalleryComponent implements OnChanges {

  @Input() data: GalleryData;

  posterMarkMap: Map<string, string> = new Map();

  constructor() {
  }

  // 1. ngOnInit supprimé : ngOnChanges s'exécute avant ngOnInit,
  //    l'appel dans ngOnInit était donc redondant.

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
    if (!this.data?.items || !this.data?.shows) { return; }

    // 2. Préconstruction d'un index des shows en O(n) pour éviter
    //    un Array.find() O(n) répété pour chaque item (était O(items × shows)).
    const showsIndex = new Map<string, ShowWithTags>();
    for (const show of this.data.shows) {
      showsIndex.set(show.id + '_' + show.type, show);
    }

    for (const item of this.data.items as any[]) {
      if (item.showId !== undefined) {
        const key = item.showId + '_' + item.showType;
        this.posterMarkMap.set(key, this.getPosterMarkFromIndex(showsIndex, key));
      }
    }
  }

  private getPosterMarkFromIndex(showsIndex: Map<string, ShowWithTags>, key: string): string {
    const matchingShow = showsIndex.get(key);
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
