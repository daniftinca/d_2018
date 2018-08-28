import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {BugData, BugListService, RelatedUser} from "../bugs.service";
import {MatDialog, MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';
import {BugsPopupComponent} from "../bugs-popup/bugs-popup.component";
import {AddBugComponent} from "../add-bug/add-bug.component";
import {HttpParams} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {UpdateBugComponent} from "../update-bug/update-bug.component";
import {ListBugsPipe} from "./list-bugs-pipe";

@Component({
  selector: 'app-list-bugs',
  templateUrl: './list-bugs.component.html',
  styleUrls: ['./list-bugs.component.css'],
  providers: [ListBugsPipe]
})


export class ListBugsComponent implements OnInit {

  selectedTitles: string;

  bugData: BugData;
  relatedUser: RelatedUser;
  bugList: MatTableDataSource<BugData[]>;


  listId: number[] = [];
  forExcel: number[] = [];
  sorted: Object[] = [];
  sortByTitle: Object = {argument: 'title', order:'asc'};
  sortByVersion: Object = {argument: 'version', order: 'asc'};


  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private bugService: BugListService,
              public dialog: MatDialog,
              private translate: TranslateService,
              private changeDetectorRefs: ChangeDetectorRef) {


    this.bugData = {
      id: null,
      title: '',
      description: '',
      version: '',
      targetDate: null,
      status: '',
      fixedVersion: '',
      severity: '',
      createdByUser: null,
      assignedTo: null
    };

    this.relatedUser = {
      id: 0,
      username: '',
    };


  }


  displayedColumns: string[] = [
    'number',
    'title',
    'version',
    'targetDate',
    'status',
    'fixedVersion',
    'severity',
    'createdBy',
    'assignedTo',
    'exportExcel'
  ];

  openDialog(bug: BugData): void {

    const dialogRef = this.dialog.open(BugsPopupComponent, {
      width: '250px',
      data: {description: bug.description}
    });

  }

  toggleSort(attribute: String, isChecked: boolean) : void {
    let sortObj = attribute=='title'? this.sortByTitle : this.sortByVersion;

    if(isChecked) {
      this.sorted.push(sortObj);
      this.sorted = this.sorted.slice(0);
    } else {
      this.sorted.splice(this.sorted.indexOf(sortObj), 1);
    }
    this.sortDataSource();

  }

  sortDataSource() {
    this.sorted.forEach(arg => {
      this.bugList = this.bugList.data.sort((bug1: BugData, bug2: BugData) => {
        if (bug1[arg.argument] > bug2[arg.argument]) {
          return arg.order == "asc" ? 1 : -1;
        } else if (bug1[arg.argument] < bug2[arg.argument]) {
          return arg.order == "asc" ? -1 : 1;
        }
        else return 0;
      });
    });
  }



  openUpdateDialog(bug): void {
    const dialogRef = this.dialog.open(UpdateBugComponent, {
      width: '60%',
      data: {
        description: bug.description,
        fixedVersion: bug.fixedVersion,
        version: bug.version,
        targetDate: bug.targetDate,
        status: bug.status,
        severity: bug.severity,
        assignedTo: bug.assignedTo,
        createdByUser: bug.createdByUser
      }
    })
  }

  ngOnInit() {

    this.bugService.getBugsFromServer().subscribe(
      {
        next: (value: any[]) => {
          this.bugList = new MatTableDataSource<BugData[]>(value);

          this.sortDataSource();

        }
      }
    );

  }


  filter(title: string, description: string, status: string, severity: string) {
    this.bugService.filter(title, description, status, severity).subscribe(
      {
        next: (value: any[]) => {
          this.bugList = new MatTableDataSource<BugData[]>(value);

          this.sortDataSource();
        }
      }
    );
  }

  // sort(title, version) {
  //   this.bugService.sort(title, version).subscribe(
  //     {
  //       next: (value: BugData[]) => {
  //         console.log('received: ' + JSON.stringify(value));
  //         this.bugList = value;
  //       }
  //     }
  //   );
  // }

  // sort(title, version) {
  //   this.bugList.sort(function (bug1: BugData, bug2: BugData) {
  //     if (bug1.title < bug2.title ) return -1;
  //     else if (bug1.title > bug2.title ) return 1;
  //     else return 0;
  //   });
  //
  //
  // }

  // sort(args) {
  //   this.bugList.sort(function (bug1: BugData, bug2: BugData) {
  //     if (bug1[args] < bug2[args]) return -1;
  //     else if (bug1[args] > bug2[args]) return 1;
  //     else return 0;
  //   });
  // }



  onChangeCheck(bug: BugData, checked: boolean) {
    if (checked) {
      this.forExcel.push(bug.id);
    } else {
      this.forExcel.splice(this.forExcel.indexOf(bug.id), 1);
    }
    //this.updateExcelLink()
  }

  updateExcelLink() {
    let httpParams = new HttpParams();
    this.forExcel.forEach(value => httpParams = httpParams.append("titles", value.toString()));
    this.selectedTitles = httpParams.toString();
  }

  downloadExcel() {
    this.bugService.excel(this.forExcel);
  }


  getDate(d) {

    const correctSec = d * 1000;
    var expiresAt = new Date(correctSec);

    return expiresAt
  }


  openAddBug() {
    const dialogRef2 = this.dialog.open(AddBugComponent, {
      width: '700px',
      data: {bugService: this.bugService}
    });
  }
}
