(function () {
  "use strict";

  var config = window.ILSA_CONFIG || {};
  var data = window.ILSA_DATA || {};
  var SECTIONS = ["organizations", "volunteer", "careers", "writing"];
  var CHECKLIST_KEY = "ilsa-checklist-v1";

  var state = { query: "", org: "All" };

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      if (key === "text") node.textContent = attrs[key];
      else node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (child) { if (child) node.appendChild(child); });
    return node;
  }

  function storageGet(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }

  function storageSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }

  // Config-driven text and links
  function applyConfig() {
    document.querySelectorAll("[data-config]").forEach(function (node) {
      var value = config[node.getAttribute("data-config")];
      if (value) node.textContent = value;
    });

  }

  // Cards
  function cardMatches(item) {
    if (state.org !== "All" && item.org !== state.org) return false;
    if (!state.query) return true;
    var haystack = [item.title, item.org, item.body, item.when]
      .concat(item.tags || [], item.steps || [])
      .join(" ")
      .toLowerCase();
    return state.query.split(/\s+/).every(function (word) { return haystack.indexOf(word) !== -1; });
  }

  function renderCard(item) {
    var card = el("article", { class: "card" }, [
      item.org ? el("p", { class: "card-org", text: item.org }) : null,
      el("h3", { text: item.title }),
      el("p", { text: item.body }),
      item.when ? el("p", { class: "card-when", text: item.when }) : null
    ]);

    if (item.steps && item.steps.length) {
      var list = el("ol", {}, item.steps.map(function (step) { return el("li", { text: step }); }));
      card.appendChild(el("details", {}, [el("summary", { text: "How to get started" }), list]));
    }

    if (item.tags && item.tags.length) {
      card.appendChild(el("div", { class: "tags" }, item.tags.map(function (tag) {
        return el("span", { class: "tag", text: tag });
      })));
    }

    if (item.url) {
      card.appendChild(el("a", {
        class: "card-link", href: item.url, target: "_blank", rel: "noopener",
        text: "Visit site"
      }));
    }
    return card;
  }

  function renderSections() {
    var total = 0;
    SECTIONS.forEach(function (name) {
      var grid = document.querySelector('[data-section="' + name + '"]');
      var items = (data[name] || []).filter(cardMatches);
      total += items.length;
      grid.replaceChildren.apply(grid, items.map(renderCard));
      grid.closest(".section").classList.toggle("is-empty", items.length === 0);
    });

    var filtering = state.query || state.org !== "All";
    document.getElementById("result-count").textContent = filtering
      ? total + (total === 1 ? " opportunity" : " opportunities") + " match"
      : "";
  }

  function renderFilters() {
    var orgs = ["All"];
    SECTIONS.forEach(function (name) {
      (data[name] || []).forEach(function (item) {
        if (item.org && orgs.indexOf(item.org) === -1) orgs.push(item.org);
      });
    });

    var container = document.getElementById("org-filters");
    orgs.forEach(function (org) {
      var chip = el("button", { type: "button", class: "chip", "aria-pressed": String(org === state.org), text: org });
      chip.addEventListener("click", function () {
        state.org = org;
        container.querySelectorAll(".chip").forEach(function (c) {
          c.setAttribute("aria-pressed", String(c === chip));
        });
        renderSections();
      });
      container.appendChild(chip);
    });

    document.getElementById("search-input").addEventListener("input", function (e) {
      state.query = e.target.value.trim().toLowerCase();
      renderSections();
    });
  }

  // Checklist
  function renderChecklist() {
    var items = data.checklist || [];
    var done = storageGet(CHECKLIST_KEY) || {};
    var list = document.getElementById("checklist");

    function updateProgress() {
      var count = items.filter(function (_, i) { return done[i]; }).length;
      var pct = items.length ? Math.round((count / items.length) * 100) : 0;
      document.getElementById("progress-bar").style.width = pct + "%";
      document.getElementById("progress-label").textContent = count + " of " + items.length + " done";
    }

    items.forEach(function (text, i) {
      var box = el("input", { type: "checkbox" });
      box.checked = !!done[i];
      box.addEventListener("change", function () {
        done[i] = box.checked;
        storageSet(CHECKLIST_KEY, done);
        updateProgress();
      });
      list.appendChild(el("li", {}, [el("label", {}, [box, el("span", { text: text })])]));
    });
    updateProgress();
  }

  // Board
  function slug(text) { return text.toLowerCase().replace(/[^a-z]+/g, "-"); }

  function boardCard(person, full, i) {
    var num = String(i + 1).padStart(2, "0");
    var photo = el("img", { src: person.photo, alt: "Photo of " + person.name, loading: "lazy", width: "600", height: "600" });
    if (!full) {
      return el("a", { class: "crew-card", href: "board.html#" + slug(person.name) }, [
        photo,
        el("span", { class: "label", text: num + " " + person.role }),
        el("span", { class: "crew-name", text: person.name })
      ]);
    }
    return el("article", { class: "member", id: slug(person.name) }, [
      el("span", { class: "member-num", "aria-hidden": "true", text: num }),
      el("div", { class: "member-photo" }, [photo]),
      el("div", { class: "member-body" }, [
        el("p", { class: "label", text: person.role }),
        el("h2", { text: person.name }),
        el("p", { class: "member-meta", text: person.year + " / " + person.hometown }),
        el("blockquote", { text: "\u201c" + person.quote + "\u201d" }),
        el("a", { class: "member-email", href: "mailto:" + person.email, text: person.email })
      ])
    ]);
  }

  function renderBoard() {
    var people = data.board || [];
    var strip = document.getElementById("board-strip");
    var list = document.getElementById("board-list");
    if (strip) people.forEach(function (p, i) { strip.appendChild(boardCard(p, false, i)); });
    if (list) people.forEach(function (p, i) { list.appendChild(boardCard(p, true, i)); });
    if (list && location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }

  // Meetings, drawn as boarding passes
  function renderMeetings() {
    var list = document.getElementById("meeting-list");
    if (!list) return;
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var next = null;
    (data.meetings || []).forEach(function (m, i) {
      var parts = m.date.split("-");
      var day = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      var past = day < today;
      var isNext = !past && !next;
      if (isNext) next = day;
      list.appendChild(el("li", { class: "ticket" + (past ? " is-past" : "") + (isNext ? " is-next" : "") }, [
        el("div", { class: "ticket-stub" }, [
          el("span", { class: "label", text: day.toLocaleDateString("en-US", { month: "short" }) + " / " + day.toLocaleDateString("en-US", { weekday: "short" }) }),
          el("span", { class: "ticket-day", text: String(day.getDate()).padStart(2, "0") })
        ]),
        el("div", { class: "ticket-main" }, [
          el("span", { class: "label", text: "Stop " + (i + 1) + " of " + data.meetings.length }),
          el("span", { class: "ticket-title", text: m.label }),
          el("span", { class: "ticket-meta", text: "12 PM  \u00b7  Room 117" })
        ]),
        el("span", { class: "ticket-stamp", text: past ? "Landed" : isNext ? "Next up" : "Upcoming" })
      ]));
    });
    var note = document.getElementById("departure");
    if (!note) return;
    if (next) {
      var days = Math.round((next - today) / 86400000);
      var when = days === 0 ? "today" : days === 1 ? "tomorrow" : "in " + days + " days";
      note.textContent = "Next meeting " + when + "  /  " +
        next.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) + "  /  12 PM  /  Room 117";
    } else {
      note.textContent = "That's a wrap for this semester  /  Follow @ilsa.umasslaw for what's next";
    }
  }

  // Calendar reminders (.ics download and Google Calendar link)
  function compact(dateStr) { return dateStr.replace(/-/g, ""); }

  function nextDay(dateStr) {
    var p = dateStr.split("-");
    var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + 1));
    return d.toISOString().slice(0, 10);
  }

  function endTime(item) {
    var p = item.time.split(":");
    var total = +p[0] * 60 + +p[1] + (item.minutes || 60);
    return String(Math.floor(total / 60)).padStart(2, "0") + String(total % 60).padStart(2, "0") + "00";
  }

  function calTitle(item) { return (item.approx ? "Check: " : "") + item.title; }

  function calDetails(item) {
    return [item.note, item.url, "From the UMass Law ILSA member guide."].filter(Boolean).join("\n\n");
  }

  function icsEscape(text) {
    return String(text).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
  }

  function icsFor(item) {
    var start = compact(item.start);
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//UMass Law ILSA//Member Guide//EN", "BEGIN:VEVENT",
      "UID:" + item.id + "@umasslaw-ilsa",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z"];
    if (item.time) {
      lines.push("DTSTART;TZID=America/New_York:" + start + "T" + item.time.replace(":", "") + "00");
      lines.push("DTEND;TZID=America/New_York:" + start + "T" + endTime(item));
    } else {
      lines.push("DTSTART;VALUE=DATE:" + start);
      lines.push("DTEND;VALUE=DATE:" + compact(nextDay(item.end || item.start)));
    }
    lines.push("SUMMARY:" + icsEscape(calTitle(item)));
    lines.push("DESCRIPTION:" + icsEscape(calDetails(item)));
    if (item.location) lines.push("LOCATION:" + icsEscape(item.location));
    lines.push("BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + icsEscape(calTitle(item)), "TRIGGER:-P7D", "END:VALARM");
    lines.push("BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + icsEscape(calTitle(item)), "TRIGGER:-P1D", "END:VALARM");
    lines.push("END:VEVENT", "END:VCALENDAR");
    return lines.join("\r\n");
  }

  function googleUrl(item) {
    var start = compact(item.start);
    var dates = item.time
      ? start + "T" + item.time.replace(":", "") + "00/" + start + "T" + endTime(item)
      : start + "/" + compact(nextDay(item.end || item.start));
    return "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(calTitle(item)) +
      "&dates=" + dates +
      (item.time ? "&ctz=America/New_York" : "") +
      "&details=" + encodeURIComponent(calDetails(item)) +
      (item.location ? "&location=" + encodeURIComponent(item.location) : "");
  }

  function remindButtons(item) {
    var ics = el("a", {
      class: "remind-btn", download: item.id + ".ics",
      href: "data:text/calendar;charset=utf-8," + encodeURIComponent(icsFor(item)),
      text: "Remind me"
    });
    ics.setAttribute("aria-label", "Remind me: download a calendar file for " + item.title);
    var google = el("a", { class: "remind-alt", href: googleUrl(item), target: "_blank", rel: "noopener", text: "Google Calendar" });
    google.setAttribute("aria-label", "Add " + item.title + " to Google Calendar");
    return [ics, google];
  }

  function parseDay(dateStr) {
    var p = dateStr.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function renderDates() {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var items = (data.dates || []).filter(function (item) {
      return parseDay(item.end || item.start) >= today;
    }).sort(function (x, y) { return x.start < y.start ? -1 : 1; });

    document.querySelectorAll("[data-remind]").forEach(function (slot) {
      var match = (data.dates || []).filter(function (item) { return item.id === slot.getAttribute("data-remind"); })[0];
      if (match && parseDay(match.end || match.start) >= today) remindButtons(match).forEach(function (b) { slot.appendChild(b); });
    });

    var list = document.getElementById("dates-list");
    if (!list) return;
    if (!items.length) { list.closest(".section").classList.add("is-empty"); return; }

    items.forEach(function (item) {
      var start = parseDay(item.start);
      var days = Math.round((start - today) / 86400000);
      var month = start.toLocaleDateString("en-US", { month: "short" });
      var dayText = String(start.getDate()).padStart(2, "0");
      if (item.end && !item.approx) dayText += "\u2013" + String(parseDay(item.end).getDate()).padStart(2, "0");
      var countdown = item.approx ? item.label
        : days <= 0 ? "Happening now" : days === 1 ? "Tomorrow" : "In " + days + " days";
      var soon = !item.approx && days <= 14;

      var title = item.url
        ? el("a", { href: item.url, target: "_blank", rel: "noopener", text: item.title })
        : document.createTextNode(item.title);

      list.appendChild(el("li", { class: "date-row" + (soon ? " is-soon" : "") }, [
        el("div", { class: "date-when" }, item.approx
          ? [el("span", { class: "label", text: "Date" }), el("span", { class: "date-day", text: "TBA" })]
          : [el("span", { class: "label", text: month + " " + start.getFullYear() }), el("span", { class: "date-day", text: dayText })]),
        el("div", { class: "date-what" }, [
          el("span", { class: "label", text: item.kind + " / " + item.org }),
          el("h3", {}, [title]),
          item.note ? el("p", { text: item.note }) : null
        ]),
        el("span", { class: "date-count", text: countdown }),
        el("div", { class: "date-actions" }, remindButtons(item))
      ]));
    });
  }

  // Speaker request form
  function setupSpeakerForm() {
    var form = document.getElementById("speaker-form");
    var status = document.getElementById("form-status");
    var button = form.querySelector("button[type=submit]");

    function setStatus(message, kind) {
      status.textContent = message;
      status.className = "form-status" + (kind ? " " + kind : "");
    }

    function validate() {
      var firstInvalid = null;
      form.querySelectorAll("[required], [type=email]").forEach(function (input) {
        var ok = input.checkValidity() && (!input.required || input.value.trim() !== "");
        input.setAttribute("aria-invalid", String(!ok));
        if (!ok && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    }

    function collect() {
      var values = {};
      new FormData(form).forEach(function (value, key) { values[key] = String(value).trim(); });
      return values;
    }

    function emailBody(values) {
      var labels = {
        name: "Requested by", email: "Email", topic: "Topic", speaker: "Suggested speaker",
        affiliation: "Speaker's organization", format: "Format", eventType: "Event type",
        dates: "Preferred dates", audience: "Expected audience", notes: "Notes"
      };
      return Object.keys(labels)
        .filter(function (key) { return values[key]; })
        .map(function (key) { return labels[key] + ": " + values[key]; })
        .join("\n");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        setStatus("Please fill in the required fields.", "err");
        return;
      }

      var values = collect();

      if (!config.formEndpoint) {
        var subject = "Speaker request: " + values.topic;
        window.location.href = "mailto:" + encodeURIComponent(config.contactEmail || "") +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(emailBody(values));
        setStatus("Your email app should open with the request filled in. Press send to finish.", "ok");
        return;
      }

      button.disabled = true;
      setStatus("Sending…");
      fetch(config.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(Object.assign({ _subject: "Speaker request: " + values.topic }, values))
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          form.reset();
          setStatus("Thanks! The board received your request and will follow up by email.", "ok");
        })
        .catch(function () {
          setStatus("Something went wrong. Please try again or email " + (config.contactEmail || "the board") + ".", "err");
        })
        .finally(function () { button.disabled = false; });
    });

    form.addEventListener("input", function (e) {
      if (e.target.getAttribute("aria-invalid") === "true") e.target.removeAttribute("aria-invalid");
    });
  }

  applyConfig();
  renderBoard();
  renderMeetings();
  renderDates();
  if (document.getElementById("search-input")) {
    renderFilters();
    renderSections();
    renderChecklist();
    setupSpeakerForm();
  }
})();
