export interface FormControlModel {
    guid: string;
    formJson: string;
    formId: string;
    formName: string;
    formControls: Control[]
}

export interface Control {
    controlName: string;
    controlValue: string;
    controlId: string;
}

export interface FormSaveResponse {
    status: string;
    message: string;
    res: string;
}

export interface GetFormListResponse {
    guid: string;
    formJson: string;
    formId: string;
    formName: string;
}