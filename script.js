
// =================================
// LOGIN UMMU SMART POS
// =================================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // AKUN ADMIN
    if (username === "admin" && password === "12345") {

        // Sembunyikan halaman login
        document.getElementById("loginPage").style.display = "none";

        // Tampilkan dashboard
        document.getElementById("dashboardPage").style.display = "block";

        alert("Login Berhasil! Selamat Datang di UMMU SMART POS");

    } else {

        alert("Username atau Password Salah!");

    }
});


// =================================
// LOGOUT UMMU SMART POS
// =================================

function logout() {

    const konfirmasi = confirm("Apakah Anda yakin ingin keluar?");

    if (konfirmasi) {

        // Sembunyikan dashboard
        document.getElementById("dashboardPage").style.display = "none";

        // Tampilkan login
        document.getElementById("loginPage").style.display = "flex";

        // Kosongkan form login
        document.getElementById("loginForm").reset();

        alert("Anda berhasil logout!");

    }
}
