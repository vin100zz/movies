
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

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

  tagShow(showId: string, showType: string, tagId: string): Observable<Object> {
    return this.httpClient.post('server/tag_show.php?ts=' + Date.now() + '&showId=' + showId + '&showType=' + showType + '&tagId=' + tagId, null, httpOptions);
  }

  untagShow(showId: string, showType: string, tagId: string): Observable<Object> {
    return this.httpClient.post('server/untag_show.php?ts=' + Date.now() + '&showId=' + showId + '&showType=' + showType + '&tagId=' + tagId, null, httpOptions);
  }

} 
