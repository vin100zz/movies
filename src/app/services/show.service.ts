
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../model/movie';
import { Serie } from '../model/serie';
import { Show, ShowWithTags } from './../model/show';


const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ShowService {

  constructor(private httpClient: HttpClient) {
  }

  search(query: string): Observable<Object> {
    return this.httpClient.get('https://api.themoviedb.org/3/search/multi?api_key=7aac1d19d45ad4753555583cabc0832d&query=' + query);
  }

  listShowsWithTags(): Observable<ShowWithTags[]> {
    return this.httpClient.get<Object[]>('server/list_shows_with_tags.php?ts=' + Date.now()).pipe(map(arr => arr.map(ShowWithTags.fromDto)));
  }

  save(show: Show): Observable<Show> {
    if (show.type === Movie.TYPE) {
      return this.saveAs<Movie>(show, this.mapMovieDto);
    }
    return this.saveAs<Serie>(show, this.mapSerieDto);
  }

  saveAs<T>(show: Show, mapDtoFn: (dto: Object) => T): Observable<T> {
    return this.httpClient.post<T>('server/save.php?ts=' + Date.now() + '&type=' + show.type + '&id=' + show.id + '&title=' + show.title, show.data, httpOptions).pipe(map(mapDtoFn));
  }

  resync(show: Show): Observable<Show> {
    if (show.type === Movie.TYPE) {
      return this.resyncAs<Movie>(show, this.mapMovieDto);
    }
    return this.resyncAs<Serie>(show, this.mapSerieDto);
  }

  resyncAs<T>(show: Show, mapDtoFn: (dto: Object) => T): Observable<T> {
    return this.httpClient.post<T>('server/resync.php?ts=' + Date.now() + '&type=' + show.type + '&id=' + show.id + '&title=' + show.title, show.data, httpOptions);
  }

  update<T>(id: string, type: string, watched: boolean, toWatch: boolean, mapDtoFn: (dto: Object) => T): Observable<T> {
    return this.httpClient.get<T>('server/update.php?ts=' + Date.now() + '&type=' + type + '&id=' + id + '&watched=' + watched + '&toWatch=' + toWatch).pipe(map(mapDtoFn));
  }

  get(id: String, type: string): Observable<Show> {
    if (type === Movie.TYPE) {
      return this.getAs<Movie>(id, type, Movie.TMDB_KEY, this.mapMovieDto, this.mapMovieData);
    }
    return this.getAs<Serie>(id, type, Serie.TMDB_KEY, this.mapSerieDto, this.mapSerieData);
  }

  getAs<T>(id: String, type: string, tmdbKey: string, mapDtoFn: (dto: Object) => T, mapDataFn: (dto: Object) => T): Observable<T> {
    return new Observable<T>(observer => {
      this.httpClient.get<T>('server/get.php?ts=' + Date.now() + '&type=' + type + '&id=' + id).subscribe(dto => {
        if (dto) {
          observer.next(mapDtoFn(dto));
          observer.complete();
          return;
        }
        this.getFromTmdbAs(id, type, tmdbKey, mapDtoFn, mapDataFn).subscribe(movie => {observer.next(movie); observer.complete();});        
      });
    });
  }

  getFromTmdb(id: String, type: string): Observable<Show> {
    if (type === Movie.TYPE) {
      return this.getFromTmdbAs<Movie>(id, type, Movie.TMDB_KEY, this.mapMovieDto, this.mapMovieData);
    }
    return this.getFromTmdbAs<Serie>(id, type, Serie.TMDB_KEY, this.mapSerieDto, this.mapSerieData);
  }

  getFromTmdbAs<T>(id: String, type: string, tmdbKey: string, mapDtoFn: (dto: Object) => T, mapDataFn: (dto: Object) => T): Observable<T> {
    return this.httpClient.get('https://api.themoviedb.org/3/' + tmdbKey + '/' + id + '?api_key=7aac1d19d45ad4753555583cabc0832d&append_to_response=credits,images,videos,recommendations,keywords,similar').pipe(map(mapDataFn));
  }

  delete(id: string, type: string): void {
    this.httpClient.get('server/delete.php?ts=' + Date.now() + '&type=' + type + '&id=' + id);
  }

  toggleWatched(show: Show): Observable<Show> {
    if (show.type === Movie.TYPE) {
      return this.toggleWatchedAs<Movie>(show, this.mapMovieDto);
    }
    return this.toggleWatchedAs<Serie>(show, this.mapSerieDto);
  }

  toggleWatchedAs<T>(show: Show, mapDtoFn: (dto: Object) => T): Observable<T> {
    return this.httpClient.get<T>('server/set_watched.php?ts=' + Date.now() + '&type=' + show.type + '&id=' + show.id + '&watched=' + !show.watched).pipe(map(mapDtoFn));
  }

  setTeleramaRating(show: Show, rating: number): Observable<Show> {
    if (show.type === Movie.TYPE) {
      return this.setTeleramaRatingAs<Movie>(show, rating, this.mapMovieDto);
    }
    return this.setTeleramaRatingAs<Serie>(show, rating, this.mapSerieDto);
  }

  setTeleramaRatingAs<T>(show: Show, rating: number, mapDtoFn: (dto: Object) => T): Observable<T> {
    const ratingParam = rating !== null ? rating : '';
    return this.httpClient.get<T>('server/set_telerama_rating.php?ts=' + Date.now() + '&type=' + show.type + '&id=' + show.id + '&rating=' + ratingParam).pipe(map(mapDtoFn));
  }

  mapMovieDto(dto: Object): Movie {
    const teleramaRating = dto['telerama_rating'] ? parseInt(dto['telerama_rating'], 10) : null;
    return new Movie(dto['data'], dto['watched'] === 'true', dto['tags'], teleramaRating);
  }

  mapMovieData(data: Object): Movie {
    return new Movie(data, false, []);
  }

  mapSerieDto(dto: Object): Serie {
    const teleramaRating = dto['telerama_rating'] ? parseInt(dto['telerama_rating'], 10) : null;
    return new Serie(dto['data'], dto['watched'] === 'true', dto['tags'], teleramaRating);
  }

  mapSerieData(data: Object): Serie {
    return new Serie(data, false, []);
  }

}
