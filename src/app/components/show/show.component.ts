import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ShowService } from '../../services/show.service';
import { TagService } from '../../services/tag.service';
import { Movie } from '../../model/movie';
import { Show } from '../../model/show';

import { Tag } from '../../model/tag';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {

  show: Show;

  tags: Tag[];

  youtubeLink: SafeResourceUrl;

  constructor(private route: ActivatedRoute, private router: Router, private domSanitizer: DomSanitizer, private showService: ShowService, private tagService: TagService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.showService.get(params.id, params.type).subscribe(show => {
        this.show = show;
        if (this.show.youtubeId) {
          this.youtubeLink = this.domSanitizer.bypassSecurityTrustResourceUrl(this.show.youtubeId);
        }
      });
      this.tagService.list().subscribe(tags => this.tags = tags);
    });
  }

  save(): Observable<Object> {
    return new Observable<Object>(observer => {
      this.showService.save(this.show).subscribe(show => {
        this.show = show;
        observer.next();
      });
    });
  }

  toggleTag(tagId: string): void {
    this.save().subscribe(() => {
      if (this.show.tags.includes(tagId)) {
        this.tagService.untagShow(this.show.id, this.show.type, tagId).subscribe(() =>
          this.show.tags.splice(this.show.tags.indexOf(tagId), 1));
      } else {
        this.tagService.tagShow(this.show.id, this.show.type, tagId).subscribe(() =>
          this.show.tags.push(tagId));
      }
    });
  }

  toggleWatched(): void {
    this.save().subscribe(() => {
      this.showService.toggleWatched(this.show).subscribe(show => this.show = show);
    });
  }

  getTag(tagId: string): Tag {
    return this.tags.find(t => t.id === tagId);
  }

}
