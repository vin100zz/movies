
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ShowService } from '../../services/show.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  querySubject: Subject<string> = new Subject();

  results = [];

  @ViewChild('searchText') private searchElement: ElementRef;

  constructor(private showService: ShowService) { }

  public ngAfterViewInit(): void {
    this.searchElement.nativeElement.focus();
  }

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
              type: 'P',
              name: dto.name,
              picture: dto.profile_path,
              link: '/person/' + dto.id,
              onerror: 'this.src="assets/empty-person.jpg"'
            };
          } else if (dto.media_type === 'movie') {
            return {
              type: 'M',
              name: dto.title,
              releaseYear: (dto.release_date || '').substr(0, 4),
              rating: dto.vote_average ? Number(dto.vote_average).toFixed(1) : null,
              picture: dto.poster_path,
              link: '/show/M/' + dto.id,
              onerror: 'this.src="assets/empty-show.jpg"'
            };
          } else if (dto.media_type === 'tv') {
            return {
              type: 'S',
              name: dto.name,
              releaseYear: (dto.first_air_date || '').substr(0, 4),
              rating: dto.vote_average ? Number(dto.vote_average).toFixed(1) : null,
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
