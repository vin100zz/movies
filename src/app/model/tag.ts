import { LightShow } from './show';

export class Tag {
  constructor(
    public id: string,
    public label: string) {
  }

  static fromDto(dto: any): Tag {
    return new Tag(dto.id, dto.label);
  }
}

export class TagWithShows extends Tag {
  constructor(
    tag: Tag,
    public shows: LightShow[]) {
    super(tag.id, tag.label);
  }

  static fromDto(dto: any): TagWithShows {
    return new TagWithShows(
      Tag.fromDto(dto),
      dto.shows.map(showDto => LightShow.fromDto(showDto)));
  }
}