import { Show } from '../model/show';

export class Serie extends Show {
  static TYPE: string = 'S';
  static TMDB_KEY = 'tv';

  constructor(data: Object, watched: boolean, tags: string[]) {
    super(data, Serie.TYPE, watched, tags);

    this.firstYear = parseInt(data['first_air_date'].substr(0, 4), 10);
    this.lastYear = parseInt(data['last_air_date'].substr(0, 4), 10);

    this.nbSeasons = data['number_of_seasons'];
    this.nbEpisodes = data['number_of_episodes'];
  }

}