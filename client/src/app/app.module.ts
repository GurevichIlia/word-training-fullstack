import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NbDialogModule, NbMenuModule, NbSidebarModule, NbThemeModule } from '@nebular/theme';
import * as Hammer from 'hammerjs';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InstallSuggestionComponent } from './core/install-app/install-suggestion/install-suggestion.component';
import { ServerErrorInterceptor } from './core/interceptors/server-error.interceptor';
import { TokenInterceptorService } from './core/interceptors/token.interceptor';
import { SharedModule } from './shared/shared.module';








@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    'swipe': { direction: Hammer.DIRECTION_ALL }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    InstallSuggestionComponent,

    // UserDataComponent,
    // HomeComponent,
    // WordListComponent,



    // SelectionComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HammerModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,

    NbMenuModule.forRoot(),
    NbThemeModule.forRoot({ name: 'default' }),
    NbSidebarModule.forRoot(), // NbSidebarModule.forRoot(), //if this is your app.module
    NbDialogModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),



  ],
  exports: [
    BrowserAnimationsModule,

  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },

    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig }],
  bootstrap: [AppComponent]
})
export class AppModule { }
