class Direction {
  isMovie: boolean;
  movieId: number;
  title: string;
  releaseYear: number;
  rating: number;

  constructor(dto: Object) {
    this.isMovie = dto['media_type'] === 'movie';
    this.movieId = dto['id'];
    this.title = this.isMovie ? dto['title'] : dto['name'];
    this.releaseYear = dto[this.isMovie ? 'release_date' : 'first_air_date'] ? parseInt(dto[this.isMovie ? 'release_date' : 'first_air_date'].substr(0, 4), 10) : null;
    this.rating = dto['vote_average'];
  }
}

class Cast {
  isMovie: boolean;
  movieId: number;
  title: string;
  releaseYear: number;
  rating: number;
  character: string;

  constructor(dto: Object) {
    this.isMovie = dto['media_type'] === 'movie';
    this.movieId = dto['id'];
    this.title = this.isMovie ? dto['title'] : dto['name'];
    this.releaseYear = dto[this.isMovie ? 'release_date' : 'first_air_date'] ? parseInt(dto[this.isMovie ? 'release_date' : 'first_air_date'].substr(0, 4), 10) : null;
    this.rating = dto['vote_average'];
    this.character = dto['character'];
  }
}

export class Person {
  id: string;
  name: string;

  birthYear: number;
  deathYear: number;

  popularity: number;

  profilePath: string;

  directions: Direction[];
  casts: Cast[];

  constructor(dto: Object) {
    this.id = dto['id'] + '';
    this.name = dto['name'];
    this.birthYear = parseInt(dto['birthday'].substr(0, 4), 10);
    this.deathYear = dto['deathday'] ? parseInt(dto['deathday'].substr(0, 4), 10) : null;
    this.popularity = dto['popularity'];
    this.profilePath = dto['profile_path'];

    this.directions = dto['combined_credits']['crew']
      .filter(crewDto => crewDto.job === 'Director')
      .map(crewDto => new Direction(crewDto))
      .sort((direction1, direction2) => direction1.releaseYear - direction2.releaseYear);

    this.casts = dto['combined_credits']['cast']
      .map(castDto => new Cast(castDto))
      .sort((cast1, cast2) => cast1.releaseYear - cast2.releaseYear);;
  }
}