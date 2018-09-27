import { map } from 'rxjs/operators';
// tslint:disable:component-class-suffix

import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Apollo, QueryRef } from 'apollo-angular';
import { differenceInMinutes, format } from 'date-fns';
import { NewLogDialogComponent } from '@features/log/components/new-log-dialog/new-log-dialog.component';
import Log from '@features/log/Log';
import { LogViewService } from '@features/log/services/log-view.service';
import Project from '@features/project/Project';
import {
  GET_PROJECT_NAMES,
  GetProjectNameQuery,
} from '@features/project/schema/queries';

import { NEW_LOG, UPDATE_LOG } from '../../schema/mutations';
import { LOG_LIST_QUERY, LogListQuery } from '../../schema/queries';
import { InfiniteScrollLoadingSnackbarComponent } from '@features/ui/components/infinite-scroll-loading-snackbar/infinite-scroll-loading-snackbar.component';

interface ProjectQuery {
  allProjects: {
    projects: Project[];
  };
}

interface Link {
  icon: string;
  text: string;
  id: string;
  isSelected: boolean;
}

@Component({
  selector: 'bl-log',
  templateUrl: './log.page.html',
  styleUrls: ['./log.page.scss'],
})
export class LogPage implements OnInit {
  logs: Log[];
  project: Project;
  logQuery: QueryRef<any>;
  isDesktop: boolean;
  open = false;
  currentView;
  loading = false;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private logViewService: LogViewService,
    private snackBar: MatSnackBar,
  ) {
    this.route.params.subscribe(params => {
      this.apollo
        .watchQuery<GetProjectNameQuery>({ query: GET_PROJECT_NAMES })
        .valueChanges.pipe(map(p => p.data.allProjects.projects))
        .subscribe((projects: Project[]) => {
          this.project = projects.find(
            proj => proj.name === params.project || proj.name === '',
          );
          const projectId = this.project ? this.project.id : null;
          this.getLogs(projectId);
        });
    });
  }

  ngOnInit() {
    this.logViewService.view$.subscribe(v => {
      this.currentView = v;
    });
  }

  getLogs(id = null) {
    this.loading = true;
    this.logQuery = this.apollo.watchQuery<LogListQuery>({
      query: LOG_LIST_QUERY,
      variables: {
        project: id,
      },
    });
    this.logQuery.valueChanges.subscribe(q => {
      this.logs = q.data.allLogsByProjectId.logs;
      this.loading = false;
    });
  }

  loadMoreLogs() {
    const snack = this.snackBar.openFromComponent(InfiniteScrollLoadingSnackbarComponent);
    this.logQuery.fetchMore({
      variables: {
        offset: this.logs.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        snack.dismiss();
        return {
          allLogsByProjectId: {
            __typename: prev.allLogsByProjectId.__typename,
            logs: [
              ...prev.allLogsByProjectId.logs,
              ...fetchMoreResult.allLogsByProjectId.logs,
            ],
          },
        };
      },
    });
  }

  /**
   * Method controls the opening of the New Log Dialog and sets
   * an event on close. If a valid log is passed back when dialog
   * closes perform a mutation on the log list
   */
  openDialog(projectId): void {
    const createLogDialog = this.dialog.open(NewLogDialogComponent, {
      panelClass: 'new-log-dialog',
      data: { header: 'New Log Entry', projectId },
    });
  }

  editLog(log: Log): void {
    const editLogDialog = this.dialog.open(NewLogDialogComponent, {
      panelClass: 'new-log-dialog',
      data: { header: 'Edit Log Entry', ...log },
    });
  }
}
