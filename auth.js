const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const msg = document.getElementById("msg");

function showMsg(text, type = "ok") {
  msg.innerText = text;
  msg.style.color = type === "error" ? "red" : "lightgreen";
}

function showLogin() {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
}

function showRegister() {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
}

/* REJESTRACJA */
async function register(e) {
  e.preventDefault();

  const name = e.target[0].value;
  const email = e.target[1].value;
  const password = e.target[2].value;

  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await user.updateProfile({ displayName: name });

    showMsg("Konto utworzone! Możesz się zalogować.");
    showLogin();
  } catch (error) {
    showMsg(error.message, "error");
  }
}

/* LOGOWANIE */
async function login(e) {
  e.preventDefault();

  const email = e.target[0].value;
  const password = e.target[1].value;

  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    showDashboard(user);
  } catch (error) {
    showMsg("Błędne dane lub konto nie istnieje", "error");
  }
}

/* PANEL KLIENTA */
function showDashboard(user) {
  const name = user.displayName || user.email;

  document.getElementById("login").innerHTML = `
    <div class="container dashboard">
      <h2>Witaj ${name} 👋</h2>

      <div class="panel">
        <p>Twoje usługi:</p>
        <ul>
          <li>Hosting PRO</li>
          <li>Domena: twojadomena.pl</li>
        </ul>

        <button class="btn" onclick="logout()">Wyloguj</button>
      </div>
    </div>
  `;
}

/* WYLOGOWANIE */
function logout() {
  firebase.auth().signOut().then(() => {
    location.reload();
  });
}

/* AUTOMATYCZNE LOGOWANIE JEŚLI SESJA ISTNIEJE */
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    showDashboard(user);
  }
});
