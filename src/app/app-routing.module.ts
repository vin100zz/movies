import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonComponent } from './components/person/person.component';
import { SearchComponent } from './components/search/search.component';
import { ShowComponent } from "./components/show/show.component";
import { TagsComponent } from './components/tags/tags.component';

const routes: Routes = [
  { path: '', redirectTo: '/tags', pathMatch: 'full' },

  { path: 'search', component: SearchComponent },
  { path: 'tags', component: TagsComponent },
  { path: 'show/:type/:id', component: ShowComponent },
  { path: 'person/:id', component: PersonComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }