import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UserPageComponent } from './user-page/user-page.component';
import { UserAlertsComponent } from './user-alerts/user-alerts.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ConfigComponent } from './config/config.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { UserComponent } from './user/user.component';
import { ConfigService } from './config/config.service';
import { MenuPageComponent } from './menu-page/menu-page.component';
import { PhonePageComponent } from './phone-page/phone-page.component';
import { ReceiptPageComponent } from './receipt-page/receipt-page.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: '', component: MenuPageComponent},
      {path: 'user', component: UserComponent},
      {path: 'phone', component: PhonePageComponent},
      {path: 'users/:userId', component: UserDetailsComponent },
      {path: 'login', component: LoginPageComponent}])
  ],
  declarations: [
    AppComponent,
    UserPageComponent,
    UserAlertsComponent,
    UserDetailsComponent,
    TopBarComponent,
    ConfigComponent,
    LoginPageComponent,
    UserComponent,
    MenuPageComponent,
    PhonePageComponent,
    ReceiptPageComponent
  ],
  providers: [ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
