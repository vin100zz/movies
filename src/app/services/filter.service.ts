import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private showTypeFilterSubject: BehaviorSubject<'M' | 'S'> = new BehaviorSubject<'M' | 'S'>('M');
  public showTypeFilter$: Observable<'M' | 'S'> = this.showTypeFilterSubject.asObservable();

  constructor() { }

  setShowTypeFilter(type: 'M' | 'S'): void {
    this.showTypeFilterSubject.next(type);
  }

  getShowTypeFilter(): 'M' | 'S' {
    return this.showTypeFilterSubject.value;
  }
}

