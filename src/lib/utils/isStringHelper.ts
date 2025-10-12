function isStringValue(v: string | React.ReactNode | undefined): v is string {
 return typeof v === "string" || typeof v === "undefined";
}

export default isStringValue  