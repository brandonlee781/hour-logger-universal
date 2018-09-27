import { Pipe, PipeTransform } from '@angular/core';
import Task from '@features/project/Task';

@Pipe({
  name: 'completedTask',
})
export class CompletedTaskPipe implements PipeTransform {
  transform(tasks: Task[], bool: boolean): any {
    return tasks.filter(t => t.completed === bool);
  }
}
