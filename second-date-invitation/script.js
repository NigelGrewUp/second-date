/**
 * ====================================================================
 * ROMANTIC SECOND DATE INVITATION - VANILLA JAVASCRIPT
 * ====================================================================
 */

/* ====================================================================
   1. GIF CONFIGURATION
   Replace these URLs with your favorite animated GIFs anytime!
   Default placeholders are super cute, high-quality romantic GIFs.
   ==================================================================== */
const SHY_GIF_URL = "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWUzZmZ1NWh4NGR4NHMxOWMybjMxb2ppaXh2bWdocnN3emF2NHRxaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WUIMtYysaO0sE/giphy.gif";
const HAPPY_GIF_URL = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExenlxYmozYnZzajN0ejYycDcya2RqNmVucWVmMXR2eHJ6MTcyeDU5YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HuGCwDXj4nQnS/giphy.gif";

/* ====================================================================
   2. EMAILJS CONFIGURATION
   Sign up at https://www.emailjs.com/ (free tier provides 200 emails/month).
   Replace these three placeholder values with your EmailJS credentials:
   - EMAILJS_PUBLIC_KEY: Found in Account -> General -> API Keys -> Public Key
   - EMAILJS_SERVICE_ID: Found in Email Services -> Service ID (e.g. "service_xxxx")
   - EMAILJS_TEMPLATE_ID: Found in Email Templates -> Template ID (e.g. "template_xxxx")
   ==================================================================== */
const EMAILJS_PUBLIC_KEY = "TCLU7ZElRhsHSkG7w";
const EMAILJS_SERVICE_ID = "service_7gyxd1n";
const EMAILJS_TEMPLATE_ID = "template_ttr1dy1";

// Target recipient email address
const TARGET_RECIPIENT_EMAIL = "georgetriv13@gmail.com";

/* ====================================================================
   3. NO BUTTON MESSAGES LIST (PLAYFUL DODGING TEASES)
   ==================================================================== */
const NO_MESSAGES = [
  "Are you sure?",
  "Think again",
  "I will bring ice cream 🍦",
  "Pretty please? 🥺",
  "One more chance?",
  "Really?",
  "Are you REALLY sure?",
  "But we had fun!",
  "Maybe reconsider?",
  "No is not an answer 😭",
  "I'll let you pick the place",
  "Just say yes 🥺",
  "You can't escape 😌",
  "I promise it'll be fun",
  "Come onnn 😭",
  "Give me a chance?"
];

let lastMessageIndex = -1;

/* ====================================================================
   4. DOM ELEMENTS
   ==================================================================== */
const screen1 = document.getElementById("screen-1");
const screen2 = document.getElementById("screen-2");
const screen3 = document.getElementById("screen-3");

const shyGifImg = document.getElementById("shy-gif");
const happyGifImg = document.getElementById("happy-gif");
const successGifImg = document.getElementById("success-gif");

const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");

const dateForm = document.getElementById("date-form");
const dateInput = document.getElementById("date-input");
const timeInput = document.getElementById("time-input");
const sendBtn = document.getElementById("send-btn");
const formError = document.getElementById("form-error");

const chosenDateDisplay = document.getElementById("chosen-date-display");
const chosenTimeDisplay = document.getElementById("chosen-time-display");
const calendarLink = document.getElementById("calendar-link");

const canvas = document.getElementById("celebration-canvas");
const ctx = canvas.getContext("2d");

/* ====================================================================
   5. INITIALIZATION
   ==================================================================== */
function applyConfiguredGifs() {
  const shyImg = document.getElementById("shy-gif");
  const happyImg = document.getElementById("happy-gif");
  const successImg = document.getElementById("success-gif");

  if (shyImg && SHY_GIF_URL && shyImg.getAttribute("src") !== SHY_GIF_URL) {
    shyImg.src = SHY_GIF_URL;
  }
  if (happyImg && HAPPY_GIF_URL && happyImg.getAttribute("src") !== HAPPY_GIF_URL) {
    happyImg.src = HAPPY_GIF_URL;
  }
  if (successImg && HAPPY_GIF_URL && successImg.getAttribute("src") !== HAPPY_GIF_URL) {
    successImg.src = HAPPY_GIF_URL;
  }
}

// Run immediately to guarantee GIFs are loaded even before DOMContentLoaded
applyConfiguredGifs();

function initApp() {
  applyConfiguredGifs();

  // Prevent past dates from being selected
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }

  // Initialize EmailJS if configured
  if (window.emailjs && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    try {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      console.log("EmailJS initialized successfully.");
    } catch (err) {
      console.warn("EmailJS init note:", err);
    }
  }

  // Setup Canvas resizing
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Setup background floating ambient decorations
  createFloatingBackgroundHearts();

  // Attach Event Handlers
  attachNoButtonEvents();
  attachYesButtonEvents();
  attachFormEvents();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

/* ====================================================================
   6. PLAYFUL NO-BUTTON DODGE BEHAVIOR
   ==================================================================== */
function getNextNoMessage() {
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * NO_MESSAGES.length);
  } while (nextIndex === lastMessageIndex && NO_MESSAGES.length > 1);

  lastMessageIndex = nextIndex;
  return NO_MESSAGES[nextIndex];
}

let isDodgingDebounce = false;

function dodgeNoButton(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Debounce to prevent simultaneous pointerdown + click double jumps
  if (isDodgingDebounce) return;
  isDodgingDebounce = true;
  setTimeout(() => {
    isDodgingDebounce = false;
  }, 180);

  // Update text with next teasing message
  noBtn.textContent = getNextNoMessage();

  // Temporarily reset transform to measure natural untransformed position
  const prevTransform = noBtn.style.transform;
  noBtn.style.transition = "none";
  noBtn.style.transform = "";

  const naturalRect = noBtn.getBoundingClientRect();
  const container = document.querySelector(".container") || document.querySelector(".card");
  const containerRect = container ? container.getBoundingClientRect() : document.body.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();

  const pad = 16;
  // Calculate bounding constraints ensuring it stays fully inside the container and viewport
  const minX = Math.max(pad, containerRect.left + pad);
  const maxX = Math.min(window.innerWidth - naturalRect.width - pad, containerRect.right - naturalRect.width - pad);
  const minY = Math.max(pad, containerRect.top + pad);
  const maxY = Math.min(window.innerHeight - naturalRect.height - pad, containerRect.bottom - naturalRect.height - pad);

  const safeMinX = Math.min(minX, maxX);
  const safeMaxX = Math.max(minX, maxX);
  const safeMinY = Math.min(minY, maxY);
  const safeMaxY = Math.max(minY, maxY);

  let targetX = safeMinX;
  let targetY = safeMinY;
  let attempts = 0;

  // Pick random coordinates that do not block the Yes button
  while (attempts < 30) {
    targetX = Math.floor(Math.random() * (safeMaxX - safeMinX + 1)) + safeMinX;
    targetY = Math.floor(Math.random() * (safeMaxY - safeMinY + 1)) + safeMinY;

    // Verify distance from Yes button
    const overlapsYes = (
      targetX < yesRect.right + 24 &&
      targetX + naturalRect.width > yesRect.left - 24 &&
      targetY < yesRect.bottom + 24 &&
      targetY + naturalRect.height > yesRect.top - 24
    );

    // Ensure it noticeably moves from its natural base
    const distFromNatural = Math.hypot(targetX - naturalRect.left, targetY - naturalRect.top);

    if (!overlapsYes && (distFromNatural > 40 || attempts > 20)) {
      break;
    }
    attempts++;
  }

  const deltaX = targetX - naturalRect.left;
  const deltaY = targetY - naturalRect.top;
  const tilt = (Math.random() * 12 - 6).toFixed(1);

  // Restore previous transform briefly, then animate to new position smoothly
  if (prevTransform) {
    noBtn.style.transform = prevTransform;
  }
  // Force browser layout reflow
  void noBtn.offsetHeight;

  noBtn.style.transition = "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease";
  noBtn.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${tilt}deg)`;
}

function attachNoButtonEvents() {
  // Trigger when user presses / clicks / taps the button
  noBtn.addEventListener("click", dodgeNoButton);
  noBtn.addEventListener("pointerdown", (e) => {
    // Left click or mobile touch
    if (e.button === 0 || e.pointerType === "touch") {
      dodgeNoButton(e);
    }
  });
}

/* ====================================================================
   7. YES BUTTON & SCREEN TRANSITIONS
   ==================================================================== */
function switchScreen(fromScreen, toScreen) {
  fromScreen.classList.add("fade-out");

  setTimeout(() => {
    fromScreen.classList.remove("active", "fade-out");
    toScreen.classList.add("active");
    applyConfiguredGifs();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 350);
}

function attachYesButtonEvents() {
  yesBtn.addEventListener("click", () => {
    // Fire celebration confetti burst
    triggerConfetti(50);

    // Transition from Screen 1 to Screen 2
    switchScreen(screen1, screen2);
  });
}

/* ====================================================================
   8. FORM VALIDATION & EMAILJS SENDING
   ==================================================================== */
function attachFormEvents() {
  // Clear error message when user interacts with inputs
  dateInput.addEventListener("input", () => {
    formError.classList.remove("visible");
  });
  timeInput.addEventListener("input", () => {
    formError.classList.remove("visible");
  });

  dateForm.addEventListener("submit", handleFormSubmit);
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const selectedDate = dateInput.value.trim();
  const selectedTime = timeInput.value.trim();

  // Validation: both fields required
  if (!selectedDate || !selectedTime) {
    showFormError("Choose a date and time first");
    return;
  }

  // Update button UX: disable & change text
  formError.classList.remove("visible");
  sendBtn.disabled = true;
  const originalBtnText = sendBtn.innerHTML;
  sendBtn.innerHTML = "Sending...";

  const templateParams = {
    date: selectedDate,
    time: selectedTime,
    to_email: TARGET_RECIPIENT_EMAIL
  };

  try {
    // Check if EmailJS credentials have been configured
    const isEmailJsConfigured = (
      typeof emailjs !== "undefined" &&
      EMAILJS_PUBLIC_KEY &&
      EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY" &&
      EMAILJS_SERVICE_ID &&
      EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" &&
      EMAILJS_TEMPLATE_ID &&
      EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID"
    );

    if (isEmailJsConfigured) {
      // Send real email via EmailJS browser SDK
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      console.log(" Email sent successfully to", TARGET_RECIPIENT_EMAIL);
    } else {
      // Local preview / test simulation
      console.info(
        "ℹ️ EmailJS is using placeholder keys. To send actual emails to georgetriv13@gmail.com, configure EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, and EMAILJS_TEMPLATE_ID at the top of script.js."
      );
      // Simulate network request delay for realistic feel during testing
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Success! Show final screen
    handleSendSuccess(selectedDate, selectedTime);

  } catch (error) {
    console.warn("EmailJS notification note:", error);
    // Restore button state
    sendBtn.disabled = false;
    sendBtn.innerHTML = originalBtnText;

    const errorText = (error && typeof error === "object")
      ? (error.text || error.message || JSON.stringify(error))
      : String(error || "");

    if (errorText.includes("template ID not found")) {
      showFormError(`
        Template ID not found in EmailJS 🥺<br>
        <span style="font-size: 0.8rem; font-weight: 400; display: inline-block; margin-top: 4px;">
          Make sure to click <strong>"Save"</strong> on your template at 
          <a href="https://dashboard.emailjs.com/admin/templates" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">
            dashboard.emailjs.com/admin/templates
          </a>
        </span>
        <button type="button" id="proceed-fallback-btn" class="btn" style="font-size: 1.15rem; padding: 0.4rem 1rem; margin-top: 0.6rem; width: 100%; background: #ffffff; color: var(--ink);">
          Confirm Date Anyway ✨
        </button>
      `);

      const proceedBtn = document.getElementById("proceed-fallback-btn");
      if (proceedBtn) {
        proceedBtn.addEventListener("click", () => {
          handleSendSuccess(selectedDate, selectedTime);
        });
      }
    } else {
      showFormError(`
        Oops! Something went wrong 😭<br>
        <span style="font-size: 0.8rem; font-weight: 400; display: inline-block; margin-top: 4px;">
          Please try again, or confirm directly below:
        </span>
        <button type="button" id="proceed-fallback-btn" class="btn" style="font-size: 1.15rem; padding: 0.4rem 1rem; margin-top: 0.6rem; width: 100%; background: #ffffff; color: var(--ink);">
          Confirm Date Anyway ✨
        </button>
      `);

      const proceedBtn = document.getElementById("proceed-fallback-btn");
      if (proceedBtn) {
        proceedBtn.addEventListener("click", () => {
          handleSendSuccess(selectedDate, selectedTime);
        });
      }
    }
  }
}

function showFormError(message) {
  formError.innerHTML = message;
  formError.classList.add("visible");
}

function handleSendSuccess(dateStr, timeStr) {
  // Format date and time for display
  const formattedDate = formatDisplayDate(dateStr);
  const formattedTime = formatDisplayTime(timeStr);

  if (chosenDateDisplay) chosenDateDisplay.textContent = formattedDate;
  if (chosenTimeDisplay) chosenTimeDisplay.textContent = formattedTime;

  // Build Google Calendar Add Link
  setupGoogleCalendarLink(dateStr, timeStr);

  // Transition to Screen 3
  switchScreen(screen2, screen3);

  // Big celebration confetti burst!
  triggerConfetti(90);
}

/* ====================================================================
   9. DATE/TIME FORMATTING & CALENDAR UTILITIES
   ==================================================================== */
function formatDisplayDate(dateString) {
  try {
    const parts = dateString.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);

    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return dateString;
  }
}

function formatDisplayTime(timeString) {
  try {
    const parts = timeString.split(":");
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    return `${hours}:${minutes} ${ampm}`;
  } catch {
    return timeString;
  }
}

function setupGoogleCalendarLink(dateStr, timeStr) {
  if (!calendarLink) return;

  try {
    // Construct ISO string for start time
    const startIso = `${dateStr.replace(/-/g, "")}T${timeStr.replace(/:/g, "")}00`;
    
    // Estimate 2 hour date duration
    const timeParts = timeStr.split(":");
    let endHour = (parseInt(timeParts[0], 10) + 2) % 24;
    const endHourStr = String(endHour).padStart(2, "0");
    const endIso = `${dateStr.replace(/-/g, "")}T${endHourStr}${timeParts[1]}00`;

    const title = encodeURIComponent("Second Date");
    const details = encodeURIComponent("Can't wait!");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}`;
    
    calendarLink.href = url;
  } catch {
    calendarLink.style.display = "none";
  }
}

/* ====================================================================
   10. LIGHTWEIGHT VANILLA CANVAS CONFETTI & HEARTS ENGINE
   (Zero external dependencies, 60fps, buttery smooth)
   ==================================================================== */
let particles = [];
let isAnimating = false;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function triggerConfetti(count = 60) {
  const colors = [
    "#eb5e28", "#f4a261", "#e76f51", "#e9c46a", 
    "#403d39", "#ffccd5", "#d84a15", "#ff8fa3"
  ];

  const originX = window.innerWidth / 2;
  const originY = window.innerHeight * 0.45;

  for (let i = 0; i < count; i++) {
    const isHeart = Math.random() > 0.45;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;

    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: Math.random() * 10 + 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.15,
      isHeart: isHeart,
      decay: Math.random() * 0.012 + 0.008
    });
  }

  if (!isAnimating) {
    isAnimating = true;
    requestAnimationFrame(renderConfetti);
  }
}

function renderConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.16; // gravity
    p.vx *= 0.98; // air resistance
    p.rotation += p.rotationSpeed;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;

    if (p.isHeart) {
      // Draw smooth romantic heart shape
      drawHeart(ctx, 0, 0, p.size);
    } else {
      // Confetti rectangle ribbon
      ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
    }

    ctx.restore();
  }

  if (particles.length > 0) {
    requestAnimationFrame(renderConfetti);
  } else {
    isAnimating = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function drawHeart(c, x, y, size) {
  const topCurveHeight = size * 0.3;
  c.beginPath();
  c.moveTo(x, y + topCurveHeight);
  // top left curve
  c.bezierCurveTo(
    x, y, 
    x - size / 2, y, 
    x - size / 2, y + topCurveHeight
  );
  // bottom left curve
  c.bezierCurveTo(
    x - size / 2, y + (size + topCurveHeight) / 2, 
    x, y + (size + topCurveHeight) / 2, 
    x, y + size
  );
  // bottom right curve
  c.bezierCurveTo(
    x, y + (size + topCurveHeight) / 2, 
    x + size / 2, y + (size + topCurveHeight) / 2, 
    x + size / 2, y + topCurveHeight
  );
  // top right curve
  c.bezierCurveTo(
    x + size / 2, y, 
    x, y, 
    x, y + topCurveHeight
  );
  c.closePath();
  c.fill();
}

/* ====================================================================
   11. BACKGROUND FLOATING PARTICLES
   ==================================================================== */
function createFloatingBackgroundHearts() {
  const container = document.getElementById("background-decorations");
  if (!container) return;

  const heartSymbols = ["✨"];
  const totalItems = 14;

  for (let i = 0; i < totalItems; i++) {
    const el = document.createElement("div");
    el.className = "floating-heart";
    el.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    el.style.left = `${Math.random() * 95}%`;
    el.style.fontSize = `${Math.random() * 16 + 14}px`;
    el.style.animationDuration = `${Math.random() * 8 + 10}s`;
    el.style.animationDelay = `${Math.random() * 10}s`;
    container.appendChild(el);
  }
}
