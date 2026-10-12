# ILSA Get Involved

A one-page member guide for the ILSA chapter. It shows members how to get involved with the ABA, ABILA, IBA, ASIL and ILSA. It covers volunteering, internships and fellowships, research and legal writing, and has a form for requesting speakers.

It's a plain static site (HTML, CSS and JavaScript) with no build step.

## Features

- **Search and filter** across every opportunity by keyword or organization
- **Start-here checklist** for new members; progress is saved in each member's browser
- **Organization guides** with step-by-step "How to get started" instructions
- **Volunteer, internship/fellowship, and research & writing** listings
- **Speaker request form** that goes to the board

## Editing content

| What | File |
| --- | --- |
| Chapter name, school, contact email, form endpoint, social links | `js/config.js` |
| Opportunities and checklist items | `js/data.js` |
| Section headings and intro text | `index.html` |
| Colors and layout | `css/styles.css` |

To add an opportunity, copy an existing entry in `js/data.js` and change its fields. New organizations show up in the filter automatically.

Fees, dates and program names change. Review `js/data.js` each semester.

## Speaker requests

There are two ways to handle speaker requests:

1. **Email (default).** Set `contactEmail` in `js/config.js`. When a member submits, their email app opens a draft with the request filled in.
2. **Form service (recommended).** Create a free form at a service that accepts JSON posts, such as [Formspree](https://formspree.io). Paste its URL into `formEndpoint`. Requests then submit straight from the page and land in the board's inbox. Members don't need an email app set up.

## Running locally

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

## Publishing with GitHub Pages

In the repository, go to **Settings → Pages**. Under "Build and deployment", choose **Deploy from a branch** and pick the branch and the `/ (root)` folder. The site will be live at `https://<username>.github.io/<repo>/`.
