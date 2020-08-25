import TabsComponent from 'formiojs/components/tabs/Tabs';
import * as editForm from './Accordion.form';

export default class AccordionComponent extends TabsComponent {

  /**
   * Define what the default JSON schema for this component is. We will derive from the BaseComponent
   * schema and provide our overrides to that.
   * @return {*}
   */
  static schema() {
    return TabsComponent.schema({
      type: 'accordion',
      label: 'Sections',
      input: false,
      key: 'accordion',
      persistent: false,
      components: [{
        label: 'Section 1',
        key: 'section1',
        type: 'tab',
        components: []
      }]
    });
  }

  /**
   * Register this component to the Form Builder by providing the "builderInfo" object.
   */
  static get builderInfo() {
    return {
      title: 'Accordion',
      group: 'custom',
      icon: 'fa fa-tasks',
      weight: 70,
      schema: AccordionComponent.schema()
    };
  }

  /**
   * Tell the builder how to build this component using DOM manipulation.
   */
  createElement() {
    this.tabs = [];
    this.tabLinks = [];
    this.bodies = [];

    this.accordion = this.ce('div', {
      id: `accordion-${this.id}`
    });

    var _this = this;

    this.component.components.forEach(function (tab, index) {

      var isFirst = index === 0;

      var tabLink = _this.ce('a', {
        class: 'card-link',
        data_toggle: 'collapse',
        href: `#collapse-${tab.key}`
      }, tab.label);

      _this.addEventListener(tabLink, 'click', function (event) {
        event.preventDefault();
        _this.setTab(index);
      });

      var header = _this.ce('div', {
        class: 'card-header'
      }, [tabLink]);

      var tabPanel = _this.ce('div', {
        class: 'tab-pane',
        role: 'tabpanel',
        tabLink: tabLink
      });

      var tabContent = _this.ce('div', {
        class: 'tab-content'
      }, [tabPanel]);

      var body = _this.ce('div', {
        class: 'card-body',
        id: tab.key
      }, [tabContent]);

      var content = _this.ce('div', {
        id: `collapse-${tab.key}`,
        class: 'collapse'.concat(isFirst ? ' show' : ''),
        data_parent: `#accordion-${_this.id}`
      }, [body]);

      var card = _this.ce('div', {
        class: 'card'
      }, [header, body]);

      _this.tabLinks.push(header); 
      _this.tabs.push(tabPanel);
      _this.bodies.push(body);
      _this.accordion.appendChild(card);
    });

    if (this.element) {
      this.appendChild(this.element, [this.accordion]);
      this.element.className = this.className;
      return this.element;
    }

    this.element = this.ce('div', {
      id: this.id,
      class: this.className
    }, [this.accordion]);
    this.element.component = this;
    return this.element;
  }
  
  setTab(index, state) {
    super.setTab(index, state);
    var _this = this;

    if (this.bodies) {
      this.bodies.forEach(function (body) {
        body.style.display = 'none';
      });
      _this.bodies[index].style.display = 'block';
    }
  }
}

AccordionComponent.editForm = editForm.default;
 