// Dashboard content. Each section is a list of cards; add, remove, or edit
// entries here and the page updates automatically.
//
// Card fields:
//   title  - card heading (required)
//   org    - organization name, used for the organization filter
//   body   - one or two sentences describing the opportunity
//   steps  - optional list of concrete next steps
//   tags   - short labels shown on the card and matched by search
//   url    - link to the official page
//   when   - optional timing note (e.g. "Applications open each fall")
//
// Details such as fees, dates, and deadlines change from year to year. Always
// confirm on the organization's own site before relying on them.

window.ILSA_DATA = {
  // Executive board, shown on the home page and the About the Board page.
  // To change the board, edit these entries and swap the photo in img/.
  board: [
    {
      role: "President", name: "Grace Nguyen", year: "3L", hometown: "Yorba Linda, CA",
      quote: "The intersectionality of cultural interactions and diversity in international law's legal framework really interested me.",
      email: "gnguyen3@umassd.edu", photo: "img/board-grace.jpg"
    },
    {
      role: "Vice President", name: "Eva Lynn Anderson", year: "2L", hometown: "Rochester, NY",
      quote: "I want to work in public international law, and I want to help other students know that those doors are open to them.",
      email: "eanderson18@umassd.edu", photo: "img/board-eva.jpg"
    },
    {
      role: "Secretary", name: "Natasha Macarchuk", year: "2L", hometown: "Westchester, NY",
      quote: "I find international law interesting to learn about and discuss, and I value international perspectives.",
      email: "nmacarchuk@umassd.edu", photo: "img/board-natasha.jpg"
    },
    {
      role: "Treasurer", name: "Adam Grocholski", year: "3L", hometown: "Texas",
      quote: "I joined ILSA to engage in discussions about different cultures and viewpoints.",
      email: "agrocholski@umassd.edu", photo: "img/board-adam.jpg"
    },
    {
      role: "Public Relations", name: "Bethany Smith", year: "1L", hometown: "Putnam, CT",
      quote: "I am passionate about the role international law plays in building lasting peace between people groups and protecting women's rights throughout the globe.",
      email: "bsmith28@umassd.edu", photo: "img/board-bethany.jpg"
    }
  ],

  // General Body Meetings. Dates are YYYY-MM-DD; past ones are marked automatically.
  meetings: [
    { date: "2026-09-09", label: "Meet the board" },
    { date: "2026-10-14", label: "Mid-semester stop" },
    { date: "2026-11-18", label: "Final descent" }
  ],

  organizations: [
    {
      title: "ABA Section of International Law",
      org: "ABA",
      body: "The American Bar Association's home for international practice. Law students can join the ABA at no cost and then add the International Law Section to access its committees, newsletters, and programs.",
      steps: [
        "Create a free ABA law student membership.",
        "Add the Section of International Law to your membership.",
        "Join one or two committees that match your interests (e.g. human rights, trade, arbitration) to get their listservs and calls for volunteers.",
        "Watch for student-focused programs and ask about Section student liaison or ambassador roles."
      ],
      tags: ["membership", "committees", "networking"],
      url: "https://www.americanbar.org/groups/international_law/"
    },
    {
      title: "American Branch of the International Law Association (ABILA)",
      org: "ABILA",
      body: "The U.S. branch of the International Law Association. ABILA runs committees that study specific areas of international law and co-hosts International Law Weekend in New York each fall with ILSA.",
      steps: [
        "Sign up for a student membership on the ABILA site.",
        "Browse ABILA committees and email a chair about joining or assisting with research.",
        "Attend International Law Weekend; ILSA members often volunteer at the event."
      ],
      tags: ["membership", "committees", "research", "conference"],
      url: "https://www.ila-americanbranch.org/"
    },
    {
      title: "International Bar Association (IBA)",
      org: "IBA",
      body: "A global association of lawyers, bar associations, and law societies. Student membership gives access to IBA publications, committees, and discounted conference rates.",
      steps: [
        "Register as a student member on the IBA site.",
        "Follow the committees in your practice area of interest.",
        "Look into the IBA Annual Conference and any student or young lawyer sessions."
      ],
      tags: ["membership", "global", "conference"],
      url: "https://www.ibanet.org/"
    },
    {
      title: "American Society of International Law (ASIL)",
      org: "ASIL",
      body: "A leading U.S. society for international law scholars and practitioners. Student members can join Interest Groups, read ASIL Insights, and attend the Annual Meeting in Washington, D.C.",
      steps: [
        "Join ASIL as a student member.",
        "Sign up for one or more Interest Groups; many welcome student volunteers.",
        "Ask about volunteering at the Annual Meeting, which can offset registration."
      ],
      tags: ["membership", "research", "conference"],
      url: "https://www.asil.org/"
    },
    {
      title: "International Law Students Association (ILSA)",
      org: "ILSA",
      body: "Our parent organization. ILSA administers the Philip C. Jessup International Law Moot Court Competition, hosts conferences, and publishes the ILSA Journal of International & Comparative Law.",
      steps: [
        "Make sure you're on the chapter roster so you receive ILSA announcements.",
        "Try out for the Jessup team or volunteer as a practice judge.",
        "Look for ILSA conferences and regional events."
      ],
      tags: ["moot court", "conference", "membership"],
      url: "https://www.ilsa.org/"
    }
  ],

  volunteer: [
    {
      title: "Volunteer at International Law Weekend",
      org: "ABILA",
      body: "ABILA and ILSA's annual conference in New York relies on student volunteers to staff panels and registration, often in exchange for free attendance.",
      tags: ["conference", "networking"],
      url: "https://www.ila-americanbranch.org/",
      when: "Each fall, usually October"
    },
    {
      title: "Help with ASIL Annual Meeting",
      org: "ASIL",
      body: "Student volunteers help run sessions at the ASIL Annual Meeting and get to hear from leading practitioners, judges, and academics.",
      tags: ["conference", "networking"],
      url: "https://www.asil.org/",
      when: "Each spring"
    },
    {
      title: "ABA committee volunteer",
      org: "ABA",
      body: "ABA Section of International Law committees regularly need help with newsletters, year-in-review articles, and program planning. Committee leadership roles for students sometimes open each bar year.",
      tags: ["committees", "writing"],
      url: "https://www.americanbar.org/groups/international_law/"
    },
    {
      title: "Judge or bailiff for Jessup rounds",
      org: "ILSA",
      body: "Regional and international Jessup rounds need bailiffs and practice judges. It's a great way to learn the problem and meet competitors and alumni.",
      tags: ["moot court"],
      url: "https://www.ilsa.org/",
      when: "Regional rounds in early spring"
    },
    {
      title: "Pro bono immigration and asylum clinics",
      org: "Local",
      body: "Many legal aid organizations train law students to help with asylum declarations, country-conditions research, and intake. Check with your school's pro bono office for partners near you.",
      tags: ["pro bono", "human rights", "research"],
      url: "https://www.probono.net/"
    }
  ],

  careers: [
    {
      title: "United Nations internships",
      org: "UN",
      body: "The UN Secretariat, including the Office of Legal Affairs, offers unpaid internships for graduate and law students. Other UN agencies post their own programs.",
      tags: ["internship", "international organizations"],
      url: "https://careers.un.org/"
    },
    {
      title: "International Criminal Court internships & visiting professionals",
      org: "ICC",
      body: "The ICC offers internships in chambers, the Office of the Prosecutor, and the Registry, plus a visiting professional program.",
      tags: ["internship", "international criminal law"],
      url: "https://www.icc-cpi.int/jobs"
    },
    {
      title: "ICJ University Traineeship Programme",
      org: "ICJ",
      body: "Recent graduates nominated by their universities can work with judges of the International Court of Justice for about ten months.",
      tags: ["fellowship", "post-grad", "courts"],
      url: "https://www.icj-cij.org/"
    },
    {
      title: "U.S. Department of State, Office of the Legal Adviser",
      org: "U.S. Government",
      body: "The Legal Adviser's office hires law clerks during the academic year and summer and recruits attorneys after graduation.",
      tags: ["internship", "government"],
      url: "https://www.state.gov/bureaus-offices/secretary-of-state/office-of-the-legal-adviser/"
    },
    {
      title: "PSJD public interest job board",
      org: "NALP",
      body: "A searchable database of public interest internships and fellowships, including many international and human rights positions. Your school may provide a free login.",
      tags: ["internship", "fellowship", "job board"],
      url: "https://www.psjd.org/"
    },
    {
      title: "Human rights NGO fellowships",
      org: "NGOs",
      body: "Organizations such as Human Rights Watch, Amnesty International, and the ICRC offer post-graduate fellowships and student internships. Deadlines are often a year ahead.",
      tags: ["fellowship", "human rights", "post-grad"],
      url: "https://www.hrw.org/careers"
    },
    {
      title: "Fulbright U.S. Student Program",
      org: "Fulbright",
      body: "Funding for a year of research, study, or teaching abroad after graduation. Many law students propose international law research projects.",
      tags: ["fellowship", "research", "post-grad"],
      url: "https://us.fulbrightonline.org/"
    }
  ],

  writing: [
    {
      title: "ILSA Journal of International & Comparative Law",
      org: "ILSA",
      body: "ILSA's student-edited journal publishes articles on international and comparative law and accepts submissions from students.",
      tags: ["publishing", "journal"],
      url: "https://www.ilsa.org/"
    },
    {
      title: "Writing for ABA committee newsletters",
      org: "ABA",
      body: "Section of International Law committees publish newsletters and the annual Year in Review. Students can co-author short updates with practitioners, which is an easy first publication.",
      tags: ["publishing", "committees"],
      url: "https://www.americanbar.org/groups/international_law/"
    },
    {
      title: "Research assistant for an ABILA committee",
      org: "ABILA",
      body: "ABILA committees track developments in specific fields and produce reports. Chairs often welcome student research help.",
      tags: ["research", "committees"],
      url: "https://www.ila-americanbranch.org/"
    },
    {
      title: "ASIL Interest Group blogs and newsletters",
      org: "ASIL",
      body: "Many ASIL Interest Groups publish short pieces and take student contributions. A good place to pitch a case note or recent-development summary.",
      tags: ["publishing", "blog"],
      url: "https://www.asil.org/"
    },
    {
      title: "Student writing competitions",
      org: "Various",
      body: "Bar associations, sections, and journals run writing competitions with cash prizes and publication offers. Search the sites above for 'writing competition' each fall and spring.",
      tags: ["competition", "publishing"],
      url: "https://www.americanbar.org/groups/law_students/"
    },
    {
      title: "Faculty research assistantships",
      org: "Your school",
      body: "Professors who teach international, comparative, or human rights law often hire RAs. Ask in office hours or check the law school job board.",
      tags: ["research", "on campus"],
      url: ""
    }
  ],

  // A short checklist for new members. Progress is saved in the member's browser.
  checklist: [
    "Join ILSA as a general body member and get on the chapter email list",
    "Create a free ABA law student membership and add the International Law Section",
    "Join ABILA or ASIL as a student member",
    "Pick one committee or interest group and introduce yourself to the chair",
    "Volunteer at one conference or event this year",
    "Set up a PSJD account and save two internship or fellowship searches",
    "Draft a short case note or recent-development piece for a newsletter",
    "Meet with a chapter officer to talk about your goals"
  ]
};
