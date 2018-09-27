import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NEW_PROJECT } from '@features/project/schema/mutations';
import { GET_PROJECT_NAMES, GetProjectNameQuery } from '@features/project/schema/queries';

@Component({
  selector: 'bl-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
})
export class NewProjectComponent implements OnInit {
  @Output() close = new EventEmitter<any>();

  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit() {}

  addProject(name) {
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16);

    if (name) {
      this.apollo
        .mutate({
          mutation: NEW_PROJECT,
          variables: {
            name,
            color,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            createProject: {
              __typename: 'createProject',
              project: {
                __typename: 'Project',
                id: 'tempid',
                name,
                color,
                favorite: false,
              },
            },
          },
          update: (proxy, { data: { createProject } }) => {
            const projectQuery = { query: GET_PROJECT_NAMES };
            const data: GetProjectNameQuery = proxy.readQuery(projectQuery);
            data.allProjects.projects.push(createProject.project);
            proxy.writeQuery({ ...projectQuery, data });
          },
        })
        .subscribe(p => {
          this.close.emit();
          this.router.navigate(['/projects', name]);
        });
    }
  }
}
