import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { mobileDialog } from '@features/log/components/new-log-dialog/dialogOptions';
import { NewLogDialogComponent } from '@features/log/components/new-log-dialog/new-log-dialog.component';
import Log from '@features/log/Log';
import { LogViewService } from '@features/log/services/log-view.service';
import Project from '@features/project/Project';
import { GET_PROJECT_NAMES, GetProjectNameQuery } from '@features/project/schema/queries';
import {
  InfiniteScrollLoadingSnackbarComponent,
} from '@features/ui/components/infinite-scroll-loading-snackbar/infinite-scroll-loading-snackbar.component';
import { OpenModalService } from '@features/ui/services/open-modal.service';
import { Apollo, QueryRef } from 'apollo-angular';
import { map } from 'rxjs/operators';

import { LOG_LIST_QUERY, LogListQuery } from '../../schema/queries';

// tslint:disable:component-class-suffix

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
export class LogPage implements OnInit, OnDestroy {
  logs: Log[];
  project: Project;
  logQuery: QueryRef<any>;
  isDesktop: boolean;
  open = false;
  modalOpen: boolean;
  currentView;
  loading = false;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private logViewService: LogViewService,
    private snackBar: MatSnackBar,
    public breakpointObserver: BreakpointObserver,
    private openModalService: OpenModalService,
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
    this.openModalService.open$.subscribe(open => {
      if (open && !this.modalOpen) {
        this.openDialog(this.project ? this.project.id : '');
      }
    });
    this.dialog.afterAllClosed.subscribe(closed => {
      this.modalOpen = false;
      this.openModalService.toggleOpen('closed');
    });
    this.breakpointObserver
      .observe([Breakpoints.Large, Breakpoints.XLarge])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isDesktop = true;
        } else {
          this.isDesktop = false;
        }
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
    const options = Object.assign({},
      this.isDesktop ? {} : mobileDialog,
      { data: { header: 'New Log Entry', projectId } }
    );
    this.modalOpen = true;
    const createLogDialog = this.dialog.open(NewLogDialogComponent, options);
  }

  editLog(log: Log): void {
    const options = Object.assign({},
      this.isDesktop ? {} : mobileDialog,
      { data: { header: 'Edit Log Entry', ...log } }
    );
    this.modalOpen = true;
    const editLogDialog = this.dialog.open(NewLogDialogComponent, options);
  }

  ngOnDestroy() {
    this.breakpointObserver.ngOnDestroy();
  }
}
