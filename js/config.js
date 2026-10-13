// Chapter settings.
window.ILSA_CONFIG = {
  chapterName: "The University of Massachusetts School of Law International Law Students Association",
  shortName: "UMass Law ILSA",
  school: "University of Massachusetts School of Law",

  // Where speaker requests go when no form endpoint is set (opens the member's email app).
  contactEmail: "ilsa.umasslaw@gmail.com",

  // Optional: a form backend URL that accepts JSON POSTs (e.g. a Formspree form
  // like "https://formspree.io/f/abcdwxyz"). When set, speaker requests are
  // submitted directly from the page instead of opening an email draft.
  formEndpoint: "",

  instagram: "https://www.instagram.com/ilsa.umasslaw/",

  // Crowdfunding (shown on donate.html). To update the progress bar, copy the
  // "Donated" and "Donors" numbers from the GiveCampus page into raised and donors,
  // and change updated to today's date.
  fundraiser: {
    url: "https://www.givecampus.com/s/jwhhjc",
    goal: 500,
    raised: 0,
    donors: 0,
    ends: "2026-10-26T23:59:00-04:00",
    updated: "2026-10-13"
  }
};
