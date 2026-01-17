import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { Movie } from 'src/app/model/movie';
import { ShowWithTags } from 'src/app/model/show';
import { TagWithShows } from 'src/app/model/tag';
import { ShowService } from 'src/app/services/show.service';
import { TagService } from '../../services/tag.service';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  tagItems: any[];

  shows: ShowWithTags[];

  showTypeFilter: 'M' | 'S' = 'M';

  constructor(
    private tagService: TagService,
    private showService: ShowService,
    private filterService: FilterService
  ) { }

  ngOnInit() {
    this.filterService.showTypeFilter$.subscribe(filter => {
      this.showTypeFilter = filter;
      this.refresh();
    });
  }

  refresh(): void {
    this.showService.listShowsWithTags().subscribe(shows => {
      this.shows = shows;
      this.tagService.listTagsWithShows().subscribe(tags => this.toGallery(tags));
    });
  }

  toGallery(tags: TagWithShows[]): void {
    this.tagItems = tags
      .sort((tag1, tag2) => tag1.rank - tag2.rank)
      .map(tag => {
        const filteredItems = tag['shows']
          .filter(show => show.type === this.showTypeFilter)
          .sort((item1, item2) => {
            if (item1['watched'] != item2['watched']) {
              return item1['watched'] ? 1 : -1;
            }
            return 0;
          })
          .map(show => ({
            showId: show.id,
            showType: show.type,
            link: `/show/${show.type === Movie.TYPE ? 'M' : 'S'}/${show.id}`,
            picture: show.picture,
            name: show.title,
            rating: show.rating ? Number(show.rating).toFixed(1) : null,
            teleramaRating: show.teleramaRating,
            releaseYear: show.releaseYear,
            duration: show.duration,
            watched: show.watched
          }));

        return {
          tag: tag,
          galleryData: {
            mode: 'show',
            display: 'scroll',
            shows: this.shows,
            hideWatchedShows: this.hideWatchedShows,
            displayWatchedIconOnly: true,
            items: filteredItems
          }
        };
      })
      .filter(item => item.galleryData.items.length > 0);

      this.sortShowsByRating();
  }

  createTag(): void {
    var tagName = prompt("Name", "");
    this.tagService.create(tagName).subscribe(tags => this.toGallery(tags));
  }

  renameTag(tagId: string, tagLabel: string): void {
    var tagName = prompt("Name", tagLabel);
    this.tagService.rename(tagId, tagName).subscribe(tags => this.toGallery(tags));
  }

  sortShowsByRating(): void {
    this.sortShowsBy('rating', 'desc');
  }

  sortShowsByTeleramaRating(): void {
    this.sortShowsBy('teleramaRating', 'desc');
  }

  sortShowsByDuration(): void {
    this.sortShowsBy('duration', 'asc');
  }

  private sortShowsBy(criterion: string, order: 'asc' | 'desc' = 'desc'): void {
    this.tagItems = this.tagItems.map(tagItem => {
      tagItem.galleryData.items.sort((item1, item2) => {
        const value1 = item1[criterion];
        const value2 = item2[criterion];
        if (value1 != value2) {
          if (order === 'desc') {
            return value1 > value2 ? -1 : 1;
          } else {
            return value1 > value2 ? 1 : -1;
          }
        }
        return item1.name.localeCompare(item2.name);
      });
      return tagItem;
    });
  }

  hideWatchedShows: boolean = true;

  toggleWatched(): void {
    this.hideWatchedShows = !this.hideWatchedShows;
    this.tagItems = this.tagItems.map(tagItem => {
      tagItem.galleryData.hideWatchedShows = this.hideWatchedShows;
      return tagItem;
    });    
  }

  isShowReorderTagsPopup: boolean = false;

  showReorderTagsPopup(): void {
    this.isShowReorderTagsPopup = true;
  }

  closeReorderTagsPopup(): void {
    this.isShowReorderTagsPopup = false;
    let orderedTagIds = this.tagItems.map(item => item.tag.id);
    this.tagService.reorder(orderedTagIds).subscribe(tags => {
      this.toGallery(tags);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tagItems, event.previousIndex, event.currentIndex);
  }

}
