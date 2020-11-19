import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

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
import { GroupPageComponent } from './group-page/group-page.component';
import { CreateUsersComponent } from './create-users/create-users.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    HttpClientJsonpModule,
    RouterModule.forRoot([
      {path: '', component: LoginPageComponent},
      {path: 'config', component: ConfigComponent},
      {path: 'groups/:groupId', component: GroupPageComponent},
      {path: 'menu', component: MenuPageComponent},
      {path: 'user', component: UserPageComponent},
      {path: 'phone', component: PhonePageComponent},
      {path: 'users/:userId', component: UserDetailsComponent },
      {path: 'createUsers', component: CreateUsersComponent}])
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
    ReceiptPageComponent,
    GroupPageComponent,
    CreateUsersComponent
  ],
  providers: [ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
