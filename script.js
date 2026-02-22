const WEBHOOK_URL = "https://ai-9-productions.app.n8n.cloud/webhook/email-forward";
const RECIPIENT_EMAIL = "7aiproductions@gmail.com";

const overlay = document.getElementById("modal-overlay");
const openModalBtn = document.getElementById("open-modal");
const closeModalBtn = document.getElementById("close-modal");
const form = document.getElementById("beta-form");
const submitBtn = document.getElementById("submit-btn");
const errorBox = document.getElementById("form-error");
const successBox = document.getElementById("form-success");
const firstInput = document.getElementById("pseudo");

function showModal() {
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
  firstInput?.focus();
}

function hideModal() {
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

function setError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function clearError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

function showSuccess() {
  successBox.classList.remove("hidden");
}

openModalBtn.addEventListener("click", showModal);
closeModalBtn.addEventListener("click", hideModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && overlay.classList.contains("show")) {
    hideModal();
  }
});

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    hideModal();
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();
  successBox.classList.add("hidden");

  const formData = new FormData(form);
  const pseudo = (formData.get("pseudo") || "").toString().trim();
  const senderEmail = (formData.get("email") || "").toString().trim();

  if (!pseudo || !senderEmail) {
    setError("Merci de renseigner ton prenom/pseudo et ton email.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Envoi...";

  const subject = `Demande beta-test Kreolyse Phrases - ${pseudo}`;
  const message =
    `Nouvelle demande beta-test.\n` +
    `Prenom/Pseudo: ${pseudo}\n` +
    `Email: ${senderEmail}\n` +
    `Source: Kreolyse phrase link`;

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        senderEmail,
        recipientEmail: RECIPIENT_EMAIL,
        subject,
        message,
        pseudo,
        source: "Kreolyse phrase link",
        requestType: "beta_test_kreolyse_phrases",
        sentAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error("Le webhook a repondu avec une erreur.");
    }

    form.reset();
    showSuccess();
  } catch (error) {
    setError("Erreur lors de l'envoi. Merci de reessayer.");
    console.error(error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Envoyer";
  }
});



