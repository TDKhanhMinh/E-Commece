export type AttributeType = "TEXT" | "SELECT" | "NUMBER";

export interface Attribute {
    id: number;
    name: string;
    code: string;
    type: AttributeType;
}

export interface AttributeRequest {
    name: string;
    code: string;
    type: AttributeType;
}
