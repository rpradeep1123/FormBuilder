import { Component, ViewChild, ElementRef, OnInit, EventEmitter } from '@angular/core';
import { config, defaultI18n, defaultOptions } from "./formbuilder/config";
import { FormBuilderCreateor } from "./formbuilder/form-builder";
import I18N from "./formbuilder/mi18n";
import { UtilityService } from './services/utility.service';
import { FormService } from './services/form.service';
import { saveAs } from 'file-saver';
import { FormControlModel, Control, FormSaveResponse, GetFormListResponse } from './models/form-control.model';
var FileSaver = require('file-saver');

declare var $;
declare var require: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FormBuilder';
  formName: string;
  public form: Object = {
    components: []
  };
  public preForm: Object = {
    components: []
  };
  public options: Object;
  formBuilder: any;
  triggerRefresh = new EventEmitter();
  showLoader: boolean = false;
  saveResponse: FormSaveResponse = {
    message: '',
    res: '0',
    status: '0'
  };
  currentGuid: string;
  formList: GetFormListResponse[] = [];
  isEdit: boolean = false;
  constructor(private utility: UtilityService, private formService: FormService, private elementRef: ElementRef) {
    this.options = utility.getOptions();
  }
  ngOnInit(): void {
  }

  saveForm() {
    this.showLoader = true;
    if (this.formName != undefined && this.formName.trim() != '') {
      const dom: HTMLElement = this.elementRef.nativeElement;
      const elements = dom.querySelectorAll('.formio-component.formio-component-form.formio-component-label-hidden');
      let actualHtml = this.createHtml(elements[0].innerHTML);
      this.formService.saveForm(this.createRequest('NEW')).subscribe(res => {
        this.saveResponse = res.info;
        if (this.saveResponse.res == '0') {
          $('#saveModal').modal('hide');
          this.downloadFile(actualHtml);
          this.clearForm();
        }
      })
    }
  }
  refreshData() {
    this.triggerRefresh.emit({
      form: this.form
    });
  }

  clearForm() {
    this.form = {
      components: []
    }
  }

  downloadFile(htmlResponse) {
    var blob = new Blob([htmlResponse], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, this.formName + ".html");
    this.showLoader = false;
  }
  createHtml(formHtml) {
    let actualHtml = `<html><head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous"></head><body>`;
    actualHtml += formHtml;
    actualHtml += `<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script></body></html>`
    return actualHtml;
  }
  createRequest(guid: string): FormControlModel {
    let request: FormControlModel = {
      guid: guid,
      formJson: JSON.stringify(this.form),
      formId: this.formName,
      formName: this.formName,
      formControls: []
    };
    if (this.form["components"].length > 0) {
      this.form["components"].forEach(element => {
        if (element.type == 'columns') {
          element.columns.forEach(columndata => {
            columndata.components.forEach(columncomp => {
              request.formControls.push(this.addFormControl(columncomp));
            });
          });
        } else {
          request.formControls.push(this.addFormControl(element));
        }
      });
    }
    return request;
  }
  addFormControl(element) {
    let control: Control = {
      controlId: element.type,
      controlName: element.label,
      controlValue: ''
    }
    return control;
  }

  getFormList() {
    this.formService.getFormList().subscribe(res => {
      this.formList = JSON.parse(res.info.res);
    })
  }
  updateForm() {
    this.formService.updateForm(this.createRequest(this.currentGuid)).subscribe(res => {
      console.log(res);
    })
    this.formService.getFormList().subscribe(res => {
      this.formList = JSON.parse(res.data);
    })
  }

  editForm(guid, formName, formJson) {
    this.currentGuid = guid;
    this.formName = formName;
    this.form = JSON.parse(formJson);
    this.isEdit = true;
  }
  cloneForm(formJson) {
    this.form = JSON.parse(formJson);
  }
  previewForm(formJson) {
    this.preForm = JSON.parse(formJson);
  }

}
