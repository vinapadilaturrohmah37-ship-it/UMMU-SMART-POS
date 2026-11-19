

document.addEventListener("DOMContentLoaded", function () {

    // DATA APLIKASI
    let produk = [];
    let totalPenjualan = 0;
    let totalTransaksi = 0;

    // LOGIN
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username === "admin" && password === "12345") {

            document.getElementById("loginPage").style.display = "none";
            document.getElementById("dashboardPage").style.display = "block";

            alert("Login berhasil! Selamat datang di UMMU SMART POS");

            updateDashboard();

        } else {
            alert("Username atau password salah!");
        }
    });

    // LOGOUT
    window.logout = function () {

        if (confirm("Apakah Anda yakin ingin keluar?")) {

            document.getElementById("dashboardPage").style.display = "none";
            document.getElementById("loginPage").style.display = "flex";

            loginForm.reset();

        }
    };

    // FORMAT RUPIAH
    function rupiah(angka) {
        return "Rp" + Number(angka).toLocaleString("id-ID");
    }

    // UPDATE DASHBOARD
    function updateDashboard() {

        document.getElementById("totalPenjualan").textContent =
            rupiah(totalPenjualan);

        document.getElementById("totalTransaksi").textContent =
            totalTransaksi;

        document.getElementById("jumlahProduk").textContent =
            produk.length;
    }

    // MEMBUKA MENU
    window.showMenu = function (menu) {

        const area = document.getElementById("contentArea");

        if (menu === "produk") {

            area.innerHTML = `
                <h3>DATA PRODUK</h3>

                <input type="text" id="namaProduk"
                    placeholder="Nama produk">

                <input type="number" id="hargaProduk"
                    placeholder="Harga produk">

                <input type="number" id="stokProduk"
                    placeholder="Stok produk">

                <button onclick="tambahProduk()">
                    Tambah Produk
                </button>

                <div id="daftarProduk"></div>
            `;

            tampilProduk();
        }

        else if (menu === "transaksi") {

            area.innerHTML = `
                <h3>TRANSAKSI KASIR</h3>

                <label>Pilih Produk</label>

                <select id="pilihProduk">
                    <option value="">Pilih produk</option>
                </select>

                <input type="number" id="jumlahBeli"
                    placeholder="Jumlah beli" min="1">

                <button onclick="beliProduk()">
                    Proses Pembelian
                </button>

                <h3 id="hasilTransaksi">Total: Rp0</h3>
            `;

            const pilihan = document.getElementById("pilihProduk");

            produk.forEach(function (item, index) {
                pilihan.innerHTML += `
                    <option value="${index}">
                        ${item.nama} - ${rupiah(item.harga)}
                    </option>
                `;
            });
        }

        else if (menu === "laporan") {

            area.innerHTML = `
                <h3>LAPORAN PENJUALAN</h3>
                <p>Total Penjualan: ${rupiah(totalPenjualan)}</p>
                <p>Total Transaksi: ${totalTransaksi}</p>
                <button onclick="showMenu('produk')">
                    Kembali ke Produk
                </button>
            `;
        }
    };

    // TAMBAH PRODUK
    window.tambahProduk = function () {

        const nama = document.getElementById("namaProduk").value;
        const harga = Number(document.getElementById("hargaProduk").value);
        const stok = Number(document.getElementById("stokProduk").value);

        if (nama.trim() === "" || harga <= 0 || stok <= 0 ||
            !Number.isInteger(stok)) {
            alert("Masukkan nama, harga, dan stok yang benar!");
            return;
        }

        produk.push({
            nama: nama,
            harga: harga,
            stok: stok
        });

        alert("Produk berhasil ditambahkan!");

        updateDashboard();
        showMenu("produk");
    };

    // TAMPIL PRODUK
    function tampilProduk() {

        const daftar = document.getElementById("daftarProduk");

        if (produk.length === 0) {
            daftar.innerHTML = "<p>Belum ada produk.</p>";
            return;
        }

        let html = `
            <table>
                <tr>
                    <th>Nama</th>
                    <th>Harga</th>
                    <th>Stok</th>
                </tr>
        `;

        produk.forEach(function (item) {
            html += `
                <tr>
                    <td>${item.nama}</td>
                    <td>${rupiah(item.harga)}</td>
                    <td>${item.stok}</td>
                </tr>
            `;
        });

        html += "</table>";

        daftar.innerHTML = html;
    }

    // TRANSAKSI PEMBELIAN
    window.beliProduk = function () {

        const index = document.getElementById("pilihProduk").value;
        const jumlah = Number(document.getElementById("jumlahBeli").value);

        if (index === "" || !Number.isInteger(jumlah) || jumlah <= 0) {
            alert("Pilih produk dan masukkan jumlah pembelian!");
            return;
        }

        const item = produk[Number(index)];

        if (jumlah > item.stok) {
            alert("Stok produk tidak mencukupi!");
            return;
        }

        const total = item.harga * jumlah;

        item.stok -= jumlah;
        totalPenjualan += total;
        totalTransaksi++;

        document.getElementById("hasilTransaksi").textContent =
            "Total: " + rupiah(total);

        alert("Transaksi berhasil!\nTotal: " + rupiah(total));

        updateDashboard();

        showMenu("transaksi");
    };

    // TAMPILAN AWAL
    updateDashboard();

});
