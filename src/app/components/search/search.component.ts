
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
        this.results = searchResultsDto['results'].slice(0, 10).map(resultDto => {
          return {
            type: resultDto.media_type,
            link: '/' + (resultDto.media_type === 'tv' ? 'serie' : resultDto.media_type) + '/' + resultDto.id,
            label: resultDto.media_type === 'movie' ? resultDto.title : resultDto.name,
            picture: resultDto.media_type === 'person' ? resultDto.profile_path : resultDto.poster_path
          };
        });
      });
    });
  }

  onChange(query): void {
    this.querySubject.next(query);
  }

}
