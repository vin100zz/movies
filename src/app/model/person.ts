class Direction {
  isMovie: boolean;
  movieId: number;
  title: string;
  releaseYear: number;
  rating: number;
  picture: string;

  constructor(dto: Object) {
    this.isMovie = dto['media_type'] === 'movie';
    this.movieId = dto['id'];
    this.title = this.isMovie ? dto['title'] : dto['name'];
    this.releaseYear = dto[this.isMovie ? 'release_date' : 'first_air_date'] ? parseInt(dto[this.isMovie ? 'release_date' : 'first_air_date'].substr(0, 4), 10) : null;
    this.rating = dto['vote_average'];
    this.picture = 'http://image.tmdb.org/t/p/w500/' + dto['poster_path'];
  }
}

class Cast {
  isMovie: boolean;
  movieId: number;
  title: string;
  releaseYear: number;
  rating: number;
  character: string;
  picture: string;

  constructor(dto: Object) {
    this.isMovie = dto['media_type'] === 'movie';
    this.movieId = dto['id'];
    this.title = this.isMovie ? dto['title'] : dto['name'];
    this.releaseYear = dto[this.isMovie ? 'release_date' : 'first_air_date'] ? parseInt(dto[this.isMovie ? 'release_date' : 'first_air_date'].substr(0, 4), 10) : null;
    this.rating = dto['vote_average'];
    this.character = dto['character'];
    this.picture = 'http://image.tmdb.org/t/p/w500/' + dto['poster_path'];
  }
}

export class Person {
  id: string;
  name: string;

  birthYear: number;
  deathYear: number;

  birthPlace: string;

  biography: string;

  profilePath: string;

  directions: Direction[];
  casts: Cast[];

  constructor(dto: Object) {
    this.id = dto['id'] + '';
    this.name = dto['name'];

    this.birthYear = parseInt(dto['birthday'].substr(0, 4), 10);
    this.deathYear = dto['deathday'] ? parseInt(dto['deathday'].substr(0, 4), 10) : null;
    this.birthPlace = dto['place_of_birth'];

    this.biography = dto['biography'];
    this.profilePath = 'http://image.tmdb.org/t/p/w500/' + dto['profile_path'];

    this.directions = dto['combined_credits']['crew']
      .filter(this.mustKeepShow)
      .filter(crewDto => crewDto.job === 'Director')
      .map(crewDto => new Direction(crewDto))
      .sort((direction1, direction2) => direction2.releaseYear - direction1.releaseYear);

    this.casts = dto['combined_credits']['cast']
      .filter(this.mustKeepShow)
      .map(castDto => new Cast(castDto))
      .sort((cast1, cast2) => cast2.releaseYear - cast1.releaseYear);;
  }

  mustKeepShow(dto): boolean {
    return dto.genre_ids && dto.genre_ids.length && !dto.genre_ids.some(genre => [10767 /* Talk */, 99 /* Documentary */].includes(genre));
  }

}