export interface FormControlModel {
    formId: string;
    formName: string;
    formControls: Control[]
}

export interface Control {
    controlName: string;
    controlValue: string;
    controlId: string;
}

export interface FormSaveResponse{
    status:string;
    message:string;
    res:string;
}