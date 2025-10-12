const formatRM = (n?: number) =>
 typeof n === "number" ? `${n.toLocaleString("en-MY")} RM` : "—";

export default formatRM