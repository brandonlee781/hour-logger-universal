import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Apollo } from 'apollo-angular';
import { format, isSameDay, isSameMonth, parse } from 'date-fns';
import Log from '@features/log/Log';
import { Subject } from 'rxjs';
import { LOG_LIST_QUERY, LogListQuery } from '../../schema/queries';

interface CalEvent extends CalendarEvent {
  log: Log;
}
@Component({
  selector: 'bl-log-calendar',
  templateUrl: './log-calendar.component.html',
  styleUrls: ['./log-calendar.component.scss'],
})
export class LogCalendarComponent implements OnInit, OnChanges {
  logs: Log[];
  events: CalEvent[] = [];
  view = 'month';
  viewDate = new Date();
  refresh = new Subject<any>();
  activeDayIsOpen = false;
  @Input() selectedProject;
  @Output() editLog = new EventEmitter<Log>();

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.getLogs(this.selectedProject);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.selectedProject.firstChange) {
      this.getLogs(this.selectedProject);
    }
  }

  getLogs(project) {
    this.apollo
      .watchQuery<LogListQuery>({
        query: LOG_LIST_QUERY,
        variables: {
          project: project !== 'recent' ? project : null,
          options: {
            limit: 1000,
          },
        },
      })
      .valueChanges.subscribe(response => {
        const logs: Log[] = response.data.allLogsByProjectId.logs;
        this.logs = logs;
        this.events = logs.map(log => ({
          start: parse(log.start),
          end: parse(log.end),
          title: `
          ${log.project.name}
          ${format(log.start, 'h:mm a')} - ${format(log.end, 'h:mm a')}
        `,
          color: {
            primary: log.project.color,
            secondary: log.project.color,
          },
          log,
        }));
        this.refresh.next();
      });
  }

  dayClicked({ date, events }: { date: Date; events: CalEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  handleEvent(event: CalEvent): void {
    this.editLog.emit(event.log);
  }
}
