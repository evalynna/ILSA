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

    var footer = document.getElementById("footer-links");
    [["Instagram", config.instagram], ["LinkedIn", config.linkedin], ["Newsletter", config.newsletter]]
      .filter(function (pair) { return pair[1]; })
      .forEach(function (pair, i) {
        if (i) footer.appendChild(document.createTextNode(" · "));
        footer.appendChild(el("a", { href: pair[1], target: "_blank", rel: "noopener", text: pair[0] }));
      });
    if (config.contactEmail) {
      if (footer.childNodes.length) footer.appendChild(document.createTextNode(" · "));
      footer.appendChild(el("a", { href: "mailto:" + config.contactEmail, text: config.contactEmail }));
    }
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
        text: "Visit site ↗"
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
  renderFilters();
  renderSections();
  renderChecklist();
  setupSpeakerForm();
})();
