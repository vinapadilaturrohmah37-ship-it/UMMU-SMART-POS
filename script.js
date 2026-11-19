


/* =====================================
   UMMU SMART POS
   SISTEM KASIR PINTAR
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    // DATA APLIKASI
    let produk = [];
    let riwayatTransaksi = [];
    let totalPenjualan = 0;
    let totalTransaksi = 0;

    // ELEMEN HTML
    const loginPage = document.getElementById("loginPage");
    const dashboardPage = document.getElementById("dashboardPage");
    const loginForm = document.getElementById("loginForm");
    const contentArea = document.getElementById("contentArea");

    // CEK ELEMEN HTML
    if (!loginPage || !dashboardPage || !loginForm || !contentArea) {
        console.error("Elemen HTML tidak ditemukan. Periksa index.html!");
        alert("Terjadi kesalahan. Periksa struktur index.html!");
        return;
    }

    // FORMAT RUPIAH
    function rupiah(angka) {
        return "Rp " + Number(angka).toLocaleString("id-ID");
    }

    // =====================================
    // 1. LOGIN
    // =====================================

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (username === "admin" && password === "12345") {

            loginPage.style.display = "none";
            dashboardPage.style.display = "block";

            updateDashboard();

            contentArea.innerHTML = `
                <h3>Selamat Datang di UMMU SMART POS!</h3>
                <p>Login berhasil. Silakan pilih menu kasir.</p>
            `;

            alert("Login berhasil!");

        } else {

            alert("Username atau password salah!");

        }

    });

    // =====================================
    // 2. LOGOUT
    // =====================================

    window.logout = function () {

        const konfirmasi = confirm("Apakah Anda yakin ingin logout?");

        if (konfirmasi) {

            dashboardPage.style.display = "none";
            loginPage.style.display = "flex";

            loginForm.reset();

        }

    };

    // =====================================
    // 3. DASHBOARD
    // =====================================

    function updateDashboard() {

        document.getElementById("totalPenjualan").textContent =
            rupiah(totalPenjualan);

        document.getElementById("totalTransaksi").textContent =
            totalTransaksi;

        document.getElementById("jumlahProduk").textContent =
            produk.length;

    }

    // =====================================
    // 4. MENU UTAMA
    // =====================================

    window.showMenu = function (menu) {

        if (menu === "produk") {
            menuProduk();
        }

        else if (menu === "transaksi") {
            menuTransaksi();
        }

        else if (menu === "laporan") {
            menuLaporan();
        }

        else {
            contentArea.innerHTML = "<h3>Menu tidak ditemukan</h3>";
        }

    };

    // =====================================
    // 5. MENU DATA PRODUK
    // =====================================

    function menuProduk() {

        contentArea.innerHTML = `
            <h3>DATA PRODUK</h3>

            <div>
                <input type="text" id="namaProduk"
                    placeholder="Nama produk">

                <input type="number" id="hargaProduk"
                    placeholder="Harga produk" min="1">

                <input type="number" id="stokProduk"
                    placeholder="Stok produk" min="1">

                <button onclick="tambahProduk()">
                    TAMBAH PRODUK
                </button>
            </div>

            <div id="daftarProduk"></div>
        `;

        tampilProduk();

    }

    // TAMBAH PRODUK
    window.tambahProduk = function () {

        const nama = document.getElementById("namaProduk").value.trim();
        const harga = Number(document.getElementById("hargaProduk").value);
        const stok = Number(document.getElementById("stokProduk").value);

        if (nama === "" || !Number.isFinite(harga) ||
            !Number.isInteger(stok) || harga <= 0 || stok <= 0) {

            alert("Isi semua data produk dengan benar!");
            return;

        }

        produk.push({
            id: Date.now(),
            nama: nama,
            harga: harga,
            stok: stok
        });

        alert("Produk berhasil ditambahkan!");

        updateDashboard();
        menuProduk();

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
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Produk</th>
                        <th>Harga</th>
                        <th>Stok</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
        `;

        produk.forEach(function (item, index) {

            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.nama}</td>
                    <td>${rupiah(item.harga)}</td>
                    <td>${item.stok}</td>
                    <td>
                        <button onclick="hapusProduk(${item.id})">
                            Hapus
                        </button>
                    </td>
                </tr>
            `;

        });

        html += `
                </tbody>
            </table>
        `;

        daftar.innerHTML = html;

    }

    // HAPUS PRODUK
    window.hapusProduk = function (id) {

        if (confirm("Hapus produk ini?")) {

            produk = produk.filter(function (item) {
                return item.id !== id;
            });

            updateDashboard();
            menuProduk();

        }

    };

    // =====================================
    // 6. MENU TRANSAKSI
    // =====================================

    function menuTransaksi() {

        let pilihanProduk = "";

        produk.forEach(function (item, index) {

            pilihanProduk += `
                <option value="${index}">
                    ${item.nama} - ${rupiah(item.harga)}
                    (Stok: ${item.stok})
                </option>
            `;

        });

        contentArea.innerHTML = `
            <h3>TRANSAKSI KASIR</h3>

            <label>Pilih Produk</label>

            <select id="pilihProduk">
                <option value="">-- Pilih Produk --</option>
                ${pilihanProduk}
            </select>

            <br><br>

            <label>Jumlah Beli</label>

            <input type="number" id="jumlahBeli"
                min="1" placeholder="Jumlah">

            <br><br>

            <button onclick="beliProduk()">
                PROSES PEMBELIAN
            </button>

            <h3 id="hasilTransaksi">Total: Rp 0</h3>
        `;

    }

    // PROSES PEMBELIAN
    window.beliProduk = function () {

        const pilihan = document.getElementById("pilihProduk").value;
        const jumlah = Number(document.getElementById("jumlahBeli").value);

        if (pilihan === "" || !Number.isInteger(jumlah) || jumlah <= 0) {

            alert("Pilih produk dan jumlah pembelian!");
            return;

        }

        const index = Number(pilihan);
        const item = produk[index];

        if (!item) {
            alert("Produk tidak ditemukan!");
            return;
        }

        if (jumlah > item.stok) {

            alert("Stok produk tidak mencukupi!");
            return;

        }

        const total = item.harga * jumlah;

        item.stok -= jumlah;

        totalPenjualan += total;
        totalTransaksi++;

        riwayatTransaksi.push({
            nama: item.nama,
            jumlah: jumlah,
            total: total,
            tanggal: new Date().toLocaleString("id-ID")
        });

        updateDashboard();

        contentArea.innerHTML = `
            <h3>TRANSAKSI BERHASIL!</h3>

            <p>Produk: ${item.nama}</p>
            <p>Jumlah: ${jumlah}</p>
            <p>Harga satuan: ${rupiah(item.harga)}</p>

            <h2>Total: ${rupiah(total)}</h2>

            <button onclick="showMenu('transaksi')">
                TRANSAKSI BARU
            </button>

            <button onclick="showMenu('laporan')">
                LIHAT LAPORAN
            </button>
        `;

        alert("Transaksi berhasil disimpan!");

    };

    // =====================================
    // 7. MENU LAPORAN
    // =====================================

    function menuLaporan() {

        let html = `
            <h3>LAPORAN PENJUALAN</h3>

            <h4>Total Penjualan: ${rupiah(totalPenjualan)}</h4>

            <h4>Total Transaksi: ${totalTransaksi}</h4>

            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Produk</th>
                        <th>Jumlah</th>
                        <th>Total</th>
                        <th>Tanggal</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (riwayatTransaksi.length === 0) {

            html += `
                <tr>
                    <td colspan="5">Belum ada transaksi.</td>
                </tr>
            `;

        } else {

            riwayatTransaksi.forEach(function (item, index) {

                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.nama}</td>
                        <td>${item.jumlah}</td>
                        <td>${rupiah(item.total)}</td>
                        <td>${item.tanggal}</td>
                    </tr>
                `;

            });

        }

        html += `
                </tbody>
            </table>

            <br>

            <button onclick="window.print()">
                CETAK LAPORAN
            </button>
        `;

        contentArea.innerHTML = html;

    }

    // =====================================
    // 8. TAMPILAN AWAL
    // =====================================

    updateDashboard();

    console.log("UMMU SMART POS berhasil dijalankan!");

});

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
