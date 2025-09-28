export function evalue(value) {
  if (typeof value !== "string") return null;
  let result = value;
  if (value === "true") {
    result = true;
  }
  if (value === "false") {
    result = false;
  }
  if (!isNaN(value)) {
    result = Number(value);
  }
  return result;
}
