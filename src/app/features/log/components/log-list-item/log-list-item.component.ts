import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Apollo } from 'apollo-angular';
import Log from '@features/log/Log';
import { DELETE_LOG } from '../../schema/mutations';
import { LOG_LIST_QUERY, LogListQuery } from '../../schema/queries';

@Component({
  selector: 'bl-log-list-item',
  templateUrl: './log-list-item.component.html',
  styleUrls: ['./log-list-item.component.scss'],
})
export class LogListItemComponent implements OnInit {
  @Input() log: Log;
  @Input() selectedProject: string;
  @Output() editLog = new EventEmitter<Log>();
  confirmDelete = false;
  confirmDeleteTimeout;

  constructor(private apollo: Apollo, public snackBar: MatSnackBar) {}

  ngOnInit() {}

  handleDelete() {
    this.confirmDelete = true;
    this.confirmDeleteTimeout = setTimeout(() => {
      this.confirmDelete = false;
    }, 5000);
  }

  deleteLog() {
    clearTimeout(this.confirmDeleteTimeout);
    this.apollo
      .mutate({
        mutation: DELETE_LOG,
        variables: {
          logId: this.log.id,
        },
        update: (proxy, { data: { deleteLog } }) => {
          const listQuery = {
            query: LOG_LIST_QUERY,
            variables: {
              project: this.selectedProject || null,
            },
          };
          const data: LogListQuery = proxy.readQuery(listQuery);
          const filtered = data.allLogsByProjectId.logs.filter(
            l => l.id !== this.log.id,
          );
          data.allLogsByProjectId.logs = filtered;
          proxy.writeQuery({ ...listQuery, data });
          this.confirmDelete = false;
          this.snackBar.open('Log Entry Deleted', null, { duration: 3000 });
        },
      })
      .subscribe();
  }

  onEditClick() {
    const log = this.log;
    this.editLog.emit(log);
  }
}
