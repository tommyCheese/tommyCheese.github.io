async function handleFormspreeSubmit(event) {
  event.preventDefault();
  const form = event.target;
  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("Submission failed");
    contactAlert("success", window.siteI18n.t("contact.success"));
    form.reset();
  } catch (_) {
    contactAlert("danger", window.siteI18n.t("contact.error"));
  }
}

function contactAlert(type, message) {
  const container = document.getElementById("contact-form-status");
  const alert = document.createElement("div");
  alert.className = "alert alert-" + type;
  alert.setAttribute("role", "status");
  alert.textContent = message;
  const close = document.createElement("button");
  close.type = "button";
  close.className = "btn-close float-end";
  close.setAttribute("aria-label", window.siteI18n.t("action.close"));
  close.addEventListener("click", () => alert.remove());
  alert.append(close);
  container.replaceChildren(alert);
  setTimeout(() => alert.remove(), 5000);
}
