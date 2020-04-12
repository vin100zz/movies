import { LightShow } from './show';

export class Tag {
  constructor(
    public id: string,
    public label: string,
    public rank: number) {
  }

  static fromDto(dto: any): Tag {
    return new Tag(dto.id, dto.label, parseInt(dto.rank));
  }
}

export class TagWithShows extends Tag {
  constructor(
    id: string,
    label: string,
    rank: number,
    public shows: LightShow[]) {
    super(id, label, rank);
  }

  static fromDto(dto: any): TagWithShows {
    return new TagWithShows(dto.id, dto.label, parseInt(dto.rank), dto.shows.map(showDto => LightShow.fromDto(showDto)));
  }
}

