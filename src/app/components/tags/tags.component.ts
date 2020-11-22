import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

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
          hideWatchedShows: this.hideWatchedShows,
          displayWatchedIconOnly: true,
          items: tag['shows']
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
            rating: show.rating,
            releaseYear: show.releaseYear,
            watched: show.watched
          }))
        }
      }));
  }

  createTag(): void {
    var tagName = prompt("Name", "");
    this.tagService.create(tagName).subscribe(tags => this.toGallery(tags));
  }

  renameTag(tagId: string, tagLabel: string): void {
    var tagName = prompt("Name", tagLabel);
    this.tagService.rename(tagId, tagName).subscribe(tags => this.toGallery(tags));
  }

  sortFunctions: Function[] = [
    (item1, item2) => item1['rating'] > item2['rating'] ? -1 : 1,
    (item1, item2) => item1['releaseYear'] > item2['releaseYear'] ? -1 : 1
  ];

  sortIndex: number = 0;

  sortShows(): void {
    this.tagItems = this.tagItems.map(tagItem => {
      tagItem.galleryData.items.sort((item1, item2) => {
        if (item1['watched'] != item2['watched']) {
          return item1['watched'] ? 1 : -1;
        }
        return this.sortFunctions[this.sortIndex](item1, item2);
      });
      return tagItem; 
    })
    this.sortIndex = (this.sortIndex+1)%this.sortFunctions.length;
  }

  hideWatchedShows: boolean = true;

  toggleWatched(): void {
    this.hideWatchedShows = !this.hideWatchedShows;
    this.tagItems = this.tagItems.map(tagItem => {
      tagItem.galleryData.hideWatchedShows = this.hideWatchedShows;
      return tagItem;
    });    
  }

  isShowReorderPopup: boolean = false;

  showReorderPopup(): void {
    this.isShowReorderPopup = true;
  }

  closeReorderPopup(): void {
    this.isShowReorderPopup = false;
    let orderedTagIds = this.tagItems.map(item => item.tag.id);
    this.tagService.reorder(orderedTagIds).subscribe(tags => {
      this.toGallery(tags);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tagItems, event.previousIndex, event.currentIndex);
  }

}
