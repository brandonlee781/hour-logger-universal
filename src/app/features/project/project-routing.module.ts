import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProjectPage } from './pages/project/project.page';
import { ProjectsPage } from './pages/projects/projects.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectsPage,
    children: [
      {
        path: ':project',
        component: ProjectPage,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
