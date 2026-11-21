
// ==================================
// UMMU SMART POS
// SISTEM LOGIN DAN DASHBOARD
// ==================================

let selectedRole = "admin";

// DATA LOGIN DEMO
// Ganti dengan sistem autentikasi server sebelum digunakan sungguhan.
const accounts = {
    admin: {
        username: "admin",
        password: "admin123",
        name: "Administrator"
    },

    customer: {
        username: "pelanggan",
        password: "user123",
        name: "Pelanggan UMMU"
    }
};

// PILIH ROLE LOGIN
function selectRole(role, button) {
    selectedRole = role;

    document.querySelectorAll(".role-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    document.getElementById("loginInfo").textContent =
        role === "admin"
            ? "Login sebagai Admin"
            : "Login sebagai Pelanggan";
}

// PROSES LOGIN DEMO
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const account = accounts[selectedRole];

    if (
        username === account.username &&
        password === account.password
    ) {
        document.getElementById("loginPage").hidden = true;
        document.getElementById("dashboardPage").hidden = false;

        document.getElementById("profileName").textContent = account.name;

        document.getElementById("welcomeTitle").textContent =
            selectedRole === "admin"
                ? "Dashboard Admin"
                : "Dashboard Pelanggan";

        document.getElementById("dashboardSection").hidden = false;

        // Menu tertentu hanya untuk admin pada tahap demo ini.
        document.querySelectorAll(".menu-btn").forEach(button => {
            button.hidden = selectedRole === "customer" &&
                !button.textContent.includes("Dashboard") &&
                !button.textContent.includes("Transaksi");
        });

        alert("Login berhasil! Selamat datang di UMMU SMART POS.");
    } else {
        alert("Username atau password salah!");
    }
});

// PINDAH HALAMAN
function showPage(page) {
    const sections = {
        dashboard: "dashboardSection",
        products: "productsSection",
        transactions: "transactionsSection",
        reports: "reportsSection"
    };

    Object.values(sections).forEach(id => {
        document.getElementById(id).hidden = true;
    });

    if (sections[page]) {
        document.getElementById(sections[page]).hidden = false;
    }

    document.getElementById("welcomeTitle").textContent =
        page.charAt(0).toUpperCase() + page.slice(1);

    document.querySelectorAll(".menu-btn").forEach(button => {
        button.classList.remove("active");
    });

    const activeButton = [...document.querySelectorAll(".menu-btn")]
        .find(button => button.getAttribute("onclick") === `showPage('${page}')`);

    if (activeButton) {
        activeButton.classList.add("active");
    }
}

// LOGOUT
function logout() {
    const confirmLogout = confirm("Apakah kamu yakin ingin keluar?");

    if (confirmLogout) {
        document.getElementById("dashboardPage").hidden = true;
        document.getElementById("loginPage").hidden = false;

        document.getElementById("loginForm").reset();

        document.getElementById("username").value = "";
        document.getElementById("password").value = "";

        document.querySelectorAll(".menu-btn").forEach(button => {
            button.hidden = false;
            button.classList.remove("active");
        });

        document.querySelectorAll(".role-btn").forEach(button => {
            button.classList.remove("active");
        });

        selectedRole = "admin";

        document.querySelector(".role-btn").classList.add("active");

        document.getElementById("loginInfo").textContent =
            "Login sebagai Admin";

        alert("Kamu berhasil logout.");
    }
}
