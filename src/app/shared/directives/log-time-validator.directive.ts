import { FormGroup, ValidatorFn } from '@angular/forms';
import { compareAsc, parse } from 'date-fns';

export function logTimeValidator(): ValidatorFn {
  return (group: FormGroup): { [key: string]: any } => {
    const startString = group.controls.startTime.value;
    const endString = group.controls.endTime.value;

    if (startString && endString) {
      const start = parse(startString);
      const end = parse(endString);
      // compareAsc = 1 if start is AFTER end
      // compareAsc = -1 if start is before end
      // compareAsc = 0 if start and end are the same
      return compareAsc(start, end) === 1
        ? { logTime: 'endTime cannot be before startTime' }
        : null;
    }
  };
}
