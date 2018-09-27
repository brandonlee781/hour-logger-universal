import { map } from 'rxjs/operators';
// tslint:disable:component-class-suffix

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import Project from '@features/project/Project';
import {
  GET_PROJECT_NAMES,
  GetProjectNameQuery,
} from '@features/project/schema/queries';
import { Observable } from 'rxjs';
import { Link } from '@shared/types';

@Component({
  selector: 'bl-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit {
  links: Link[];
  headerTitle: string;
  showNewProject = false;
  open = false;
  loading: boolean;

  constructor(private apollo: Apollo, private location: Location) {}

  ngOnInit() {
    this.loading = true;
    this.headerTitle = 'Select a Project';
    this.apollo
      .watchQuery<GetProjectNameQuery>({ query: GET_PROJECT_NAMES })
      .valueChanges
      .subscribe(q => {
        const projects = q.data.allProjects.projects;
        this.links = projects.map((proj: Project) => ({
          icon: 'folder_open',
          path: '/projects',
          route: proj.name,
          text: proj.name,
          id: proj.id,
        }));
        this.loading = false;
      });
  }
}
