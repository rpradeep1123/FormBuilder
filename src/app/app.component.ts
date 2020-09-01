import { Component, ViewChild, ElementRef, OnInit, EventEmitter } from '@angular/core';
import { config, defaultI18n, defaultOptions } from "./formbuilder/config";
import { FormBuilderCreateor } from "./formbuilder/form-builder";
import I18N from "./formbuilder/mi18n";
import { UtilityService } from './services/utility.service';
import { FormService } from './services/form.service';
import { saveAs } from 'file-saver';
import { Formio } from 'formiojs';
import AccordionComponent from './components/accordian/accordian';
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
  saveText = 'Save';
  constructor(private utility: UtilityService, private formService: FormService, private elementRef: ElementRef) {
    this.options = utility.getOptions();
    Formio.registerComponent('accordion', AccordionComponent);
    //Components.setComponent('accordion', AccordionComponent);
  }
  ngOnInit(): void {
  }

  saveForm() {
    this.showLoader = true;
    if (this.formName != undefined && this.formName.trim() != '') {
      let saveType = this.saveText == 'Save' ? 'NEW' : this.currentGuid;
      const dom: HTMLElement = this.elementRef.nativeElement;
      const elements = dom.querySelectorAll('#preview-pane .formio-form');
      let actualHtml = this.createHtml(elements[0].innerHTML);
      if (saveType == 'NEW')
        this.formService.saveForm(this.createRequest(saveType)).subscribe(res => {
          this.saveResponse = res.info;
          if (this.saveResponse.res == '0') {
            $('#saveModal').modal('hide');
            this.downloadFile(actualHtml);
            this.clearForm();
          } else {
            this.showLoader = false;
          }
        });
      else
        this.formService.updateForm(this.createRequest(saveType)).subscribe(res => {
          this.saveText = "Save";
          this.isEdit = false;
          this.saveResponse = res.info;
          if (this.saveResponse.res == '0') {
            $('#saveModal').modal('hide');
            this.downloadFile(actualHtml);
            this.clearForm();
          } else {
            this.showLoader = false;
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
    let actualHtml = `<html><head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css"/>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://unpkg.com/formiojs@latest/dist/formio.full.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://unpkg.com/formiojs@latest/dist/formio.full.min.js"></script>
    </head><body class="container-fluid">`;
    actualHtml += formHtml;
    actualHtml += `
    <script>
	$(document).ready(function(){
		$(".formio-component-accordion .card .card-header").click((e)=>{
		$(".formio-component-accordion .card .card-header").removeClass('active');
		$(e.currentTarget).addClass('active');
		$(".formio-component-accordion .card .card-body").css('display','none');
			$($(e.currentTarget.parentElement).find('.card-body')[0]).css('display','block');
		})
	})
  </script>  
  <script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>    
    </body></html>`
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

  editForm(guid, formName, formJson) {
    this.currentGuid = guid;
    this.formName = formName;
    this.form = JSON.parse(formJson);
    this.isEdit = true;
    this.saveText = 'Update';
  }
  cloneForm(formJson) {
    this.form = JSON.parse(formJson);
  }
  previewForm(formJson) {
    this.preForm = JSON.parse(formJson);
  }

}
