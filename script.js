(() => {
  const dateInput = document.getElementById("date");
  const hint = document.getElementById("dateHint");
  const form = document.querySelector('form[name="spotbook-termin"]');
  const status = document.getElementById("formStatus");
  const submitButton = form?.querySelector('button[type="submit"]');

  if (dateInput) {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    dateInput.min = today.toISOString().split("T")[0];

    dateInput.addEventListener("change", () => {
      if (!dateInput.value) return;
      const selected = new Date(`${dateInput.value}T12:00:00`);
      const day = selected.getDay();

      if (day === 0 || day === 6) {
        dateInput.setCustomValidity("Bitte wähle einen Termin von Montag bis Freitag.");
        hint.textContent = "Wochenenden sind nicht buchbar.";
        hint.style.color = "#b91c1c";
        dateInput.reportValidity();
        dateInput.value = "";
      } else {
        dateInput.setCustomValidity("");
        hint.textContent = "Nur Montag bis Freitag.";
        hint.style.color = "";
      }
    });
  }

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Wird gesendet …";
    status.hidden = true;
    status.className = "notice";

    try {
      const formData = new FormData(form);

      const response = await fetch("/", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      status.textContent = "Vielen Dank! Deine Terminanfrage wurde gesendet. Wir melden uns zur Bestätigung.";
      status.className = "notice success";
      status.hidden = false;
      form.reset();
      status.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (error) {
      console.error(error);
      status.textContent = "Die Anfrage konnte nicht gesendet werden. Bitte versuche es erneut oder kontaktiere uns per WhatsApp unter 0160 2162777.";
      status.className = "notice error";
      status.hidden = false;
      status.scrollIntoView({ behavior: "smooth", block: "center" });
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Terminanfrage senden";
    }
  });
})();
