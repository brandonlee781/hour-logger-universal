import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Apollo } from 'apollo-angular';
import { LogViewService } from '@features/log/services/log-view.service';
import Project from '@features/project/Project';
import { GET_PROJECT_NAMES } from '@features/project/schema/queries';
import { NavDrawerService } from '@shared/services/nav-drawer.service';

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
  path: string;
}

@Component({
  selector: 'bl-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {
  links: Link[];
  currentView;
  isDesktop: boolean;
  loading: boolean;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver,
    private navDrawerService: NavDrawerService,
    private logViewService: LogViewService,
  ) {}

  ngOnInit() {
    this.loading = true;
    this.logViewService.view$.subscribe(v => {
      this.currentView = v;
    });
    this.apollo
      .watchQuery<ProjectQuery>({ query: GET_PROJECT_NAMES })
      .valueChanges
      .subscribe(q => {
        const projects = q.data.allProjects.projects;
        this.links = projects.map((proj: Project) => ({
          icon: proj.id === '' ? '' : 'folder_open',
          path: '/logs',
          route: proj.name,
          text: proj.name,
          id: proj.id,
        }));
        this.loading = false;
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

  onToggleCalendar() {
    this.logViewService.toggleView();
  }
}
