import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/model/movie';
import { ShowWithTags } from 'src/app/model/show';
import { TagWithShows } from 'src/app/model/tag';
import { ShowService } from 'src/app/services/show.service';
import { TagService } from '../../services/tag.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  tagItems: any[];

  shows: ShowWithTags[];

  constructor(
    private tagService: TagService,
    private showService: ShowService
  ) { }

  ngOnInit() {
    this.showService.listShowsWithTags().subscribe(shows => {
      this.shows = shows;
      this.tagService.listTagsWithShows().subscribe(tags => this.toGallery(tags));
    });
  }

  toGallery(tags: TagWithShows[]): void {
    this.tagItems = tags
      .sort((tag1, tag2) => tag1.rank - tag2.rank)
      .map(tag => ({
        tag: tag,
        galleryData: {
          mode: 'show',
          display: 'scroll',
          shows: this.shows,
          displayWatchedOnly: true,
          items: tag['shows'].map(show => ({
            showId: show.id,
            showType: show.type,
            link: `/show/${show.type === Movie.TYPE ? 'M' : 'S'}/${show.id}`,
            picture: show.picture,
            name: show.title,
            rating: show.rating,
            releaseYear: show.releaseYear
          }))
        }
      }));
  }

  createTag(): void {
    var tagName = prompt("Name", "");
    this.tagService.create(tagName).subscribe(tags => this.toGallery(tags));
  }

  promoteTag(tagId: string): void {
    this.tagService.promote(tagId).subscribe(tags => this.toGallery(tags));
  }

}
