import { Show } from '../model/show';

export class Serie extends Show {
  static TYPE: string = 'S';
  static TMDB_KEY = 'tv';

  firstYear: number;
  lastYear: number;

  constructor(data: Object, inDb: boolean, tags: string[]) {
    super(data, Serie.TYPE, inDb, tags);

    this.firstYear = parseInt(data['first_air_date'].substr(0, 4), 10);
    this.lastYear = parseInt(data['last_air_date'].substr(0, 4), 10);
  }

}