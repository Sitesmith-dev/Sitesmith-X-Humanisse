import { Cormorant_Garamond, EB_Garamond } from "next/font/google";

// Loaded only inside this concept's own files, so choosing the other direction never downloads these faces
export const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--font-vr-display" });
export const body = EB_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-vr-body" });
