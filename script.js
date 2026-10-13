
/* =========================================
   1. CHAPTER NAVIGATION
========================================= */

const screens = [...document.querySelectorAll(".screen")];

let current = 0;

const ids = screens.map((screen) => screen.id);

function go(id) {
    screens.forEach((screen) => {
        screen.classList.toggle("active", screen.id === id);
    });

    current = ids.indexOf(id);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", () => {
        go(button.dataset.next);
    });
});


/* =========================================
   2. FIRST MEETING DAY COUNTER
   We first met on 6 October 2026.
========================================= */

const firstMeetingDate = new Date(2026, 9, 6);

function updateDaysCounter() {
    const today = new Date();

    // Compare calendar dates without including the time.
    today.setHours(0, 0, 0, 0);

    const meetingDate = new Date(firstMeetingDate);
    meetingDate.setHours(0, 0, 0, 0);

    const difference = today.getTime() - meetingDate.getTime();

    const daysElement = document.getElementById("days");

    if (!daysElement) return;

    if (difference < 0) {
        daysElement.textContent = "0";
        return;
    }

    const daysPassed = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    daysElement.textContent = daysPassed;
}

updateDaysCounter();


/* =========================================
   3. PHOTO STORIES
========================================= */


const stories = [
  {
    video: "vdo1.mp4",
    caption: "Some moments are ordinary until they become our favourites."
  },
  {
    video: "vdo2.mp4",
    caption: "Another little memory that makes me smile."
  },
  {
    video: "vdo3.mp4",
    caption: "And somehow, ordinary moments become special."
  }
];


const storyPhoto = document.getElementById("storyPhoto");
let currentStory = 0;

function showStory(index) {
  if (index < 0 || index >= stories.length) return;

  currentStory = index;
  const story = stories[currentStory];

  storyPhoto.pause();
  storyPhoto.src = story.video;
  storyPhoto.load();

  document.getElementById("storyCaption").textContent = story.caption;
  document.getElementById("storyNum").textContent =
    `0${currentStory + 1} / 0${stories.length}`;
}

document.getElementById("prevStory").addEventListener("click", () => {
  showStory((currentStory - 1 + stories.length) % stories.length);
});

document.getElementById("nextStory").addEventListener("click", () => {
  showStory((currentStory + 1) % stories.length);
});


/*let storyIndex = 0;

function updateStory() {
    const caption = document.getElementById("storyCaption");
    const photo = document.getElementById("storyPhoto");
    const number = document.getElementById("storyNum");

    caption.textContent = stories[storyIndex].caption;
    photo.src = stories[storyIndex].image;

    number.textContent =
        `0${storyIndex + 1} / 0${stories.length}`;
}

document.getElementById("prevStory").addEventListener("click", () => {
    storyIndex =
        (storyIndex + stories.length - 1) % stories.length;

    updateStory();
});

document.getElementById("nextStory").addEventListener("click", () => {
    storyIndex = (storyIndex + 1) % stories.length;

    updateStory();
});*/


/* =========================================
   4. OPEN THE LETTER
========================================= */

const openLetterButton = document.getElementById("openLetter");
const letterContent = document.getElementById("letterContent");

openLetterButton.addEventListener("click", () => {
    letterContent.classList.toggle("hidden");
    openLetterButton.classList.toggle("hidden");
});

/* =========================================
   5. PROPOSAL
========================================= */


const proposalYes = document.getElementById("proposalYes");
const proposalLater = document.getElementById("proposalLater");
const proposalNote = document.getElementById("proposalNote");
const proposalSuccess = document.getElementById("proposalSuccess");
const proposalButtons = document.querySelector("#proposal .proposal-buttons");

let proposalSubmitting = false;

async function saveProposalResponse(answer) {
  if (proposalSubmitting) return;

  proposalSubmitting = true;

  const buttons = [proposalYes, proposalLater];
  buttons.forEach(button => button.disabled = true);

  try {
    await db.collection("proposalResponses").add({
      answer: answer,
      submittedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    if (answer === "yes") {
      proposalButtons.hidden = true;
      proposalNote.hidden = true;
      proposalSuccess.hidden = false;
    } else {
      proposalNote.textContent =
        "Take all the time you need. There's no pressure. ♡";
    }
  } catch (error) {
    console.error("Could not save response:", error);

    proposalNote.textContent =
      "Your response couldn't be saved. Please try again.";

    buttons.forEach(button => button.disabled = false);
    proposalSubmitting = false;
  }
}

if (proposalYes) {
  proposalYes.addEventListener("click", () => {
    saveProposalResponse("yes");
  });
}

if (proposalLater) {
  proposalLater.addEventListener("click", () => {
    saveProposalResponse("need_a_moment");
  });
}



/* =========================================
   6. TOAST NOTIFICATIONS
========================================= */

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}


/* =========================================
   7. BACKGROUND MUSIC
========================================= */


/*const backgroundMusic = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");

if (backgroundMusic && musicToggle) {
  musicToggle.addEventListener("click", async () => {
    if (backgroundMusic.paused) {
      try {
        await backgroundMusic.play();
        musicToggle.textContent = "⏸ Pause Music";
      } catch (error) {
        console.error("Music could not play:", error);
        musicToggle.textContent = "▶ Try Playing Again";
      }
    } else {
      backgroundMusic.pause();
      musicToggle.textContent = "▶ Play Music";
    }
  });

  backgroundMusic.addEventListener("ended", () => {
    musicToggle.textContent = "▶ Play Music";
  });
}*/


const music = document.getElementById("bgMusic");
const soundButton = document.getElementById("soundBtn");

soundButton.addEventListener("click", async () => {
    try {
        if (music.paused) {
            await music.play();
            soundButton.textContent = "Ⅱ";
            showToast("Music on ♫");
        } else {
            music.pause();
            soundButton.textContent = "♫";
            showToast("Music paused");
        }
    } catch (error) {
        showToast("Check that music.mp3 exists beside index.html");
        console.error("Music playback error:", error);
    }
});

music.addEventListener("play", () => {
    soundButton.textContent = "Ⅱ";
});

music.addEventListener("pause", () => {
    soundButton.textContent = "♫";
});


/* =========================================
   8. FRIENDSHIP PROMISE CHECKLIST
========================================= */

const finishButton = document.getElementById("finishBtn");
const signatureInput = document.getElementById("signature");
const finalStamp = document.getElementById("finalStamp");

finishButton.addEventListener("click", () => {
    const checkedPromises = document.querySelectorAll(
        ".promise-list input:checked"
    ).length;

    const signature = signatureInput.value.trim();

    if (checkedPromises < 5) {
        showToast("Tick all five promises first ♡");
        return;
    }

    if (signature === "") {
        showToast("Add your signature to seal it ♡");
        signatureInput.focus();
        return;
    }

    finalStamp.textContent =
        `PROMISE SEALED · ${signature.toUpperCase()} ♥`;

    finalStamp.classList.remove("hidden");

    showToast("A promise made and sealed!");
});


/* =========================================
   9. MOBILE SWIPE NAVIGATION
========================================= */

let startX = 0;
let startY = 0;

document.addEventListener("touchstart", (event) => {
    startX = event.changedTouches[0].screenX;
    startY = event.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener("touchend", (event) => {
    const endX = event.changedTouches[0].screenX;
    const endY = event.changedTouches[0].screenY;

    const differenceX = endX - startX;
    const differenceY = endY - startY;

    if (
        Math.abs(differenceX) > 90 &&
        Math.abs(differenceX) > Math.abs(differenceY) * 1.4
    ) {
        if (differenceX < 0 && current < ids.length - 1) {
            go(ids[current + 1]);
        } else if (differenceX > 0 && current > 0) {
            go(ids[current - 1]);
        }
    }
}, { passive: true });


