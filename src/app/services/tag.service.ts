
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tag, TagWithShows } from '../model/tag';


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
    return this.httpClient.get<Object[]>('server/list_tags.php?ts=' + Date.now()).pipe(map(arr => arr.map(dto => new Tag(dto['id'], dto['label'], dto['rank']))));
  }

  listTagsWithShows(): Observable<TagWithShows[]> {
    return this.httpClient.get<TagWithShows[]>('server/list_tags_with_shows.php?ts=' + Date.now()).pipe(map(arr => arr.map(TagWithShows.fromDto)));
  }

  tagShow(showId: string, showType: string, tagId: string): Observable<Object> {
    return this.httpClient.post('server/tag_show.php?ts=' + Date.now() + '&showId=' + showId + '&showType=' + showType + '&tagId=' + tagId, null, httpOptions);
  }

  untagShow(showId: string, showType: string, tagId: string): Observable<Object> {
    return this.httpClient.post('server/untag_show.php?ts=' + Date.now() + '&showId=' + showId + '&showType=' + showType + '&tagId=' + tagId, null, httpOptions);
  }

  create(name: string): Observable<TagWithShows[]> {
    return this.httpClient.get<Object[]>('server/create_tag.php?ts=' + Date.now() + '&name=' + name).pipe(map(arr => arr.map(TagWithShows.fromDto)));
  }

  rename(id: string, name: string): Observable<TagWithShows[]> {
    return this.httpClient.get<Object[]>('server/rename_tag.php?ts=' + Date.now() + '&id=' + id + '&name=' + name).pipe(map(arr => arr.map(TagWithShows.fromDto)));
  }

  reorder(orderedTagIds: string[]): Observable<TagWithShows[]> {
    return this.httpClient.post<Object[]>('server/reorder_tags.php?ts=' + Date.now() + '&name=' + name, orderedTagIds, httpOptions).pipe(map(arr => arr.map(TagWithShows.fromDto)));
  }

} 
