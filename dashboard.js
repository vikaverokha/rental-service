const api = "http://localhost:3000/api/properties";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const user_id = localStorage.getItem("user_id");

if (!token) window.location.href = "login.html";

const addFormContainer = document.getElementById("addFormContainer");
const showAddFormBtn = document.getElementById("showAddForm");
const list = document.getElementById("list");
const dashboardTitle = document.getElementById("dashboard-title");
const cancelAddBtn = document.getElementById("cancelAdd");


if (role !== "host") {
  showAddFormBtn.style.display = "none";
  addFormContainer.style.display = "none";
  dashboardTitle.textContent = "Доступные объявления";
}

// Показать/скрыть форму добавления
showAddFormBtn?.addEventListener("click", () => {
  addFormContainer.style.display = addFormContainer.style.display === "none" ? "block" : "none";
});

// Отмена добавления
cancelAddBtn?.addEventListener("click", () => {
  addFormContainer.style.display = "none";
  document.getElementById("addForm").reset();
});

// Выйти
document.getElementById("logout").onclick = () => {
  localStorage.clear();
  window.location.href = "login.html";
};

// Загрузка объектов
async function loadProperties() {
  try {
    const res = await fetch(api, { headers: { "Authorization": "Bearer " + token } });
    const data = await res.json();

    
    const displayProps = role === "host" 
      ? data.filter(p => p.owner_id == user_id)
      : data.filter(p => p.status === "active");

    if (displayProps.length === 0) {
      list.innerHTML = `<p style="text-align:center; width:100%;">Объявлений пока нет</p>`;
      return;
    }

    list.innerHTML = displayProps.map(p => {
      const buttons = role === "host" ? `
        <div class="card-buttons">
          <button onclick="edit(${p.listing_id})" class="btn secondary">Редактировать</button>
          <button onclick="del(${p.listing_id})" class="btn secondary">Удалить</button>
        </div>
      ` : "";

      return `
        <div class="property-card">
          <div class="card-content">
            <h3 class="property-title">${p.title}</h3>
            <p class="property-address">${p.address}, ${p.city}, ${p.country}</p>
            <p class="property-description">${p.description}</p>
            <div class="property-info">
              <span class="property-price">${p.price_per_night} BYN / ночь</span>
              <span class="property-guests">Макс. гостей: ${p.max_guests}</span>
            </div>
            ${buttons}
          </div>
        </div>
      `;
    }).join("");
  } catch(err) {
    console.error(err);
    list.innerHTML = `<p style="text-align:center; width:100%;">Ошибка загрузки объявлений</p>`;
  }
}

// Добавление объекта
if (role === "host") {
  document.getElementById("addForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const property = {
      title: document.getElementById("title").value.trim(),
      description: document.getElementById("description").value.trim(),
      address: document.getElementById("address").value.trim(),
      city: document.getElementById("city").value.trim(),
      country: document.getElementById("country").value.trim(),
      price_per_night: parseFloat(document.getElementById("price_per_night").value),
      max_guests: parseInt(document.getElementById("max_guests").value),
      status: document.getElementById("status").value
    };

    try {
      const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify(property)
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Ошибка создания объекта");

      addFormContainer.style.display = "none";
      document.getElementById("addForm").reset();
      loadProperties();
    } catch(err) {
      console.error(err);
      alert("Ошибка сети при создании объекта");
    }
  });
}

// Удаление объекта
async function del(id) {
  if (!confirm("Удалить объект?")) return;
  const res = await fetch(`${api}/${id}`, { method: "DELETE", headers: { "Authorization": "Bearer " + token } });
  const data = await res.json();
  if (!res.ok) alert(data.message || "Ошибка удаления");
  loadProperties();
}

// Редактирование объекта
async function edit(id) {
  const property = await fetch(`${api}/${id}`, { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
  if (!property) return alert("Объект не найден");

  const newTitle = prompt("Заголовок:", property.title) || property.title;
  const newDescription = prompt("Описание:", property.description) || property.description;
  const newAddress = prompt("Адрес:", property.address) || property.address;
  const newCity = prompt("Город:", property.city) || property.city;
  const newCountry = prompt("Страна:", property.country) || property.country;
  const newPrice = parseFloat(prompt("Цена за ночь (BYN):", property.price_per_night) || property.price_per_night);
  const newMaxGuests = parseInt(prompt("Макс. гостей:", property.max_guests) || property.max_guests);
  const newStatus = prompt("Статус (active/inactive):", property.status) || property.status;

  try {
    const res = await fetch(`${api}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        address: newAddress,
        city: newCity,
        country: newCountry,
        price_per_night: newPrice,
        max_guests: newMaxGuests,
        status: newStatus
      })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Ошибка обновления объекта");

    loadProperties();
  } catch (err) {
    console.error(err);
    alert("Ошибка сети при обновлении объекта");
  }
}


loadProperties();
