import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { DurationPickerComponent } from '@features/project/components/duration-picker/duration-picker.component';
import { NEW_TASK } from '@features/project/schema/mutations';
import {
  GET_PROJECT_TASK,
  GetProjectTasksQuery,
} from '@features/project/schema/queries';

@Component({
  selector: 'bl-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent implements OnInit {
  @Input() selectedProject: string;
  @Input() parent: string;
  @ViewChild(DurationPickerComponent) durationPicker: DurationPickerComponent;
  taskText = new FormControl('', [Validators.required]);
  taskPriority = new FormControl(0, []);
  taskEstimate = 0;

  constructor(private apollo: Apollo) {}

  ngOnInit() {}

  setDuration(event) {
    this.taskEstimate = event;
  }

  createTask() {
    const text = this.taskText.value;
    const priority = this.taskPriority.value;
    const estimate = this.taskEstimate;
    const project = this.selectedProject;
    const parent = this.parent;

    if (this.taskText.valid) {
      this.apollo
        .mutate({
          mutation: NEW_TASK,
          variables: {
            text,
            estimate,
            priority,
            project,
            parent,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            createTask: {
              __typename: 'createTask',
              task: {
                __typename: 'Task',
                id: 'temptaskid',
                text,
                estimate,
                priority,
                completed: false,
                children: [],
                project: {
                  __typename: 'Project',
                  id: project,
                  name: '',
                  color: '',
                },
              },
            },
          },
          refetchQueries: [
            {
              query: GET_PROJECT_TASK,
              variables: {
                project,
                limit: 500,
              },
            },
          ],
        })
        .subscribe(t => {
          this.taskText.reset();
          this.durationPicker.reset();
        });
    }
  }

  getErrorMessage() {
    return this.taskText.hasError('required') ? 'You must enter a task' : '';
  }
}
