import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Apollo } from 'apollo-angular';
import { differenceInMinutes, format, isValid, parse } from 'date-fns';
import Log from '@features/log/Log';
import { NEW_LOG, UPDATE_LOG } from '@features/log/schema/mutations';
import { LOG_LIST_QUERY, LogListQuery } from '@features/log/schema/queries';
import Project from '@features/project/Project';
import {
  GET_ALL_PROJECT_TASKS,
  GET_PROJECT_NAMES,
  GetAllProjectTasksQuery,
  GetProjectNameQuery,
} from '@features/project/schema/queries';
import Task from '@features/project/Task';
import { map } from 'rxjs/operators';
import { logTimeValidator } from '@shared/directives/log-time-validator.directive';

import { LogErrorStateMatcher } from './LogErrorStateMatcher';
import { TOGGLE_TASK } from '@features/project/schema/mutations';

interface DialogData extends Log {
  header: string;
  projectId?: string;
}
@Component({
  selector: 'bl-new-log-dialog',
  templateUrl: './new-log-dialog.component.html',
  styleUrls: ['./new-log-dialog.component.scss'],
})
export class NewLogDialogComponent implements OnInit {
  projects: Project[];
  newLogForm: FormGroup;
  endTimeMatcher = new LogErrorStateMatcher();
  projectTasks: Task[];
  duration = 0;

  editProject: string;

  constructor(
    public dialogRef: MatDialogRef<NewLogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public fb: FormBuilder,
    private apollo: Apollo,
  ) {
    this.createForm(data);
  }

  ngOnInit() {
    this.apollo
      .watchQuery<GetProjectNameQuery>({ query: GET_PROJECT_NAMES })
      .valueChanges.pipe(map(p => p.data.allProjects.projects))
      .subscribe(projects => {
        this.projects = projects;
      });
  }

  createForm(data): void {
    this.newLogForm = this.fb.group(
      {
        id: [data.id],
        project: [
          data.project
            ? data.project.id
            : data.projectId ? data.projectId : null,
          Validators.required,
        ],
        date: [
          isValid(parse(data.start)) ? parse(data.start) : new Date(),
          Validators.required,
        ],
        startTime: [parse(data.start), Validators.required],
        endTime: [parse(data.end), Validators.required],
        tasks: [{ value: '', disabled: true }, null],
        note: [
          data.note || null,
          Validators.compose([Validators.required, Validators.maxLength(255)]),
        ],
      },
      {
        validator: logTimeValidator(),
      },
    );
    this.durationChange();
    this.newLogForm.get('project').valueChanges.subscribe(project => {
      this.apollo.watchQuery<GetAllProjectTasksQuery>({
        query: GET_ALL_PROJECT_TASKS,
        variables: {
          project,
        },
      }).valueChanges.subscribe(q => {
        const openTasks = q.data.allProjectTasks.tasks.filter(task => !task.completed);
        this.projectTasks = openTasks;
        if (openTasks.length) {
          this.newLogForm.get('tasks').enable();
        }
      });
    });
  }

  durationChange(): void {
    const startTime = this.newLogForm.get('startTime');
    const endTime = this.newLogForm.get('endTime');

    endTime.valueChanges.subscribe(
      val =>
        (this.duration =
          differenceInMinutes(endTime.value, startTime.value) / 60),
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveLog(): void {
    if (this.newLogForm.valid) {
      const self = this;

      const { startTime, endTime, date, project, note, tasks } = this.newLogForm.value;
      const formatDate = format(date, 'YYYY-MM-DD');
      const formatStart = format(startTime, 'HH:mm:ssZ');
      const formatEnd = format(endTime, 'HH:mm:ssZ');
      const start = format(
        `${formatDate} ${formatStart}`,
        'YYYY-MM-DD H:mm:ssZ',
      );
      const end = format(`${formatDate} ${formatEnd}`, 'YYYY-MM-DD H:mm:ssZ');

      this.apollo
        .mutate({
          mutation: NEW_LOG,
          variables: {
            start,
            end,
            duration: this.duration,
            note,
            project,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            createLog: {
              __typename: 'createLog',
              log: {
                __typename: 'Log',
                id: 'tempid',
                start,
                end,
                duration: this.duration,
                project: {
                  __typename: 'Project',
                  id: project,
                  name: this.projects.find(p => p.id === project)['name'],
                  color: '',
                },
                note,
              },
            },
          },
          update: (proxy, { data: { createLog } }) => {
            const listQuery = {
              query: LOG_LIST_QUERY,
              variables: {
                project: this.data.projectId || null,
              },
            };
            const data: LogListQuery = proxy.readQuery(listQuery);
            data.allLogsByProjectId.logs.unshift(createLog.log);
            proxy.writeQuery({ ...listQuery, data });
          },
        })
        .subscribe(q => {
          this.dialogRef.close();
          tasks.forEach(task => {
            this.apollo.mutate({
              mutation: TOGGLE_TASK,
              variables: {
                id: task,
              },
            }).subscribe();
          });
        });
    }
  }

  editLog() {
    const self = this;
    const {
      id,
      startTime,
      endTime,
      date,
      project,
      note,
    } = this.newLogForm.value;
    const duration = differenceInMinutes(endTime, startTime) / 60;
    const formatDate = format(date, 'YYYY-MM-DD');
    const formatStart = format(startTime, 'HH:mm:ssZ');
    const formatEnd = format(endTime, 'HH:mm:ssZ');
    const start = format(`${formatDate} ${formatStart}`, 'YYYY-MM-DD H:mm:ssZ');
    const end = format(`${formatDate} ${formatEnd}`, 'YYYY-MM-DD H:mm:ssZ');

    this.apollo
      .mutate({
        mutation: UPDATE_LOG,
        variables: {
          id,
          start,
          end,
          duration,
          note,
          project,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateLog: {
            __typename: 'updateLog',
            log: {
              __typename: 'Log',
              id,
              start,
              end,
              duration,
              project: {
                __typename: 'Project',
                id: project,
                name: this.projects.find(proj => proj.id === project)['name'],
                color: '',
              },
              note,
            },
          },
        },
        update: (proxy, { data: { updateLog } }) => {
          const listQuery = {
            query: LOG_LIST_QUERY,
            variables: {
              project: this.data.projectId || null,
            },
          };
          const data: LogListQuery = proxy.readQuery(listQuery);
          const index = data.allLogsByProjectId.logs
            .map(l => l.id)
            .indexOf(updateLog.log.id);
          const logs = data.allLogsByProjectId.logs;

          data.allLogsByProjectId.logs = [
            ...logs.slice(0, index),
            updateLog.log,
            ...logs.slice(index + 1),
          ];

          proxy.writeQuery({ ...listQuery, data });
        },
      })
      .subscribe(q => {
        this.dialogRef.close();
      });
  }

  getErrorMessage() {
    return this.newLogForm.hasError('logTime');
  }
}
