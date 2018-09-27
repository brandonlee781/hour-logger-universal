import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import Project from '@features/project/Project';
import {
  TOGGLE_PROJECT_FAVORITE,
  UPDATE_PROJECT_COLOR,
} from '@features/project/schema/mutations';
import {
  GET_PROJECT_NAMES,
  GET_PROJECT_TASK,
  GetProjectNameQuery,
  GetProjectTasksQuery,
} from '@features/project/schema/queries';
import Task from '@features/project/Task';
import { map } from 'rxjs/operators';

// tslint:disable:component-class-suffix

interface Link {
  icon: string;
  text: string;
  id: string;
  isSelected: boolean;
}

@Component({
  selector: 'bl-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {
  project: Project;
  tasks: Task[] = [];
  open = false;
  mdColors = [
    '#e57373',
    '#d32f2f',
    '#ff8a80',
    '#f06292',
    '#c2185b',
    '#ff80ab',
    '#ba68c8',
    '#7b1fa2',
    '#ea80fc',
    '#9575cd',
    '#512da8',
    '#b388ff',
    '#7986cb',
    '#303f9f',
    '#8c9eff',
    '#64b5f6',
    '#1976d2',
    '#82b1ff',
    '#4fc3f7',
    '#0288d1',
    '#80d8ff',
    '#4dd0e1',
    '#0097a7',
    '#84ffff',
    '#4db6ac',
    '#00796b',
    '#a7ffeb',
    '#81c784',
    '#388e3c',
    '#b9f6ca',
    '#aed581',
    '#689f38',
    '#ccff90',
    '#dce775',
    '#afb42b',
    '#f4ff81',
    '#fff176',
    '#fbc02d',
    '#ffff8d',
    '#ffd54f',
    '#ffa000',
    '#ffe57f',
    '#ffb74d',
    '#f57c00',
    '#ffd180',
    '#ff8a65',
    '#e64a19',
    '#ff9e80',
    '#a1887f',
    '#5d4037',
    '#e0e0e0',
    '#616161',
    '#90a4ae',
    '#455a64',
  ];

  taskText = new FormControl('', [Validators.required]);
  taskPriority = 0;
  taskEstimate = 0;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.params.subscribe(params => {
      this.apollo
        .watchQuery<GetProjectNameQuery>({ query: GET_PROJECT_NAMES })
        .valueChanges.pipe(map(p => p.data.allProjects.projects))
        .subscribe((projects: Project[]) => {
          this.project = projects.find(
            proj => proj.name === params.project || proj.name === '',
          );
          if (this.project) {
            this.getTasks(this.project.id);
          } else {
            this.router.navigate(['/projects']);
          }
        });
    });
  }

  getTasks(id) {
    this.apollo
      .watchQuery<GetProjectTasksQuery>({
        query: GET_PROJECT_TASK,
        variables: {
          project: id,
          limit: 500,
        },
      })
      .valueChanges.subscribe(data => {
        this.tasks = data.data.projectTasks.tasks;
      });
  }

  ngOnInit() {}

  editColor(event) {
    this.apollo
      .mutate({
        mutation: UPDATE_PROJECT_COLOR,
        variables: {
          id: this.project.id,
          color: event,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateProject: {
            __typename: 'updateProject',
            project: {
              __typename: 'Project',
              id: this.project.id,
              name: this.project.name,
              color: event,
              completed: this.project.favorite,
            },
          },
        },
        refetchQueries: [
          {
            query: GET_PROJECT_NAMES,
            variables: {
              project: this.project.id,
              limit: 500,
            },
          },
        ],
      })
      .subscribe();
  }

  toggleFavorite() {
    this.apollo
      .mutate({
        mutation: TOGGLE_PROJECT_FAVORITE,
        variables: {
          id: this.project.id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          toggleProjectFavorite: {
            __typename: 'toggleProjectFavorite',
            project: {
              __typename: 'Project',
              id: this.project.id,
              name: this.project.name,
              color: this.project.color,
              completed: !this.project.favorite,
            },
          },
        },
        refetchQueries: [
          {
            query: GET_PROJECT_NAMES,
          },
        ],
        // update: (proxy, { data: { toggleProjectFavorite } }) => {
        //   const projectQuery = {
        //     query: GET_PROJECT_NAMES,
        //   };
        //   const data: GetProjectNameQuery = proxy.readQuery(projectQuery);
        //   const projectIndex = data.allProjects.projects.findIndex(p => p.id === this.project.id);
        //   data.allProjects.projects[projectIndex].favorite = !data.allProjects.projects[projectIndex].favorite

        //   proxy.writeQuery({ ...projectQuery, data });
        // },
      })
      .subscribe();
  }
}
