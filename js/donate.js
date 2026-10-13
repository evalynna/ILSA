(function () {
  "use strict";

  var fund = (window.ILSA_CONFIG || {}).fundraiser || {};
  var goal = Number(fund.goal) || 500;
  var raised = Math.max(0, Number(fund.raised) || 0);
  var donors = Math.max(0, Number(fund.donors) || 0);
  var url = fund.url || "https://www.givecampus.com/s/jwhhjc";
  var pct = Math.min(100, Math.round((raised / goal) * 100));
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
  function $(id) { return document.getElementById(id); }

  document.querySelectorAll(".js-goal").forEach(function (n) { n.textContent = money(goal); });
  document.querySelectorAll(".js-give").forEach(function (a) { a.href = url; });

  $("donors").textContent = donors;
  $("pct").textContent = Math.round((raised / goal) * 100) + "%";

  var meter = $("meter");
  meter.setAttribute("aria-valuemax", goal);
  meter.setAttribute("aria-valuenow", raised);
  meter.setAttribute("aria-valuetext", money(raised) + " of " + money(goal));

  // Countdown to the campaign close
  var ends = fund.ends ? new Date(fund.ends) : null;
  var closed = false;
  if (ends && !isNaN(ends)) {
    var ms = ends - new Date();
    if (ms <= 0) { closed = true; $("days").textContent = "Closed"; }
    else {
      var days = Math.floor(ms / 86400000);
      var hours = Math.floor(ms / 3600000);
      $("days").textContent = days >= 1 ? days + (days === 1 ? " day" : " days") : hours >= 1 ? hours + " hrs" : "Final hour";
    }
  }

  // Cheerful status note
  var left = Math.max(0, goal - raised);
  var note;
  if (raised >= goal) note = "We landed! Thank you to every single donor. Gifts still help us do even more.";
  else if (closed) note = "This campaign has closed. Thank you to everyone who gave and shared!";
  else if (raised === 0) note = "The runway is clear. Be our very first donor and get this plane off the ground!";
  else if (pct < 50) note = "We're airborne! Only " + money(left) + " to go.";
  else if (pct < 80) note = "Cruising altitude. " + money(left) + " left until we land.";
  else note = "Seatbelts on, final descent! Just " + money(left) + " to go.";
  $("pass-note").textContent = note;

  // Passport stamps
  var nextMarked = false;
  document.querySelectorAll("#stamps li").forEach(function (li) {
    var at = Number(li.getAttribute("data-at"));
    if (at === 500 && goal !== 500) { at = goal; li.querySelector("b").textContent = money(goal); }
    if (raised >= at) li.classList.add("is-earned");
    else if (!nextMarked) { li.classList.add("is-next"); nextMarked = true; }
  });

  // Plane flies along the route; the curve is drawn in real pixels so it never distorts
  var path = $("route-done");
  var trail = $("route-trail");
  var plane = $("plane");
  var box = path.ownerSVGElement;
  var total = 0;

  function layout() {
    var w = Math.max(60, box.clientWidth), h = Math.max(40, box.clientHeight);
    box.setAttribute("viewBox", "0 0 " + w + " " + h);
    var d = "M36 " + (h - 18) + " Q " + (w / 2) + " " + (-h * 0.55) + " " + (w - 36) + " " + (h - 18);
    path.setAttribute("d", d);
    trail.setAttribute("d", d);
    total = path.getTotalLength();
    path.style.strokeDasharray = total + " " + total;
  }

  function place(frac) {
    var pt = path.getPointAtLength(total * frac);
    var ahead = path.getPointAtLength(Math.min(total, total * frac + 1));
    var behind = path.getPointAtLength(Math.max(0, total * frac - 1));
    plane.style.left = pt.x + "px";
    plane.style.top = pt.y + "px";
    var angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180 / Math.PI;
    plane.firstElementChild.style.transform = "rotate(" + (angle + 22) + "deg)";
    path.style.strokeDashoffset = total * (1 - frac);
  }
  layout();

  var target = pct / 100;
  var current = 0;
  function fly(start) {
    var dur = 1400;
    function step(now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      current = target * eased;
      place(current);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function setRaisedText(frac) { $("raised").textContent = money(raised * frac); }

  place(0);
  var fill = $("meter-fill");
  if (pct === 0) fill.classList.add("is-zero");

  function start() {
    fill.style.width = Math.max(pct, 0) + "%";
    if (reduced) { current = target; place(target); setRaisedText(1); return; }
    fly(performance.now());
    var t0 = performance.now();
    (function count(now) {
      var t = Math.min(1, (now - t0) / 1400);
      setRaisedText(1 - Math.pow(1 - t, 3));
      if (t < 1) requestAnimationFrame(count);
    })(t0);
    if (raised >= goal) confetti();
  }
  setTimeout(start, 250);
  window.addEventListener("resize", function () { layout(); place(current); });

  function confetti() {
    var box = $("confetti");
    var colors = ["#e3b505", "#081a36", "#dff1fd", "#ffffff", "#8a6a00"];
    for (var i = 0; i < 90; i++) {
      var p = document.createElement("i");
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = 2.2 + Math.random() * 2 + "s";
      p.style.animationDelay = Math.random() * 0.8 + "s";
      box.appendChild(p);
    }
    setTimeout(function () { box.innerHTML = ""; }, 5500);
  }

  // Last-updated line
  if (fund.updated) {
    var d = new Date(fund.updated + "T12:00:00");
    if (!isNaN(d)) {
      var line = $("fund-updated");
      line.textContent = "Totals from our GiveCampus page as of " +
        d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) +
        ". " + line.textContent;
    }
  }

  // Sharing
  var status = $("share-status");
  var shareText = "Help UMass Law ILSA reach its " + money(goal) + " goal!";
  function copy() {
    var done = function () { status.textContent = "Link copied. Thank you for sharing!"; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, function () { status.textContent = url; });
    } else { status.textContent = url; }
  }
  $("copy-btn").addEventListener("click", copy);
  $("share-btn").addEventListener("click", function () {
    if (navigator.share) {
      navigator.share({ title: "Support UMass Law ILSA", text: shareText, url: url }).catch(function () {});
    } else { copy(); }
  });
})();
