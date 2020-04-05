import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/model/movie';
import { TagWithShows } from 'src/app/model/tag';
import { TagService } from '../../services/tag.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  tags: any[];

  constructor(
    private tagService: TagService
  ) { }

  ngOnInit() {
    this.tagService.listTagsWithShows().subscribe(tags => this.toGallery(tags));
  }

  toGallery(tags: TagWithShows[]): void {
    this.tags = tags.map(tag => ({
      label: tag.label,
      galleryData: {
        mode: 'show',
        display: 'scroll',
        shows: [],
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

}
