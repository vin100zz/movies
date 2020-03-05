class Direction {
  personId: number;
  personName: string;

  constructor(data: Object) {
    this.personId = data['id'];
    this.personName = data['name'];
  }
}

class Cast {
  personId: number;
  personName: string;
  character: string;

  constructor(data: Object) {
    this.personId = data['id'];
    this.personName = data['name'];
    this.character = data['character'];
  }
}

export class Show {
  data: Object;
  type: string;

  inDb: boolean;

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
  toWatch: boolean;

  constructor(data: Object, type: string, inDb: boolean, tags: string[]) {
    this.data = data;
    this.type = type;

    this.inDb = inDb;

    this.id = data['id'];
    this.title = data['original_title'] || data['original_name'];
    this.overview = data['overview'];
    this.rating = data['vote_average'];

    this.backgroundPath = data['backdrop_path'];
    this.posterPath = 'http://image.tmdb.org/t/p/w500/' + data['poster_path'];

    this.backgrounds = ((data['images'] || {}).backdrops || []).map(x => 'http://image.tmdb.org/t/p/w500/' + x.file_path);

    let videos = ((data['videos'] || {}).results || []);
    this.youtubeId = videos.length ? videos[0].key : null;

    this.directions = data['credits']['crew']
      .filter(crewdata => crewdata.job === 'Director')
      .map(directordata => new Direction(directordata));

    this.casts = data['credits']['cast']
      .slice(0, 8)
      .map(castdata => new Cast(castdata));


    this.tags = tags;
  }

}