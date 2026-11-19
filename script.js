
document.addEventListener("DOMContentLoaded", function () {

    const loginPage = document.getElementById("loginPage");
    const dashboardPage = document.getElementById("dashboardPage");
    const loginForm = document.getElementById("loginForm");
    const contentArea = document.getElementById("contentArea");

    let roleAktif = "";

    function bacaData(kunci, nilaiAwal) {
        try {
            const data = localStorage.getItem(kunci);
            return data ? JSON.parse(data) : nilaiAwal;
        } catch {
            return nilaiAwal;
        }
    }

    let produk = bacaData("ummu_produk", [
        {id: 1, nama: "Buku Tulis", harga: 5000, stok: 20},
        {id: 2, nama: "Pulpen", harga: 3000, stok: 30},
        {id: 3, nama: "Pensil", harga: 2500, stok: 25},
        {id: 4, nama: "Penghapus", harga: 2000, stok: 15},
        {id: 5, nama: "Penggaris", harga: 4000, stok: 10}
    ]);

    let laporan = bacaData("ummu_laporan", []);
    let keranjang = [];

    function simpanData() {
        localStorage.setItem("ummu_produk", JSON.stringify(produk));
        localStorage.setItem("ummu_laporan", JSON.stringify(laporan));
    }

    function rupiah(angka) {
        return "Rp " + Number(angka).toLocaleString("id-ID");
    }

    function aman(teks) {
        return String(teks).replace(/[&<>"']/g, function(c) {
            return {
                "&": "&amp;", "<": "&lt;", ">": "&gt;",
                '"': "&quot;", "'": "&#039;"
            }[c];
        });
    }

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const role = document.getElementById("role").value;
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        const benar =
            (role === "admin" && username === "admin" && password === "12345") ||
            (role === "pelanggan" && username === "pelanggan" && password === "12345");

        if (!benar) {
            alert("Username atau password salah!");
            return;
        }

        roleAktif = role;
        keranjang = [];

        loginPage.style.display = "none";
        dashboardPage.style.display = "flex";

        document.getElementById("userInfo").textContent =
            role === "admin" ? "Admin" : "Pelanggan";

        document.getElementById("adminMenu").style.display =
            role === "admin" ? "block" : "none";

        document.getElementById("customerMenu").style.display =
            role === "pelanggan" ? "block" : "none";

        if (role === "admin") {
            dashboard();
        } else {
            katalog();
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
        if (menu === "dashboard" && roleAktif === "admin") dashboard();
        if (menu === "produk" && roleAktif === "admin") halamanProduk();
        if (menu === "belanja" && roleAktif === "pelanggan") katalog();
        if (menu === "transaksi") halamanTransaksi();
        if (menu === "laporan" && roleAktif === "admin") halamanLaporan();
        if (menu === "riwayat" && roleAktif === "pelanggan") riwayatPelanggan();
    };

    function dashboard() {
        const total = laporan.reduce((a, b) => a + b.total, 0);

        contentArea.innerHTML = `
            <div class="page-title">
                <h2>Dashboard Admin</h2>
                <p>Ringkasan aktivitas UMMU SMART POS</p>
            </div>

            <div class="stats">
                <div class="stat-card">
                    <p>Total Penjualan</p>
                    <h2>${rupiah(total)}</h2>
                </div>
                <div class="stat-card">
                    <p>Total Transaksi</p>
                    <h2>${laporan.length}</h2>
                </div>
                <div class="stat-card">
                    <p>Jumlah Produk</p>
                    <h2>${produk.length}</h2>
                </div>
            </div>

            <div class="panel">
                <h3>Selamat datang di UMMU SMART POS!</h3>
                <p>Gunakan menu di sebelah kiri untuk mengelola toko.</p>
            </div>
        `;
    }

    function halamanProduk() {
        contentArea.innerHTML = `
            <div class="page-title">
                <h2>Manajemen Produk</h2>
                <p>Tambah dan kelola barang yang dijual.</p>
            </div>

            <div class="panel">
                <h3>Tambah Produk Baru</h3>
                <div class="form-grid">
                    <input id="namaProduk" placeholder="Nama barang">
                    <input id="hargaProduk" type="number" min="1" placeholder="Harga barang">
                    <input id="stokProduk" type="number" min="0" placeholder="Stok barang">
                    <button class="btn" onclick="tambahProduk()">+ Simpan Produk</button>
                </div>
            </div>

            <div class="panel">
                <h3>Daftar Barang Dijual</h3>
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>No</th><th>Nama</th><th>Harga</th>
                                <th>Stok</th><th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="daftarProduk"></tbody>
                    </table>
                </div>
            </div>
        `;

        renderProduk();
    }

    function renderProduk() {
        const daftar = document.getElementById("daftarProduk");
        if (!daftar) return;

        daftar.innerHTML = produk.map((p, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${aman(p.nama)}</td>
                <td>${rupiah(p.harga)}</td>
                <td>${p.stok}</td>
                <td>
                    <button class="btn" onclick="editProduk(${p.id})">Edit</button>
                    <button class="btn btn-red" onclick="hapusProduk(${p.id})">Hapus</button>
                </td>
            </tr>
        `).join("");
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
            alert("Isi semua data produk dengan benar!");
            return;
        }

        produk.push({
            id: Date.now(),
            nama: nama,
            harga: harga,
            stok: stok
        });

        simpanData();
        halamanProduk();
        alert("Produk berhasil ditambahkan!");
    };

    window.hapusProduk = function(id) {
        if (!confirm("Yakin ingin menghapus produk ini?")) return;

        produk = produk.filter(p => p.id !== id);
        simpanData();
        halamanProduk();
    };

    window.editProduk = function(id) {
        const p = produk.find(item => item.id === id);
        if (!p) return;

        const nama = prompt("Nama produk:", p.nama);
        if (nama === null) return;

        const harga = prompt("Harga produk:", p.harga);
        if (harga === null) return;

        const stok = prompt("Stok produk:", p.stok);
        if (stok === null) return;

        const h = Number(harga);
        const s = Number(stok);

        if (!nama.trim() || !Number.isFinite(h) || h <= 0 ||
            !Number.isInteger(s) || s < 0) {
            alert("Data tidak valid!");
            return;
        }

        p.nama = nama.trim();
        p.harga = h;
        p.stok = s;

        simpanData();
        halamanProduk();
    };

    function katalog() {
        contentArea.innerHTML = `
            <div class="page-title">
                <h2>Katalog Barang</h2>
                <p>Pilih barang yang ingin kamu beli.</p>
            </div>
            <div class="product-grid" id="katalogProduk"></div>
            <div class="panel">
                <button class="btn" onclick="showMenu('transaksi')">
                    Lihat Keranjang Belanja
                </button>
            </div>
        `;

        const tempat = document.getElementById("katalogProduk");

        if (produk.length === 0) {
            tempat.innerHTML = "<p>Belum ada barang yang dijual.</p>";
            return;
        }

        tempat.innerHTML = produk.map(p => `
            <div class="product-card">
                <div class="product-icon">▣</div>
                <h3>${aman(p.nama)}</h3>
                <p>Stok tersedia: ${p.stok}</p>
                <div class="product-price">${rupiah(p.harga)}</div>
                <button class="btn" onclick="tambahKeranjang(${p.id})"
                    ${p.stok <= 0 ? "disabled" : ""}>
                    + Tambah ke Keranjang
                </button>
            </div>
        `).join("");
    }

    window.tambahKeranjang = function(id) {
        const p = produk.find(item => item.id === id);
        if (!p || p.stok <= 0) {
            alert("Stok barang habis!");
            return;
        }

        const ada = keranjang.find(item => item.id === id);
        const jumlah = ada ? ada.jumlah : 0;

        if (jumlah >= p.stok) {
            alert("Jumlah melebihi stok tersedia!");
            return;
        }

        if (ada) ada.jumlah++;
        else keranjang.push({
            id: p.id,
            nama: p.nama,
            harga: p.harga,
            jumlah: 1
        });

        alert("Barang masuk keranjang!");
    };

    function halamanTransaksi() {
        contentArea.innerHTML = `
            <div class="page-title">
                <h2>Keranjang Belanja</h2>
                <p>Periksa barang dan lakukan pembayaran.</p>
            </div>

            <div class="panel">
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Barang</th><th>Harga</th>
                                <th>Jumlah</th><th>Subtotal</th><th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="isiKeranjang"></tbody>
                    </table>
                </div>

                <div class="total-area">
                    <h3 id="totalBelanja">Total: Rp 0</h3>
                    <p>Masukkan jumlah uang pembayaran:</p>
                    <input type="number" id="uangBayar" min="0" placeholder="Contoh: 50000">
                    <br>
                    <button class="btn" onclick="hitungKembalian()">Hitung Kembalian</button>
                    <h3 id="hasilKembalian">Kembalian: Rp 0</h3>
                    <br>
                    <button class="btn" onclick="selesaikanTransaksi()">Selesaikan Pembayaran</button>
                    <button class="btn btn-dark" onclick="kembaliBelanja()">Kembali Belanja</button>
                </div>
            </div>
        `;

        renderKeranjang();
    }

    function renderKeranjang() {
        const tempat = document.getElementById("isiKeranjang");

        tempat.innerHTML = keranjang.map(p => `
            <tr>
                <td>${aman(p.nama)}</td>
                <td>${rupiah(p.harga)}</td>
                <td>${p.jumlah}</td>
                <td>${rupiah(p.harga * p.jumlah)}</td>
                <td>
                    <button class="btn btn-red" onclick="hapusKeranjang(${p.id})">Hapus</button>
                </td>
            </tr>
        `).join("");

        if (keranjang.length === 0) {
            tempat.innerHTML = "<tr><td colspan='5'>Keranjang masih kosong.</td></tr>";
        }

        const total = keranjang.reduce((a, p) => a + p.harga * p.jumlah, 0);
        document.getElementById("totalBelanja").textContent = "Total: " + rupiah(total);
    }

    window.hapusKeranjang = function(id) {
        keranjang = keranjang.filter(p => p.id !== id);
        halamanTransaksi();
    };

    window.hitungKembalian = function() {
        const total = keranjang.reduce((a, p) => a + p.harga * p.jumlah, 0);
        const bayar = Number(document.getElementById("uangBayar").value);

        if (!Number.isFinite(bayar) || bayar < total) {
            alert("Uang pembayaran belum cukup!");
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

        const total = keranjang.reduce((a, p) => a + p.harga * p.jumlah, 0);
        const input = document.getElementById("uangBayar").value;
        const bayar = Number(input);

        if (input === "" || !Number.isFinite(bayar) || bayar < total) {
            alert("Masukkan uang pembayaran yang cukup!");
            return;
        }

        for (const item of keranjang) {
            const p = produk.find(x => x.id === item.id);
            if (!p || p.stok < item.jumlah) {
                alert("Stok " + item.nama + " tidak mencukupi!");
                return;
            }
        }

        keranjang.forEach(item => {
            const p = produk.find(x => x.id === item.id);
            p.stok -= item.jumlah;
        });

        laporan.push({
            tanggal: new Date().toLocaleString("id-ID"),
            total: total,
            bayar: bayar,
            pelanggan: roleAktif === "pelanggan" ? "Pelanggan" : "Admin"
        });

        const kembali = bayar - total;
        keranjang = [];

        simpanData();

        contentArea.innerHTML = `
            <div class="panel">
                <h2>✓ Transaksi Berhasil!</h2>
                <p>Total Belanja: ${rupiah(total)}</p>
                <p>Uang Pembayaran: ${rupiah(bayar)}</p>
                <h3>Kembalian: ${rupiah(kembali)}</h3>
                <p>Terima kasih telah berbelanja di UMMU SMART POS.</p>
                <br>
                <button class="btn" onclick="showMenu('${roleAktif === "admin" ? "produk" : "belanja"}')">
                    Kembali
                </button>
            </div>
        `;
    };

    window.kembaliBelanja = function() {
        if (roleAktif === "pelanggan") katalog();
        else halamanProduk();
    };

    function halamanLaporan() {
        contentArea.innerHTML = `
            <div class="page-title">
                <h2>Laporan Penjualan</h2>
                <p>Riwayat transaksi toko.</p>
            </div>

            <div class="panel">
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>No</th><th>Tanggal</th>
                                <th>Pelanggan</th><th>Total</th><th>Bayar</th>
                            </tr>
                        </thead>
                        <tbody id="daftarLaporan"></tbody>
                    </table>
                </div>
            </div>
        `;

        const tempat = document.getElementById("daftarLaporan");

        if (laporan.length === 0) {
            tempat.innerHTML = "<tr><td colspan='5'>Belum ada transaksi.</td></tr>";
        } else {
            tempat.innerHTML = laporan.map((p, i) => `
                <tr>
                    <td>${i + 1}</td>
                    <td>${aman(p.tanggal)}</td>
                    <td>${aman(p.pelanggan)}</td>
                    <td>${rupiah(p.total)}</td>
                    <td>${rupiah(p.bayar)}</td>
                </tr>
            `).join("");
        }
    }

    function riwayatPelanggan() {
        contentArea.innerHTML = `
            <div class="page-title">
                <h2>Riwayat Belanja</h2>
                <p>Daftar transaksi yang tercatat pada aplikasi ini.</p>
            </div>
            <div class="panel" id="riwayatList"></div>
        `;

        const milikPelanggan = laporan.filter(p => p.pelanggan === "Pelanggan");
        const tempat = document.getElementById("riwayatList");

        if (milikPelanggan.length === 0) {
            tempat.innerHTML = "Belum ada riwayat belanja.";
        } else {
            tempat.innerHTML = milikPelanggan.map(p => `
                <p>${aman(p.tanggal)} — <b>${rupiah(p.total)}</b></p>
                <hr>
            `).join("");
        }
    }

    simpanData();

});

