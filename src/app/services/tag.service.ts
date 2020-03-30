
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../model/movie';
import { Serie } from '../model/serie';
import { Tag } from '../model/tag';


const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private httpClient: HttpClient) {
  }

  list(): Observable<Tag[]> {
    return this.httpClient.get<Object[]>('server/list_tags.php?ts=' + Date.now()).pipe(map(arr => arr.map(dto => new Tag(dto['id'], dto['label']))));
  }

  listTagsWithShows(): Observable<Tag[]> {
    return this.httpClient.get<Object[]>('server/list_tags_with_shows.php?ts=' + Date.now()).pipe(map(this._mapTagsWithShows));
  }

  tagShow(showId: string, showType: string, tagId: string): Observable<Object> {
    return this.httpClient.post('server/tag_show.php?ts=' + Date.now() + '&showId=' + showId + '&showType=' + showType + '&tagId=' + tagId, null, httpOptions);
  }

  untagShow(showId: string, showType: string, tagId: string): Observable<Object> {
    return this.httpClient.post('server/untag_show.php?ts=' + Date.now() + '&showId=' + showId + '&showType=' + showType + '&tagId=' + tagId, null, httpOptions);
  }

  create(name: string): Observable<Tag[]> {
    return this.httpClient.get<Object[]>('server/create_tag.php?ts=' + Date.now() + '&name=' + name).pipe(map(this._mapTagsWithShows));
  }

  _mapTagsWithShows(arr: any[]): any[] {
    return arr.map(dto => {
      const tag = new Tag(dto['id'], dto['label']);
      tag['shows'] = dto['shows'].map(show => {
        if (show['show_type'] === Movie.TYPE) {
          return new Movie(show['data'], show['watched'] === 'true', show['tags']);
        }
        return new Serie(show['data'], show['watched'] === 'true', show['tags']);
      });
      return tag;
    })
  }

} 
