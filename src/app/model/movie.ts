import { Show } from '../model/show';

export class Movie extends Show {
  static TYPE: string = 'M';
  static TMDB_KEY = 'movie';

  constructor(data: Object, watched: boolean, tags: string[]) {
    super(data, Movie.TYPE, watched, tags);

    this.releaseYear = parseInt((data['release_date'] || '').substr(0, 4), 10);
    this.tagline = data['tagline'];
    this.overview = data['overview'];
    this.duration = data['runtime'];
  }

}