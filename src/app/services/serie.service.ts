import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Serie } from '../model/serie';

import { ShowService } from './show.service';




@Injectable({
  providedIn: 'root'
})
export class SerieService {

  constructor(private httpClient: HttpClient, private showService: ShowService) {
  }

  update(id: string, watched: boolean, toWatch: boolean): Observable<Serie> {
    return this.showService.update<Serie>(id, Serie.TYPE, watched, toWatch, this.mapDto);
  }

  delete(id: string): void {
    this.showService.delete(id, Serie.TYPE);
  }

  mapDto(dto: Object): Serie {
    return new Serie(dto['data'], true, dto['tags']);
  }

  mapData(data: Object): Serie {
    return new Serie(data, false, []);
  }

}
