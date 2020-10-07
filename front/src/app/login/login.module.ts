import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzBadgeModule, NzDividerModule, NzDropDownModule, NzTableModule, NzLayoutModule, NzCardModule, NzButtonModule, NzModalModule, NzSelectModule, NzInputNumberModule, NzDatePickerModule, NzFormModule, NzRadioModule, NzSwitchModule, NzTimePickerModule, NzTagModule, NzToolTipModule, NzPopconfirmModule, NzDescriptionsModule, NzIconModule } from 'ng-zorro-antd';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    NzInputModule,
    LoginRoutingModule,
    NzTableModule,
    FormsModule,
    CommonModule,
    NzBadgeModule,
    NzDividerModule,
    NzDropDownModule,
    NzLayoutModule,
    NzCardModule,
    NzButtonModule,
    NzModalModule,
    NzSelectModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzFormModule,
    ReactiveFormsModule,
    NzRadioModule,
    NzSwitchModule,
    NzTimePickerModule,
    NzTagModule,
    NzToolTipModule,
    NzPopconfirmModule,
    NzDescriptionsModule,
    NzIconModule
  ]
})
export class LoginModule { }
