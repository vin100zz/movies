
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


import { HttpHeaders } from '@angular/common/http';

import { Show } from './../model/show';
import { Movie } from '../model/movie';
import { Serie } from '../model/serie';


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

  /*
  list(): Observable<Show[]> {
    return this.httpClient.get<Object[]>('server/list.php?ts=' + Date.now())
      .map(dtoList => {
        return dtoList.map(dto => {
          if (dto['type'] === Movie.TYPE) {
            return new Movie(dto['data'], true, dto['watched'], dto['towatch']);
          }
          return new Serie(dto['data'], true, dto['watched'], dto['towatch']);
        });
      });
  }
  */

  list() {
    return this.httpClient.get<Object[]>('server/list.php?ts=' + Date.now());
  }

  save<T>(show: Show, mapDtoFn: (dto: Object) => T): Observable<T> {
    return this.httpClient.post<T>('server/save.php?ts=' + Date.now() + '&type=' + show.type + '&id=' + show.id, show.data, httpOptions).pipe(map(mapDtoFn));
  }

  update<T>(id: string, type: string, watched: boolean, toWatch: boolean, mapDtoFn: (dto: Object) => T): Observable<T> {
    return this.httpClient.get<T>('server/update.php?ts=' + Date.now() + '&type=' + type + '&id=' + id + '&watched=' + watched + '&toWatch=' + toWatch).pipe(map(mapDtoFn));
  }

  get<T>(id: String, type: string, tmdbKey: string, mapDtoFn: (dto: Object) => T, mapDataFn: (dto: Object) => T): Observable<T> {
    return new Observable<T>(observer => {
      this.httpClient.get<T>('server/get.php?ts=' + Date.now() + '&type=' + type + '&id=' + id).subscribe(dto => {
        if (dto) {
          observer.next(mapDtoFn(dto));
          observer.complete();
          return;
        }
        this.httpClient.get('https://api.themoviedb.org/3/' + tmdbKey + '/' + id + '?api_key=7aac1d19d45ad4753555583cabc0832d&append_to_response=credits,images,videos').pipe(
          map(data => {
            observer.next(mapDataFn(data));
            observer.complete();
          })).subscribe();
      });
    });
  }

  delete(id: string, type: string): void {
    this.httpClient.get('server/delete.php?ts=' + Date.now() + '&type=' + type + '&id=' + id);
  }

}
