// Plain constants with no client directive, so server components such as HowItWorks can import them too
export const SET_PRICE = 1499;
export const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;
