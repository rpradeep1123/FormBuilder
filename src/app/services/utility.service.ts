import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  editFormOptions: Object = {};

  editControlsEnableTabs: string[] = ['display'];
  editControlsHiddenTabs: string[] = ['api', 'conditional', 'logic', 'layout', 'data', 'validation'];
  editControlsHiddenItems: string[] = ['description', 'tooltip', 'customClass', 'tabindex', 'inline', 'hidden',
    'hideLabel', 'autofocus', 'disabled', 'tableView', 'modalEdit', 'prefix', 'suffix', 'widget.type', 'inputMask',
    'allowMultipleMasks', 'showWordCount', 'showCharCount', 'spellcheck', 'mask','className','attrs','content','refreshOnChange',
    'editor','autoExpand','labelWidth','labelMargin','shortcut','inputType','widget','uniqueOptions'];

  constructor() { }

  getOptions(): Object {
    return this.editFormOptions = {
      builder: {
        basic: false,
        advanced: false,
        data: false,
        premium: false,
        layout: false,
        customBasic: {
          title: 'Basic Components',
          default: true,
          weight: 0,
          components: {
            textfield: true,
            textarea: true,
            radio: true,
            checkbox: true,
            select: true,
            phoneNumber: true,
            columns: true,
            htmlelement: true
          }
        }
      },
      editForm: {
        textfield: [...this.disableTabs(), ...this.enableTabs()],
        htmlelement: [...this.disableTabs(), ...this.enableTabs()],
        columns: [...this.disableTabs(), ...this.enableTabs()],
        textarea: [...this.disableTabs(), ...this.enableTabs()],
        phoneNumber: [...this.disableTabs(), ...this.enableTabs()],
        radio: [...this.disableTabs(), ...this.enableTabs()],
        checkbox: [...this.disableTabs(), ...this.enableTabs()],
        select: [...this.disableTabs(), ...this.enableTabs()]
      }
    }
  }

  disableTabs() {
    let disabledTabs = [];
    for (let i = 0; i < this.editControlsHiddenTabs.length; i++) {
      disabledTabs.push(
        this.disable(this.editControlsHiddenTabs[i])
      );
    }
    return disabledTabs;
  }

  enableTabs() {
    let enableTabs = [];
    for (let i = 0; i < this.editControlsEnableTabs.length; i++) {
      let obj = this.enable(this.editControlsEnableTabs[i]);
      for (let j = 0; j < this.editControlsHiddenItems.length; j++) {
        obj.components.push(this.disable(this.editControlsHiddenItems[j]));
      }
      enableTabs.push(obj);
    }
    return enableTabs;
  }

  disable(key: string) {
    return {
      key: key,
      ignore: true,
      components: []
    }
  }
  enable(key: string) {
    return {
      key: key,
      ignore: false,
      components: []
    }
  }
}
