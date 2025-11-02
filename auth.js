const api = "http://localhost:3000/api/auth";


document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const first_name = document.getElementById("first_name").value.trim();
  const last_name = document.getElementById("last_name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone_number = document.getElementById("phone_number").value.trim();
  const password = document.getElementById("password").value.trim();
  const roleValue = document.getElementById("role").value;

  const roleMap = { tenant: 'guest', landlord: 'host' };
  const apiRole = roleMap[roleValue];
  if (!apiRole) return alert("Выберите роль!");

  try {
    const res = await fetch(`${api}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, email, phone_number, password, role: apiRole }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || "Ошибка регистрации");

    alert("Регистрация успешна! Теперь войдите.");
    window.location.href = "login.html";
  } catch (err) {
    console.error(err);
    alert("Ошибка сети при регистрации");
  }
});


document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) return alert("Заполните все поля!");

  try {
    const res = await fetch(`${api}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || "Ошибка входа");

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("user_id", data.user.user_id);
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error(err);
    alert("Ошибка сети при входе");
  }
});
