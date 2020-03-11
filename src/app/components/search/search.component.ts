
import { debounceTime } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';

import { ShowService } from '../../services/show.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  querySubject: Subject<string> = new Subject();

  results = [];

  constructor(private showService: ShowService) { }

  ngOnInit() {
    this.querySubject.pipe(debounceTime(500)).subscribe(query => {
      if (!query) {
        this.results = [];
        return;
      }
      this.showService.search(query).subscribe(searchResultsDto => {
        this.results = searchResultsDto['results'].slice(0, 12).map(dto => {
          if (dto.media_type === 'person') {
            return {
              type: dto.media_type,
              name: dto.name,
              picture: dto.profile_path,
              link: '/person/' + dto.id,
              onerror: 'this.src="assets/empty-person.jpg"'
            };
          } else if (dto.media_type === 'movie') {
            return {
              type: dto.media_type,
              name: dto.title,
              releaseYear: (dto.release_date || '').substr(0, 4),
              rating: dto.vote_average,
              picture: dto.poster_path,
              link: '/show/M/' + dto.id,
              onerror: 'this.src="assets/empty-show.jpg"'
            };
          } else if (dto.media_type === 'tv') {
            return {
              type: dto.media_type,
              name: dto.name,
              releaseYear: (dto.first_air_date || '').substr(0, 4),
              rating: dto.vote_average,
              picture: dto.poster_path,
              link: '/show/S/' + dto.id,
              onerror: 'this.src="assets/empty-show.jpg"'
            };
          }
        });
      });
    });
  }

  onChange(query): void {
    this.querySubject.next(query);
  }

}
