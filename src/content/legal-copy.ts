// PREVIEW ONLY: placeholder legal text awaiting client approval. Replace with final wording from Humanisse.
export type LegalDoc = { title: string; updated: string; body: string[] };
export type LegalDocKey = "terms" | "legal";

export const legalCopy: Record<LegalDocKey, LegalDoc> = {
  terms: {
    title: "Terms and Conditions",
    updated: "Sample text, last reviewed September 2026",
    body: [
      "These terms describe how the Humanisse website and its comics, videos and reading tools may be used. By creating an account, buying a comic or reading one in your library you agree to them, so please read them before you continue.",
      "An account is needed to buy and to read. You are responsible for keeping your login details private and for anything that happens under your account, and you should tell us straight away if you think someone else has used it. Readers under eighteen should have a parent or guardian set up the account for them.",
      "Prices are shown in Indian rupees and include any taxes that apply at the time of purchase. A purchase gives you a personal, non-transferable licence to read that comic on the Humanisse website for as long as the service is available, it does not transfer ownership of the artwork or the story.",
      "Comics you buy are kept in My Library, where you can continue reading, reread a story or find related titles. Reading progress is saved to your account so you can move between devices. We may add, update or occasionally retire titles, and we will give reasonable notice before removing anything you have paid for.",
      "The comics, characters, videos and text on this site are protected by copyright. You may read them for your own learning, share a link to a comic page, or show a story in a classroom or training room you are part of. You may not copy, download, screenshot for redistribution, sell or adapt the material without written permission.",
      "We may update these terms when the service changes. When we do, the date at the top of this page will change and, for anything significant, we will let account holders know by email before the new terms take effect. Continuing to use the site after that date means you accept the updated terms.",
      "If a comic does not open or a purchase does not appear in your library, contact us and we will put it right. These terms are governed by the laws of India, and any dispute will be handled by the courts of the city in which Humanisse is registered.",
    ],
  },
  legal: {
    title: "Legal and Privacy",
    updated: "Sample text, last reviewed September 2026",
    body: [
      "This page explains what Humanisse collects when you use the site, why it is collected and the choices you have. It is written for readers, parents and teachers rather than lawyers, so it stays in plain language.",
      "When you create an account we collect your name, email address and a password that is stored in an encrypted form. When you buy a comic our payment partner processes your card or UPI details, and we receive only a confirmation of the purchase, never the card number itself.",
      "We use this information to run your account, deliver the comics you have bought, answer your questions and send purchase receipts. If you opt in, we may also send occasional news about new titles. Every such email has an unsubscribe link and we do not sell or rent your details to anyone.",
      "Reading progress, such as the page you reached in a comic and whether you finished it, is saved to your account so that My Library can show you where to continue. This data is used only to provide that feature and to understand, in aggregate, which stories are read most.",
      "The site uses a small number of cookies and similar storage. Essential ones keep you logged in and remember your cart. Optional analytics cookies help us see which pages are useful, and they are only set once you agree to them. You can change your choice at any time from the cookie settings link in the footer.",
      "You can ask to see the information we hold about you, correct it, download it or have your account deleted. Requests are handled within thirty days. If you are under eighteen, a parent or guardian may make these requests on your behalf.",
      "All comics, characters, illustrations, videos and written material on this site are the copyright of Humanisse or its licensed contributors. The Professor, the Bot and the Cat are original characters and may not be reproduced without permission. If you believe something on the site infringes your rights, please contact us with the details and we will respond promptly.",
    ],
  },
};
