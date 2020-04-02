import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/model/movie';
import { Tag } from 'src/app/model/tag';
import { ShowService } from 'src/app/services/show.service';
import { TagService } from '../../services/tag.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  tags: any[];

  constructor(
    private tagService: TagService,
    private showService: ShowService
  ) { }

  ngOnInit() {
    this.tagService.listTagsWithShows().subscribe(tags => this.toGallery(tags));
  }

  toGallery(tags: Tag[]): void {
    this.showService.listShowsWithTags().subscribe(shows => {
      this.tags = tags.map(tag => ({
        label: tag.label,
        shows: shows,
        galleryData: {
          mode: 'show',
          display: 'scroll',
          shows: shows,
          displayWatchedOnly: true,
          items: tag['shows'].map(show => ({
            showId: show.id,
            showType: show.type,
            link: `/show/${show.type === Movie.TYPE ? 'M' : 'S'}/${show.id}`,
            picture: show.posterPath,
            name: show.title,
            rating: show.rating,
            releaseYear: show.releaseYear
          }))
        }
      }));
    });
  }

  createTag(): void {
    var tagName = prompt("Name", "");
    this.tagService.create(tagName).subscribe(tags => this.toGallery(tags));
  }

}
