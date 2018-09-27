import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'bl-duration-picker',
  templateUrl: './duration-picker.component.html',
  styleUrls: ['./duration-picker.component.scss'],
})
export class DurationPickerComponent implements OnInit {
  @Input() showLabel = true;
  @Input() estimate: number;
  hours: number[];
  selectedHour: number;
  minutes: string[];
  selectedMinutes: string;

  @Output() handleDuration = new EventEmitter<number>();

  constructor() {
    this.hours = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
    ];
    this.minutes = ['00', '15', '30', '45'];
    this.selectedHour = 0;
    this.selectedMinutes = '00';
  }

  ngOnInit() {
    if (this.estimate) {
      const decimal: number = +(this.estimate % 1).toFixed(2);
      this.selectedHour = Math.floor(this.estimate);
      switch (decimal) {
        case 0:
          this.selectedMinutes = '00';
          break;
        case 0.25:
          this.selectedMinutes = '15';
          break;
        case 0.5:
          this.selectedMinutes = '30';
          break;
        case 0.75:
          this.selectedMinutes = '45';
          break;
        default:
          this.selectedMinutes = '00';
          break;
      }
    }
  }

  reset() {
    this.selectedHour = 0;
    this.selectedMinutes = '00';
  }

  setHour(hour) {
    this.selectedHour = hour;
    this.handleDuration.emit(hour + +this.selectedMinutes / 60);
  }
  setMinutes(min) {
    this.selectedMinutes = min;
    this.handleDuration.emit(+min / 60 + this.selectedHour);
  }
}
