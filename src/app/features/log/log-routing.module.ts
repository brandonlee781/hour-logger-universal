import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogPage } from '@features/log/pages/log/log.page';
import { LogsPage } from '@features/log/pages/logs/logs.page';

const routes: Routes = [
  {
    path: '',
    component: LogsPage,
    children: [
      {
        path: '',
        component: LogPage,
      },
      {
        path: ':project',
        component: LogPage,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogRoutingModule {}
