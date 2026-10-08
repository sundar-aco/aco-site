/* ACO landing page script: background network, scroll reveal, waitlist form. */
(function () {
  "use strict";

  var CONFIG = window.ACO_CONFIG || {};
  var ENDPOINT = (CONFIG.WAITLIST_ENDPOINT || "").trim();
  var CONTACT = (CONFIG.CONTACT_EMAIL || "").trim();
  var FALLBACK_EMAIL = CONTACT || "email@example.com"; // placeholder until a real address exists
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  /* Footer details */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
  var contactEl = document.getElementById("contact-email");
  if (contactEl && CONTACT) {
    var a = document.createElement("a");
    a.href = "mailto:" + CONTACT;
    a.textContent = CONTACT;
    contactEl.replaceWith(a);
  }

  /* Scroll reveal */
  var revealTargets = document.querySelectorAll(".section h2, .section .sub, .card, .step, .tl, .test__panel, .formbox, .verbs li");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    var fold = window.innerHeight;
    revealTargets.forEach(function (el) {
      if (el.getBoundingClientRect().top < fold) return; // already on screen: never hide it
      el.classList.add("reveal"); io.observe(el);
    });
  }

  /* Hero background: slow-moving network of nodes */
  var canvas = document.querySelector(".hero__net");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var nodes = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), raf = null, visible = true;

    function setup() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(18, Math.min(60, Math.round((w * h) / 22000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.6 + 0.8 });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var maxD = 140;
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxD) {
            ctx.strokeStyle = "rgba(167,139,250," + (0.35 * (1 - d / maxD)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        ctx.fillStyle = "rgba(221,214,254,0.85)";
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    function step() {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      draw();
      raf = visible ? requestAnimationFrame(step) : null;
    }

    setup();
    if (reduceMotion) { draw(); } else { raf = requestAnimationFrame(step); }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { setup(); draw(); }, 150);
    });
    if ("IntersectionObserver" in window && !reduceMotion) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(step);
      }).observe(canvas);
    }
  }

  /* Waitlist form */
  var form = document.getElementById("waitlist-form");
  if (!form) return;
  var errorEl = document.getElementById("form-error");
  var submitBtn = document.getElementById("form-submit");
  var thanks = document.getElementById("thanks");
  var thanksTitle = document.getElementById("thanks-title");
  var thanksText = document.getElementById("thanks-text");
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function showError(msg, field) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
    if (field) { field.setAttribute("aria-invalid", "true"); field.focus(); }
  }
  function clearError() {
    errorEl.hidden = true; errorEl.textContent = "";
    form.querySelectorAll("[aria-invalid]").forEach(function (el) { el.removeAttribute("aria-invalid"); });
  }

  function mailtoLink(data) {
    var subject = "ACO early access waitlist";
    var body = "Hi, please add me to the ACO early access waitlist.\n\n" +
      "Name: " + data.name + "\n" +
      "Email: " + data.email + "\n" +
      "How I use AI today: " + (data.use || "-") + "\n";
    return "mailto:" + FALLBACK_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function showThanks(title, html) {
    form.hidden = true;
    thanksTitle.textContent = title;
    thanksText.innerHTML = html;
    thanks.hidden = false;
    thanks.focus();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; });
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    clearError();

    var nameEl = form.elements.name, emailEl = form.elements.email;
    var data = {
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      use: form.elements.use.value.trim()
    };

    // Spam trap: bots fill hidden fields. Pretend success, send nothing.
    if (form.elements.website.value) { showThanks("You're on the list. Thank you!", "We'll email you when the private test opens."); return; }

    if (!data.name) return showError("Please tell us your name.", nameEl);
    if (!EMAIL_RE.test(data.email)) return showError("Please enter a valid email address.", emailEl);

    var first = escapeHtml(data.name.split(/\s+/)[0]);

    if (!ENDPOINT) {
      // No backend yet: hand the details to the visitor's email app.
      var link = mailtoLink(data);
      showThanks("Thank you, " + first + "!",
        "One last step: your email app should open with your details filled in. Just press <b>Send</b>.<br>" +
        "If nothing opened, <a href=\"" + escapeHtml(link) + "\">click here to send it</a>.");
      window.location.href = link;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    var payload = {
      name: data.name,
      email: data.email,
      use: data.use,
      source: "aco-site",
      page: window.location.href,
      submittedAt: new Date().toISOString()
    };

    var controller = "AbortController" in window ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 15000) : null;

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      showThanks("You're on the list, " + first + "!", "Thank you. We'll email you at <b>" + escapeHtml(data.email) + "</b> when the private test opens.");
    }).catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = "Join the early access waitlist";
      errorEl.innerHTML = "Sorry, something went wrong on our side. Please try again, or <a href=\"" + escapeHtml(mailtoLink(data)) + "\">send us your details by email</a>.";
      errorEl.hidden = false;
    }).finally(function () { if (timer) clearTimeout(timer); });
  });
})();
