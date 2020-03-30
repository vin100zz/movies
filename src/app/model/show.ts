class Direction {
  personId: string;
  personName: string;
  picture: string;

  constructor(data: Object) {
    this.personId = data['id'] + '';
    this.personName = data['name'];
    this.picture = 'http://image.tmdb.org/t/p/w500/' + data['profile_path'];
  }
}

class Cast {
  personId: string;
  personName: string;
  character: string;
  picture: string;

  constructor(data: Object) {
    this.personId = data['id'] + '';
    this.personName = data['name'];
    this.character = data['character'];
    this.picture = 'http://image.tmdb.org/t/p/w500/' + data['profile_path'];
  }
}

class RelatedShow {
  showId: string;
  title: string;
  releaseYear: number;
  rating: number;
  picture: string;

  constructor(data: Object) {
    this.showId = data['id'] + '';
    this.title = data['title'] || data['name'];
    this.releaseYear = parseInt((data['release_date'] || data['first_air_date'] || '').substr(0, 4), 10);
    this.rating = data['vote_average'];
    this.picture = 'http://image.tmdb.org/t/p/w500/' + data['poster_path'];
  }
}

export class Show {
  data: Object;
  type: string;

  id: string;
  title: string;
  overview: string;
  rating: number;

  backgroundPath: string;
  posterPath: string;

  backgrounds: string[];
  youtubeId: string;

  directions: Direction[];
  casts: Cast[];

  tags: string[];

  watched: boolean;

  genres: string[];

  similars: RelatedShow[] = [];
  recommendations: RelatedShow[] = [];

  // movie
  originalTitle: string;
  releaseYear: number;
  tagline: string;
  duration: number;

  // serie
  firstYear: number;
  lastYear: number;
  nbSeasons: number;
  nbEpisodes: number;

  constructor(data: Object, type: string, watched: boolean, tags: string[]) {
    this.data = data;
    this.type = type;

    this.watched = watched;

    this.id = data['id'];
    this.title = data['original_title'] || data['original_name'];
    this.overview = data['overview'];
    this.rating = data['vote_average'];

    this.backgroundPath = data['backdrop_path'];
    this.posterPath = 'http://image.tmdb.org/t/p/w500/' + data['poster_path'];

    this.backgrounds = ((data['images'] || {}).backdrops || []).map(x => 'http://image.tmdb.org/t/p/w500/' + x.file_path);

    let videos = ((data['videos'] || {}).results || []);
    if (videos.length) {
      this.youtubeId = 'https://www.youtube.com/watch?v=' + videos.sort((va, vb) => va.type === 'Trailer' ? -1 : 1)[0].key;
    }

    this.directions = data['credits']['crew']
      .filter(crewdata => crewdata.job === 'Director')
      .map(directordata => new Direction(directordata));

    this.casts = data['credits']['cast']
      .slice(0, 15)
      .map(castdata => new Cast(castdata));

    this.tags = tags;

    this.genres = data['genres'].map(x => x.name);

    if (data['similar'] && data['similar'].results) {
      this.similars = data['similar'].results.map(x => new RelatedShow(x));
    }
    if (data['recommendations'] && data['recommendations'].results) {
      this.recommendations = data['recommendations'].results.map(x => new RelatedShow(x));
    }
  }

}