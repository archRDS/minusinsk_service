(() => {
  const cfg = window.SITE_CONFIG || {};
  const byId = id => document.getElementById(id);
  const setText = (node, value) => { node.textContent = value == null ? "" : String(value); };
  const safeExternalUrl = value => {
    try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; }
    catch { return ""; }
  };

  document.title = `${cfg.businessName || "Шиномонтаж"} — запись и цены`;
  const description = document.querySelector('meta[name="description"]');
  if (description && cfg.description) description.content = cfg.description;
  document.querySelectorAll("[data-field]").forEach(node => setText(node, cfg[node.dataset.field]));
  byId("demo-banner").hidden = !cfg.demo;
  byId("price-demo-label").hidden = !cfg.demo;

  const phone = String(cfg.phoneE164 || "").replace(/[^\d+]/g, "");
  document.querySelectorAll("[data-phone-link]").forEach(link => {
    if (phone) link.href = `tel:${phone}`;
    else { link.href = "#contacts"; link.setAttribute("aria-label", "Укажите телефон в config.js"); }
  });
  const mapUrl = safeExternalUrl(cfg.mapUrl);
  const mapEmbedUrl = safeExternalUrl(cfg.mapEmbedUrl);
  if (mapUrl || mapEmbedUrl) {
    const miniMap = byId("mini-map");
    const surface = document.createElement(mapUrl ? "a" : "div");
    surface.className = "mini-map-surface";
    if (mapUrl) {
      surface.href = mapUrl;
      surface.target = "_blank";
      surface.rel = "noopener noreferrer";
      surface.setAttribute("aria-label", "Открыть карту 2ГИС в новой вкладке");
    }
    if (mapEmbedUrl) {
      const frame = document.createElement("iframe");
      frame.src = mapEmbedUrl;
      frame.title = "Мини-карта 2ГИС";
      frame.loading = "lazy";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      if (mapUrl) { frame.tabIndex = -1; frame.setAttribute("aria-hidden", "true"); }
      surface.append(frame);
    }
    const label = document.createElement("span");
    label.className = "mini-map-label";
    setText(label, mapUrl ? "Открыть карту в 2ГИС" : "Карта 2ГИС");
    surface.append(label);
    miniMap.replaceChildren(surface);
  }
  const gisUrl = safeExternalUrl(cfg.gisUrl);
  const gisLink = byId("gis-reviews-link");
  if (gisUrl) { gisLink.href = gisUrl; gisLink.target = "_blank"; gisLink.rel = "noopener noreferrer"; }
  else gisLink.hidden = true;

  const serviceList = byId("services-list");
  const serviceSelect = byId("service-select");
  (cfg.services || []).forEach(service => {
    const card = document.createElement("article"); card.className = "service-card";
    const title = document.createElement("h3"); setText(title, service.title);
    const body = document.createElement("p"); setText(body, service.text);
    card.append(title, body); serviceList.append(card);
    const option = document.createElement("option"); option.value = service.title; setText(option, service.title); serviceSelect.append(option);
  });
  (cfg.prices || []).forEach(item => {
    const row = document.createElement("div"); row.className = "price-row";
    for (const [className, value] of [["price-size", item.size], ["price-car", item.car], ["price-value", item.price]]) {
      const span = document.createElement("span"); span.className = className; setText(span, value); row.append(span);
    }
    byId("price-list").append(row);
  });
  (cfg.reviews || []).forEach(review => {
    const card = document.createElement("article"); card.className = "review-card";
    const stars = document.createElement("div"); stars.className = "review-stars"; stars.setAttribute("aria-hidden", "true"); setText(stars, "“");
    const quote = document.createElement("blockquote"); setText(quote, `“${review.text || ""}”`);
    const meta = document.createElement("div"); meta.className = "review-meta";
    const author = document.createElement("strong"); setText(author, review.author);
    const source = document.createElement("span"); setText(source, review.source);
    meta.append(author, source); card.append(stars, quote, meta);
    if (cfg.demo) { const note = document.createElement("small"); note.className = "review-demo-note"; setText(note, "Пример блока · замените реальным отзывом"); card.append(note); }
    byId("reviews-list").append(card);
  });

  const form = byId("booking-form");
  const dateInput = form.elements.date;
  const localToday = new Date();
  dateInput.min = `${localToday.getFullYear()}-${String(localToday.getMonth()+1).padStart(2,"0")}-${String(localToday.getDate()).padStart(2,"0")}`;
  const whatsApp = String(cfg.whatsappDigits || "").replace(/\D/g, "");
  const liveBooking = !cfg.demo && /^\d{10,15}$/.test(whatsApp);
  setText(byId("booking-button-text"), liveBooking ? "Отправить заявку в WhatsApp" : "Сформировать заявку");
  setText(byId("form-note"), liveBooking ? "Нажимая кнопку, вы откроете WhatsApp с готовым сообщением. Отправьте его, чтобы мастерская получила заявку и подтвердила время." : "В демоверсии вы увидите текст заявки. Добавьте номер WhatsApp в config.js, чтобы открывать сообщение для отправки.");
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const comment = String(data.get("comment") || "").trim();
    const message = [
      `Здравствуйте! Хочу записаться на шиномонтаж в ${cfg.businessName || "ваш сервис"}.`,
      `Имя: ${String(data.get("name")).trim()}`,
      `Телефон: ${String(data.get("phone")).trim()}`,
      `Услуга: ${data.get("service")}`,
      `Удобное время: ${data.get("date")} в ${data.get("time")}`,
      ...(comment ? [`Комментарий: ${comment}`] : [])
    ].join("\n");
    if (liveBooking) { window.open(`https://wa.me/${whatsApp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer"); return; }
    byId("booking-result").hidden = false;
    byId("booking-message").value = message;
    byId("booking-result").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  byId("copy-message").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(byId("booking-message").value); setText(byId("copy-message"), "Скопировано ✓"); }
    catch { byId("booking-message").select(); setText(byId("copy-message"), "Выделено — скопируйте текст"); }
  });
})();
