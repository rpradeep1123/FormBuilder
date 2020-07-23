import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FormBuilder';
  @ViewChild('json') jsonElement?: ElementRef;
  public form: Object = { components: [] };  
}
