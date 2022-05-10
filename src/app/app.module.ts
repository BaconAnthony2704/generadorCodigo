import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainHistoryComponent } from './components/main-history/main-history.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MainHistoryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    InputTextareaModule,

    TableModule,

    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
