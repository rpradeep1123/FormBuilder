import { Component, ViewChild, ElementRef, OnInit, EventEmitter } from '@angular/core';
import { config, defaultI18n, defaultOptions } from "./formbuilder/config";
import { FormBuilderCreateor } from "./formbuilder/form-builder";
import I18N from "./formbuilder/mi18n";
import { UtilityService } from './services/utility.service';
import { FormService } from './services/form.service';
import { saveAs } from 'file-saver';
var FileSaver = require('file-saver');

declare var jQuery;
declare var require: any

function initJq() {
  (function ($) {
    (<any>$.fn).formBuilder = function (options) {
      if (!options) {
        options = {};
      }
      let elems = this;
      let { i18n, ...opts } = $.extend({}, defaultOptions, options, true);
      (<any>config).opts = opts;
      let i18nOpts = $.extend({}, defaultI18n, i18n, true);
      let instance = {
        actions: {
          getData: null,
          setData: null,
          save: null,
          showData: null,
          setLang: null,
          addField: null,
          removeField: null,
          clearFields: null
        },
        get formData() {
          return instance.actions.getData('json');
        },

        promise: new Promise(function (resolve, reject) {
          new I18N().init(i18nOpts).then(() => {
            elems.each(i => {
              let formBuilder = new FormBuilderCreateor().getFormBuilder(opts, elems[i]);
              $(elems[i]).data('formBuilder', formBuilder);
              instance.actions = formBuilder.actions;
            });
            delete instance.promise;
            resolve(instance);
          }).catch(console.error);
        })

      };

      return instance;
    };
  })(jQuery);
}

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
  public options: Object;
  formBuilder: any;
  triggerRefresh = new EventEmitter();
  constructor(private utility: UtilityService, private formService: FormService, private elementRef: ElementRef) {
    this.options = utility.getOptions();
  }
  ngOnInit(): void {
    initJq();
    this.formBuilder = (<any>jQuery('.build-wrap')).formBuilder();
  }

  saveForm() {
    this.triggerRefresh.emit({
      form: this.form
    });
    if (this.formName != undefined && this.formName.trim() != '') {
      const dom: HTMLElement = this.elementRef.nativeElement;
      const elements = dom.querySelectorAll('.formio-component.formio-component-form.formio-component-label-hidden');
      var blob = new Blob([elements[0].innerHTML], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, this.formName + ".html");
      console.log(this.form);
    }
  }

  clearForm() {
    this.form = {
      components: []
    }
  }

}
