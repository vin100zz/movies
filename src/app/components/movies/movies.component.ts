import { Component, OnInit } from '@angular/core';
import { Movie } from '../../model/movie';
import { Serie } from '../../model/serie';
import { Show } from '../../model/show';
import { TagService } from '../../services/tag.service';



@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {

  movies: Show[] = [];

  watchedFilter: boolean = false;
  toWatchFilter: boolean = true;

  sortCriterion: string = 'rating';
  sortAsc = false;

  tags: Object[];

  constructor(private tagService: TagService) {
  }

  ngOnInit() {
    this.tagService.list().subscribe(tags => {
      this.tags = tags.map(tag => {
        tag['shows'] = tag['shows'].map(show => {
          if (show['show_type'] === Movie.TYPE) {
            return new Movie(show['data'], show['watched'] === 'true', show['tags']);
          }
          return new Serie(show['data'], show['watched'] === 'true', show['tags']);
        });
        return tag;
      })
    });
  }

  filterAndSortMovies(): Show[] {
    return this.movies
      //.filter(movie => movie.watched === this.watchedFilter && movie.toWatch === this.toWatchFilter)
      .sort((movie1, movie2) => {
        /* if (this.sortCriterion === 'year') {
           return (this.sortAsc ? 1 : -1) * (movie1.releaseYear - movie2.releaseYear);
         }*/
        if (this.sortCriterion === 'rating') {
          return (this.sortAsc ? 1 : -1) * (movie1.rating - movie2.rating);
        }
        return (this.sortAsc ? 1 : -1) * (movie1.directions[0].personName.localeCompare(movie2.directions[0].personName));
      });
  }

  toggleWatchedFilter(): void {
    this.watchedFilter = !this.watchedFilter;
  }

  toggleToWatchFilter(): void {
    this.toWatchFilter = !this.toWatchFilter;
  }

  setSortCriterion(sortCriterion: string): void {
    if (this.sortCriterion === sortCriterion) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortCriterion = sortCriterion;
      this.sortAsc = (sortCriterion === 'director');
    }
  }

}
