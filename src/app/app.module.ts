import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator'
import {MatSortModule} from '@angular/material/sort';
import {MatStepperModule} from '@angular/material/stepper'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatDialogModule} from '@angular/material/dialog'
import {MatFormFieldModule } from '@angular/material/form-field'
import {MatTabsModule} from '@angular/material/tabs';
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {MatNativeDateModule} from '@angular/material/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { fas } from '@fortawesome/free-solid-svg-icons';


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
import { ParadataGroupComponent } from './paradata-group/paradata-group.component';
import { ParadataUserComponent } from './paradata-user/paradata-user.component';
import { ModalComponent } from './modal/modal.component';
import { ParadataGraphPageComponent } from './paradata-graph-page/paradata-graph-page.component'

const material = [
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatStepperModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatTabsModule,
  MatSelectModule,
  MatNativeDateModule
]

@NgModule({
  imports: [
    MatFormFieldModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    HttpClientJsonpModule,
    ChartsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatSelectModule,
    MatTabsModule,
    MatCheckboxModule,
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatNativeDateModule,
    
    RouterModule.forRoot([
      {path: '', component: LoginPageComponent},
      {path: 'menu', component: MenuPageComponent},
      {path: 'overview', component: GroupOverviewComponent},
      {path: 'config', component: ConfigComponent},
      {path: 'groups/:groupId', component: GroupPageComponent},
      {path: 'paradata-group/:groupId', component: ParadataGroupComponent},
      {path: 'paradata-user/:userId', component: ParadataUserComponent},
      {path: 'graphs/:groupId', component: ParadataGraphPageComponent},
      {path: 'phone', component: PhonePageComponent},
      {path: 'receipts/:userId', component: ReceiptPageComponent},
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
    ModalComponent,
    ParadataGraphPageComponent,
  ],
  entryComponents: [],
  providers: [ConfigService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
