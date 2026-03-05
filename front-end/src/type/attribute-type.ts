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
export interface AttributeSearchParams {
    page?: number;
    size?: number;
    keyword?: string;
    code?: string;
}
export interface Attribute {
    id: number;
    name: string;
    code: string;
    type: "TEXT" | "SELECT" | "NUMBER";
}
