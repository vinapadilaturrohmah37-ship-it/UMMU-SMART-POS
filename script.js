
document.addEventListener("DOMContentLoaded", function () {

    const loginPage = document.getElementById("loginPage");
    const dashboardPage = document.getElementById("dashboardPage");
    const loginForm = document.getElementById("loginForm");
    const contentArea = document.getElementById("contentArea");

    let roleAktif = "";
    let produk = [
        { id: 1, nama: "Buku Tulis", harga: 5000, stok: 20 },
        { id: 2, nama: "Pulpen", harga: 3000, stok: 30 },
        { id: 3, nama: "Pensil", harga: 2500, stok: 25 },
        { id: 4, nama: "Penghapus", harga: 2000, stok: 15 },
        { id: 5, nama: "Penggaris", harga: 4000, stok: 10 }
    ];

    let keranjang = [];
    let laporan = [];

    const rupiah = angka =>
        "Rp " + angka.toLocaleString("id-ID");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        const valid =
            (role === "admin" && username === "admin" && password === "12345") ||
            (role === "pelanggan" && username === "pelanggan" && password === "12345");

        if (!valid) {
            alert("Username atau password salah!");
            return;
        }

        roleAktif = role;
        loginPage.style.display = "none";
        dashboardPage.style.display = "block";

        document.getElementById("userInfo").textContent =
            role === "admin" ? "Admin" : "Pelanggan";

        document.getElementById("adminArea").style.display =
            role === "admin" ? "block" : "none";

        document.getElementById("customerArea").style.display =
            role === "pelanggan" ? "block" : "none";

        updateDashboard();

        if (role === "admin") {
            contentArea.innerHTML =
                "<h3>Dashboard Admin</h3><p>Selamat bekerja! Kelola produk dan transaksi di sini.</p>";
        } else {
            tampilkanKatalog();
        }
    });

    window.logout = function() {
        dashboardPage.style.display = "none";
        loginPage.style.display = "flex";
        loginForm.reset();
        keranjang = [];
        roleAktif = "";
    };

    window.showMenu = function(menu) {
        if (menu === "produk" && roleAktif === "admin") tampilkanProduk();
        if (menu === "transaksi") tampilkanTransaksi();
        if (menu === "laporan" && roleAktif === "admin") tampilkanLaporan();
    };

    function updateDashboard() {
        document.getElementById("jumlahProduk").textContent = produk.length;
        document.getElementById("totalTransaksi").textContent = laporan.length;

        const total = laporan.reduce((sum, item) => sum + item.total, 0);
        document.getElementById("totalPenjualan").textContent = rupiah(total);
    }

    function tampilkanProduk() {
        contentArea.innerHTML = `
            <h3>DATA PRODUK</h3>

            <div class="form-produk">
                <input id="namaProduk" placeholder="Nama barang">
                <input id="hargaProduk" type="number" min="1" placeholder="Harga barang">
                <input id="stokProduk" type="number" min="0" placeholder="Jumlah stok">
                <button onclick="tambahProduk()">Tambah Produk</button>
            </div>

            <h3>Daftar Barang Dijual</h3>
            <table>
                <thead>
                    <tr>
                        <th>No</th><th>Nama Barang</th>
                        <th>Harga</th><th>Stok</th><th>Aksi</th>
                    </tr>
                </thead>
                <tbody id="daftarProduk"></tbody>
            </table>
        `;

        renderProduk();
    }

    window.tambahProduk = function() {
        const nama = document.getElementById("namaProduk").value.trim();
        const hargaInput = document.getElementById("hargaProduk").value;
        const stokInput = document.getElementById("stokProduk").value;
        const harga = Number(hargaInput);
        const stok = Number(stokInput);

        if (!nama || hargaInput === "" || stokInput === "" ||
            !Number.isFinite(harga) || harga <= 0 ||
            !Number.isInteger(stok) || stok < 0) {
            alert("Isi nama, harga, dan stok dengan benar!");
            return;
        }

        produk.push({
            id: Date.now(),
            nama: nama,
            harga: harga,
            stok: stok
        });

        tampilkanProduk();
        updateDashboard();
        alert("Produk berhasil ditambahkan!");
    };

    window.hapusProduk = function(id) {
        produk = produk.filter(item => item.id !== id);
        tampilkanProduk();
        updateDashboard();
    };

    function renderProduk() {
        const daftar = document.getElementById("daftarProduk");
        daftar.innerHTML = "";

        produk.forEach((item, index) => {
            daftar.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${escapeHTML(item.nama)}</td>
                    <td>${rupiah(item.harga)}</td>
                    <td>${item.stok}</td>
                    <td><button class="danger" onclick="hapusProduk(${item.id})">Hapus</button></td>
                </tr>
            `;
        });
    }

    function tampilkanKatalog() {
        contentArea.innerHTML = `
            <h3>BARANG YANG DIJUAL</h3>
            <p>Pilih barang untuk dimasukkan ke keranjang.</p>
            <div class="product-grid" id="katalogProduk"></div>
            <button onclick="tampilkanTransaksi()">Lihat Keranjang Belanja</button>
        `;

        const katalog = document.getElementById("katalogProduk");

        produk.forEach(item => {
            katalog.innerHTML += `
                <div class="product-card">
                    <h4>${escapeHTML(item.nama)}</h4>
                    <p>Harga: <b>${rupiah(item.harga)}</b></p>
                    <p>Stok: ${item.stok}</p>
                    <button onclick="tambahKeranjang(${item.id})"
                        ${item.stok === 0 ? "disabled" : ""}>
                        Tambah ke Keranjang
                    </button>
                </div>
            `;
        });
    }

    window.tambahKeranjang = function(id) {
        const item = produk.find(p => p.id === id);
        if (!item || item.stok <= 0) {
            alert("Stok barang habis!");
            return;
        }

        const ada = keranjang.find(p => p.id === id);

        const jumlahDalamKeranjang = ada ? ada.jumlah : 0;

        if (jumlahDalamKeranjang >= item.stok) {
            alert("Jumlah melebihi stok!");
            return;
        }

        if (ada) {
            ada.jumlah++;
        } else {
            keranjang.push({
                id: item.id,
                nama: item.nama,
                harga: item.harga,
                jumlah: 1
            });
        }

        tampilkanKatalog();
        alert("Barang masuk keranjang!");
    };

    function tampilkanTransaksi() {
        contentArea.innerHTML = `
            <h3>KERANJANG BELANJA</h3>
            <table>
                <thead>
                    <tr><th>Barang</th><th>Harga</th><th>Jumlah</th><th>Subtotal</th><th>Aksi</th></tr>
                </thead>
                <tbody id="isiKeranjang"></tbody>
            </table>

            <div class="total-box">
                <h3 id="totalBelanja">Total: Rp 0</h3>
                <div class="form-bayar">
                    <input id="uangBayar" type="number" min="0" placeholder="Uang pembayaran">
                    <button onclick="hitungKembalian()">Hitung Kembalian</button>
                </div>
                <h3 id="hasilKembalian">Kembalian: Rp 0</h3>
                <button onclick="selesaikanTransaksi()">Selesaikan Transaksi</button>
            </div>
        `;

        renderKeranjang();
    }

    function renderKeranjang() {
        const isi = document.getElementById("isiKeranjang");
        isi.innerHTML = "";

        keranjang.forEach(item => {
            isi.innerHTML += `
                <tr>
                    <td>${escapeHTML(item.nama)}</td>
                    <td>${rupiah(item.harga)}</td>
                    <td>${item.jumlah}</td>
                    <td>${rupiah(item.harga * item.jumlah)}</td>
                    <td><button class="danger" onclick="hapusKeranjang(${item.id})">Hapus</button></td>
                </tr>
            `;
        });

        const total = keranjang.reduce(
            (sum, item) => sum + item.harga * item.jumlah, 0
        );

        document.getElementById("totalBelanja").textContent =
            "Total: " + rupiah(total);
    }

    window.hapusKeranjang = function(id) {
        keranjang = keranjang.filter(item => item.id !== id);
        tampilkanTransaksi();
    };

    window.hitungKembalian = function() {
        const total = keranjang.reduce(
            (sum, item) => sum + item.harga * item.jumlah, 0
        );

        const bayar = Number(document.getElementById("uangBayar").value);

        if (!Number.isFinite(bayar) || bayar < total) {
            alert("Uang pembayaran belum mencukupi!");
            return;
        }

        document.getElementById("hasilKembalian").textContent =
            "Kembalian: " + rupiah(bayar - total);
    };

    window.selesaikanTransaksi = function() {
        if (keranjang.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }

        const total = keranjang.reduce(
            (sum, item) => sum + item.harga * item.jumlah, 0
        );

        const bayarInput = document.getElementById("uangBayar").value;
        const bayar = Number(bayarInput);

        if (bayarInput === "" || !Number.isFinite(bayar) || bayar < total) {
            alert("Masukkan pembayaran yang cukup terlebih dahulu!");
            return;
        }

        for (const belanja of keranjang) {
            const barang = produk.find(p => p.id === belanja.id);
            if (!barang || barang.stok < belanja.jumlah) {
                alert("Stok " + belanja.nama + " tidak mencukupi!");
                return;
            }
        }

        keranjang.forEach(belanja => {
            const barang = produk.find(p => p.id === belanja.id);
            barang.stok -= belanja.jumlah;
        });

        laporan.push({
            tanggal: new Date().toLocaleString("id-ID"),
            total: total,
            bayar: bayar
        });

        const kembalian = bayar - total;
        keranjang = [];

        updateDashboard();

        contentArea.innerHTML = `
            <h3>TRANSAKSI BERHASIL!</h3>
            <p>Total Belanja: <b>${rupiah(total)}</b></p>
            <p>Uang Bayar: ${rupiah(bayar)}</p>
            <p>Kembalian: ${rupiah(kembalian)}</p>
            <p>Terima kasih sudah berbelanja.</p>
            <button onclick="showMenu('transaksi')">Transaksi Baru</button>
            <button onclick="kembaliKatalog()">Kembali Belanja</button>
        `;
    };

    window.kembaliKatalog = function() {
        tampilkanKatalog();
    };

    function tampilkanLaporan() {
        contentArea.innerHTML = `
            <h3>LAPORAN PENJUALAN</h3>
            <table>
                <thead>
                    <tr><th>No</th><th>Tanggal</th><th>Total Penjualan</th><th>Uang Bayar</th></tr>
                </thead>
                <tbody id="daftarLaporan"></tbody>
            </table>
        `;

        const daftar = document.getElementById("daftarLaporan");

        laporan.forEach((item, index) => {
            daftar.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.tanggal}</td>
                    <td>${rupiah(item.total)}</td>
                    <td>${rupiah(item.bayar)}</td>
                </tr>
            `;
        });

        if (laporan.length === 0) {
            daftar.innerHTML = "<tr><td colspan='4'>Belum ada penjualan.</td></tr>";
        }
    }

    function escapeHTML(teks) {
        return String(teks).replace(/[&<>"']/g, function(huruf) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[huruf];
        });
    }

});

