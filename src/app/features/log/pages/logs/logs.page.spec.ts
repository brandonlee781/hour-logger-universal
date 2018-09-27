import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { Apollo } from 'apollo-angular';
import { GraphQLModule } from '@core/graphql.module';
import { MaterialModule } from '@core/material.module';

import { LogListItemComponent } from '../../components/log-list-item/log-list-item.component';
import { LogListComponent } from '../../components/log-list/log-list.component';

// describe('LogPage', () => {
//   let component: LogPage;
//   let fixture: ComponentFixture<LogPage>;

//   beforeEach(
//     async(() => {
//       TestBed.configureTestingModule({
//         declarations: [LogPage, LogListComponent, LogListItemComponent],
//         imports: [SharedModule, MaterialModule, GraphQLModule],
//         providers: [Apollo, MatIconRegistry],
//       })
//         .compileComponents()
//         .then(() => {
//           fixture = TestBed.createComponent(LogPage);
//           component = fixture.componentInstance;
//           fixture.detectChanges();
//         });
//     }),
//   );

//   it('should create', () => {
//     expect(component).toBeTruthy();
//     expect(fixture).toMatchSnapshot();
//   });

//   it('should have a list of links', () => {
//     fixture.whenStable().then(() => {
//       component.links$.subscribe(links => {
//         expect(links).toBeTruthy();
//         expect(Array.isArray(links)).toBe(true);
//       });
//     });
//   });

//   it('should have a default link', () => {
//     fixture.whenStable().then(() => {
//       component.links$.subscribe(links => {
//         expect(links).toEqual(
//           expect.arrayContaining([
//             {
//               text: 'Recent Log Entries',
//               id: 'recent',
//               icon: '',
//               isSelected: true,
//             },
//           ]),
//         );
//       });
//     });
//   });

//   it('should change the selected link', () => {
//     const mockLinks = [
//       { id: 1, text: '1', isSelected: true, icon: '' },
//       { id: 2, text: '2', isSelected: false, icon: '' },
//       { id: 3, text: '3', isSelected: false, icon: '' },
//       { id: 4, text: '4', isSelected: false, icon: '' },
//     ];
//     fixture.whenStable().then(() => {
//       jest.spyOn(component, 'onLinkSelected').mockImplementation(link => {
//         return mockLinks.map(l => {
//           return Object.assign({}, l, {
//             isSelected: l.id === link.id ? true : false,
//           });
//         });
//       });

//       expect(component.onLinkSelected(mockLinks[2])).toEqual(
//         expect.arrayContaining([
//           { id: 1, text: '1', isSelected: false, icon: '' },
//           { id: 3, text: '3', isSelected: true, icon: '' },
//         ]),
//       );
//     });
//   });
// });
