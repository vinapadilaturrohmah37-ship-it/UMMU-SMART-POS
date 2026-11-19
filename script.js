
document.addEventListener("DOMContentLoaded", function () {

    const loginPage = document.getElementById("loginPage");
    const dashboardPage = document.getElementById("dashboardPage");
    const loginForm = document.getElementById("loginForm");
    const contentArea = document.getElementById("contentArea");

    let produk = [];

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (username === "admin" && password === "12345") {
            loginPage.style.display = "none";
            dashboardPage.style.display = "block";
            updateDashboard();

            contentArea.innerHTML = `
                <h3>Selamat Datang di UMMU SMART POS!</h3>
                <p>Silakan pilih menu untuk memulai.</p>
            `;
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
            tampilkanProduk();
        }

        if (menu === "transaksi") {
            contentArea.innerHTML = `
                <h3>Transaksi</h3>
                <p>Fitur transaksi akan kita buat setelah data produk selesai.</p>
            `;
        }

        if (menu === "laporan") {
            contentArea.innerHTML = `
                <h3>Laporan Penjualan</h3>
                <p>Belum ada transaksi.</p>
            `;
        }
    };

    function tampilkanProduk() {
        contentArea.innerHTML = `
            <h3>DATA PRODUK</h3>

            <div class="form-produk">
                <input type="text" id="namaProduk" placeholder="Nama Produk">
                <input type="number" id="hargaProduk" placeholder="Harga Produk">
                <input type="number" id="stokProduk" placeholder="Stok Produk">
                <button onclick="tambahProduk()">SIMPAN PRODUK</button>
            </div>

            <h3>Daftar Produk</h3>

            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Produk</th>
                        <th>Harga</th>
                        <th>Stok</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody id="daftarProduk"></tbody>
            </table>
        `;

        renderProduk();
    }

    window.tambahProduk = function() {
        const nama = document.getElementById("namaProduk").value.trim();
        const harga = Number(document.getElementById("hargaProduk").value);
        const stok = Number(document.getElementById("stokProduk").value);

        if (!nama || harga <= 0 || stok < 0 ||
            document.getElementById("hargaProduk").value === "" ||
            document.getElementById("stokProduk").value === "") {
            alert("Mohon isi nama, harga, dan stok dengan benar!");
            return;
        }

        produk.push({
            nama: nama,
            harga: harga,
            stok: stok
        });

        tampilkanProduk();
        updateDashboard();

        alert("Produk berhasil ditambahkan!");
    };

    window.hapusProduk = function(index) {
        produk.splice(index, 1);
        renderProduk();
        updateDashboard();
    };

    function renderProduk() {
        const daftar = document.getElementById("daftarProduk");

        if (!daftar) return;

        daftar.innerHTML = "";

        produk.forEach(function(item, index) {
            daftar.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${escapeHTML(item.nama)}</td>
                    <td>${item.harga.toLocaleString("id-ID")}</td>
                    <td>${item.stok}</td>
                    <td>
                        <button onclick="hapusProduk(${index})">Hapus</button>
                    </td>
                </tr>
            `;
        });
    }

    function escapeHTML(teks) {
        return teks.replace(/[&<>"']/g, function(huruf) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[huruf];
        });
    }

    function updateDashboard() {
        document.getElementById("jumlahProduk").textContent = produk.length;
    }

});




