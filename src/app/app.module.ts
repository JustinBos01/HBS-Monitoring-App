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
import { GroupOverviewComponent } from './group-overview/group-overview.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ParadataGroupComponent } from './paradata-group/paradata-group.component';
import { ParadataUserComponent } from './paradata-user/paradata-user.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    HttpClientJsonpModule,
    RouterModule.forRoot([
      {path: '', component: LoginPageComponent},
      {path: 'menu', component: MenuPageComponent},
      {path: 'overview', component: GroupOverviewComponent},
      {path: 'config', component: ConfigComponent},
      {path: 'groups/:groupId', component: GroupPageComponent},
      {path: 'paradata-group/:groupId', component: ParadataGroupComponent},
      {path: 'paradata-user/:userId', component: ParadataUserComponent},
      {path: 'phone', component: PhonePageComponent},
      {path: 'receipt', component: ReceiptPageComponent},
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
    CreateUsersComponent,
    GroupOverviewComponent,
    ParadataGroupComponent,
    ParadataUserComponent,
    ModalComponent
  ],
  providers: [ConfigService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
