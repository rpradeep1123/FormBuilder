export interface FormControlModel {
    formId: string;
    formName: string;
    fornControls: Control
}

export interface Control {
    controlName: string;
    controlValue: string;
    controlId: string;
}