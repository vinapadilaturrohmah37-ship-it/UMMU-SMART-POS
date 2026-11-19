
document.addEventListener("DOMContentLoaded", function () {

    const loginPage = document.getElementById("loginPage");
    const dashboardPage = document.getElementById("dashboardPage");
    const loginForm = document.getElementById("loginForm");
    const contentArea = document.getElementById("contentArea");

    if (!loginPage || !dashboardPage || !loginForm || !contentArea) {
        alert("Ada bagian HTML yang belum lengkap. Periksa index.html.");
        return;
    }

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (username === "admin" && password === "12345") {
            loginPage.style.display = "none";
            dashboardPage.style.display = "block";

            contentArea.innerHTML = `
                <h3>Login Berhasil!</h3>
                <p>Selamat datang di UMMU SMART POS.</p>
                <p>Silakan pilih menu di atas.</p>
            `;

            updateDashboard();
        } else {
            alert("Username atau password salah!");
        }
    });

    window.logout = function() {
        dashboardPage.style.display = "none";
        loginPage.style.display = "flex";
        loginForm.reset();
    };

    window.showMenu = function(menu) {
        if (menu === "produk") {
            contentArea.innerHTML = `
                <h3>Data Produk</h3>
                <p>Halaman pengelolaan produk akan dibuat berikutnya.</p>
            `;
        }

        if (menu === "transaksi") {
            contentArea.innerHTML = `
                <h3>Transaksi</h3>
                <p>Halaman transaksi kasir akan dibuat berikutnya.</p>
            `;
        }

        if (menu === "laporan") {
            contentArea.innerHTML = `
                <h3>Laporan Penjualan</h3>
                <p>Halaman laporan penjualan akan dibuat berikutnya.</p>
            `;
        }
    };

    function updateDashboard() {
        document.getElementById("totalPenjualan").textContent = "Rp 0";
        document.getElementById("totalTransaksi").textContent = "0";
        document.getElementById("jumlahProduk").textContent = "0";
    }

});




