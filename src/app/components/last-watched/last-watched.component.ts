import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/model/movie';
import { LightShow } from 'src/app/model/show';
import { FilterService } from '../../services/filter.service';
import { ShowService } from '../../services/show.service';

@Component({
  selector: 'app-last-watched',
  templateUrl: './last-watched.component.html',
  styleUrls: ['./last-watched.component.css']
})
export class LastWatchedComponent implements OnInit {

  galleryData: Object;

  showTypeFilter: 'M' | 'S' = 'M';

  constructor(
    private showService: ShowService,
    private filterService: FilterService
  ) { }

  ngOnInit() {
    this.filterService.showTypeFilter$.subscribe(filter => {
      this.showTypeFilter = filter;
      this.refresh();
    });
  }

  refresh(): void {
    this.showService.listLastWatched().subscribe(lastWatched => this.toGallery(lastWatched));
  }

  toGallery(lastWatched: LightShow[]): void {
    // Order is already computed server-side (list_watched_shows.php):
    // watched_at desc when known, falling back to DB insertion order (rowid desc).
    const items = lastWatched
      .filter(show => show.type === this.showTypeFilter)
      .map(show => ({
        showId: show.id,
        showType: show.type,
        link: `/show/${show.type === Movie.TYPE ? 'M' : 'S'}/${show.id}`,
        picture: show.picture,
        name: show.title,
        rating: show.rating ? Number(show.rating).toFixed(1) : null,
        teleramaRating: show.teleramaRating,
        releaseYear: show.releaseYear,
        duration: show.duration,
        watched: show.watched
      }));

    this.galleryData = {
      mode: 'show',
      display: 'wrap',
      // No `shows` index passed in: the gallery only uses it to compute the
      // watched/tagged poster-mark badge, which is redundant here since every
      // item on this view is, by definition, already watched.
      items: items
    };
  }

}
