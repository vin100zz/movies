import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Movie } from '../model/movie';

import { ShowService } from './show.service';




@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private httpClient: HttpClient, private showService: ShowService) {
  }

  save(movie: Movie): Observable<Movie> {
    return this.showService.save<Movie>(movie, this.mapDto);
  }

  update(id: string, watched: boolean, toWatch: boolean): Observable<Movie> {
    return this.showService.update<Movie>(id, Movie.TYPE, watched, toWatch, this.mapDto);
  }

  delete(id: string): void {
    this.showService.delete(id, Movie.TYPE);
  }

  mapDto(dto: Object): Movie {
    return new Movie(dto['data'], true, dto['tags']);
  }

  mapData(data: Object): Movie {
    return new Movie(data, false, []);
  }

}
