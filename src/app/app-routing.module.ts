import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainHistoryComponent } from './components/main-history/main-history.component';


const routes: Routes = [
  { path: '', component: MainHistoryComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
