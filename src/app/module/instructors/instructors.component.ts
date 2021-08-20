import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { InstructorService } from './instructor.service';
import { iInstructor } from '../../model/instructor';
import { AddInstructorComponent } from './add-instructor/add-instructor.component';

@Component({
  selector: 'app-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.scss']
})
export class InstructorsComponent implements OnInit, AfterViewInit {
  isLoadingResults = true;
  readonly columns: string[] = ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'edit'];
  readonly displayedColumns = ['id', 'Imię', 'Nazwisko', 'Email', 'Tel.', ''];
  dataSource = new MatTableDataSource<iInstructor>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  private dialogConfig: MatDialogConfig = new MatDialogConfig();
  private matSnackBarConfig: MatSnackBarConfig = new MatSnackBarConfig();

  constructor(private instructorService: InstructorService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,) {
  }

  ngOnInit(): void {
    this.dialogConfig.width = '800px';
    this.matSnackBarConfig.duration = 5000;
  }

  applyFilter(filterValue: any): void {
    let value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit(): void {
    this.instructorService.getAllInstructors().subscribe((data: iInstructor[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoadingResults = false;
      },
      () => {
        this.isLoadingResults = false;
      }
    );
  }

  onClick(row: iInstructor): void {
    console.log(row);
  }

  openAddInstructorDialog(): void {
    const dialogRef = this.dialog.open(AddInstructorComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe((instructor: iInstructor) => {
      if (instructor) {
        this.saveInstructor(instructor);
        this.instructorService.createInstructor(instructor).subscribe((result: iInstructor) => {
          if (result) {
            this.dataSource.data.push(result);
            this.dataSource.data = this.dataSource.data;
          }
        });
      }
    });
  }

  updateInstructor(instructor: iInstructor) {
  }

  deleteInstructor(id: number) {
  }

  private saveInstructor(instructor: iInstructor): void {
    this.instructorService.createInstructor(instructor).subscribe((result: iInstructor) => {
        this.snackBar.open('Dodano do bazy', 'OK', this.matSnackBarConfig);
        this.dataSource.data.push(result);
        this.dataSource.data = this.dataSource.data;
      },
      () => {
        this.isLoadingResults = false;
      }
    );
  }
}
