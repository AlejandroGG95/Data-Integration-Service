import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { FormsModule } from '@angular/forms';
import { WelcomeComponent } from './welcome.component';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ModalCreateComponent } from './modal-create/modal-create.component';
import { NzModalModule} from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ModalEditComponent } from './modal-edit/modal-edit.component';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { HttpService } from '../../services/http.service';
import { NzPopconfirmModule  } from 'ng-zorro-antd/popconfirm'
import { ModalPlanComponent } from './modal-plan/modal-plan.component';
import { NzTimePickerModule, NzTagModule, NzToolTipModule, NzIconModule } from 'ng-zorro-antd';
import { ModelLogComponent } from './model-log/model-log.component';
import { NzDescriptionsModule  } from 'ng-zorro-antd/descriptions'
@NgModule({
  imports: [WelcomeRoutingModule,
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
            NzIconModule],
  declarations: [WelcomeComponent, ModalCreateComponent, ModalEditComponent,ModalPlanComponent, ModelLogComponent],
  providers:[
    HttpService
  ],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
