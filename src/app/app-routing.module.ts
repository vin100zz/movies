import { SearchComponent } from './components/search/search.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MoviesComponent } from './components/movies/movies.component';
import { ShowComponent } from "./components/show/show.component";

import { PersonComponent } from './components/person/person.component';


const routes: Routes = [
  { path: '', redirectTo: '/movies', pathMatch: 'full' },

  { path: 'search', component: SearchComponent },
  { path: 'movies', component: MoviesComponent },
  { path: 'show/:type/:id', component: ShowComponent },
  { path: 'person/:id', component: PersonComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }