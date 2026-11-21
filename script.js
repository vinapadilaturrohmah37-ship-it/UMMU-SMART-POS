

// ========================================
// UMMU SMART POS - SISTEM KASIR
// ========================================

let selectedRole = "admin";
let products = JSON.parse(localStorage.getItem("ummu_products") || "[]");
let transactions = JSON.parse(localStorage.getItem("ummu_transactions") || "[]");
let cart = [];

// AKUN DEMO
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

// FORMAT RUPIAH
function rupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
}

// AMANKAN TEKS YANG DITAMPILKAN
function safeText(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// SIMPAN DATA
function saveProducts() {
    localStorage.setItem("ummu_products", JSON.stringify(products));
}

function saveTransactions() {
    localStorage.setItem("ummu_transactions", JSON.stringify(transactions));
}

// ========================================
// LOGIN
// ========================================

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

        updateDashboard();

        // Hak akses menu
        document.querySelectorAll(".menu-btn").forEach(button => {
            const page = button.getAttribute("onclick");

            button.hidden = selectedRole === "customer" &&
                !page.includes("dashboard") &&
                !page.includes("transactions");
        });

        showPage("dashboard");

        alert("Login berhasil. Selamat datang di UMMU SMART POS!");
    } else {
        alert("Username atau password salah!");
    }
});

// ========================================
// NAVIGASI
// ========================================

function showPage(page) {
    const sections = {
        dashboard: "dashboardSection",
        products: "productsSection",
        transactions: "transactionsSection",
        reports: "reportsSection"
    };

    if (selectedRole === "customer" &&
        (page === "products" || page === "reports")) {
        alert("Menu ini khusus Admin.");
        return;
    }

    Object.values(sections).forEach(id => {
        document.getElementById(id).hidden = true;
    });

    if (sections[page]) {
        document.getElementById(sections[page]).hidden = false;
    }

    const titles = {
        dashboard: "Dashboard",
        products: "Manajemen Produk",
        transactions: "Transaksi Penjualan",
        reports: "Laporan Penjualan"
    };

    document.getElementById("welcomeTitle").textContent = titles[page];

    document.querySelectorAll(".menu-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.getAttribute("onclick") === `showPage('${page}')`
        );
    });

    if (page === "products") renderProducts();
    if (page === "transactions") {
        renderProductOptions();
        renderCart();
    }
    if (page === "reports") renderReports();
}

// ========================================
// LOGOUT
// ========================================

function logout() {
    if (!confirm("Apakah kamu yakin ingin keluar?")) return;

    cart = [];

    document.getElementById("dashboardPage").hidden = true;
    document.getElementById("loginPage").hidden = false;

    document.getElementById("loginForm").reset();

    document.querySelectorAll(".role-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    document.querySelector(".role-btn").classList.add("active");

    document.querySelectorAll(".menu-btn").forEach(btn => {
        btn.hidden = false;
    });

    selectedRole = "admin";

    document.getElementById("loginInfo").textContent =
        "Login sebagai Admin";
}

// ========================================
// MANAJEMEN PRODUK
// ========================================

const productForm = document.getElementById("productForm");

productForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const id = document.getElementById("productId").value;
    const name = document.getElementById("productName").value.trim();
    const category = document.getElementById("productCategory").value.trim();
    const price = Number(document.getElementById("productPrice").value);
    const stock = Number(document.getElementById("productStock").value);

    if (!name || !category || price <= 0 ||
        !Number.isFinite(price) || stock < 0 ||
        !Number.isInteger(stock)) {
        alert("Periksa kembali nama, kategori, harga, dan stok.");
        return;
    }

    if (id) {
        const product = products.find(item => item.id === id);

        if (!product) {
            alert("Produk tidak ditemukan.");
            return;
        }

        product.name = name;
        product.category = category;
        product.price = price;
        product.stock = stock;

        alert("Produk berhasil diperbarui!");
    } else {
        products.push({
            id: String(Date.now()) + Math.random().toString(16).slice(2),
            name,
            category,
            price,
            stock
        });

        alert("Produk berhasil ditambahkan!");
    }

    saveProducts();
    resetProductForm();
    renderProducts();
    renderProductOptions();
    updateDashboard();
});

function renderProducts() {
    const table = document.getElementById("productTable");
    const keyword = document.getElementById("productSearch").value
        .trim().toLowerCase();

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword)
    );

    if (filtered.length === 0) {
        table.innerHTML =
            '<tr><td colspan="6">Belum ada produk yang cocok.</td></tr>';
        return;
    }

    table.innerHTML = filtered.map((product, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${safeText(product.name)}</td>
            <td>${safeText(product.category)}</td>
            <td>${rupiah(product.price)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="action-btn edit-btn"
                    onclick="editProduct('${product.id}')">Edit</button>
                <button class="action-btn delete-btn"
                    onclick="deleteProduct('${product.id}')">Hapus</button>
            </td>
        </tr>
    `).join("");
}

function editProduct(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.stock;

    document.getElementById("saveProductBtn").textContent = "Perbarui Produk";

    document.getElementById("productForm").scrollIntoView({
        behavior: "smooth"
    });
}

function deleteProduct(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    if (!confirm(`Hapus produk ${product.name}?`)) return;

    products = products.filter(item => item.id !== id);
    cart = cart.filter(item => item.productId !== id);

    saveProducts();

    renderProducts();
    renderProductOptions();
    renderCart();
    updateDashboard();
}

function resetProductForm() {
    productForm.reset();
    document.getElementById("productId").value = "";
    document.getElementById("saveProductBtn").textContent = "Simpan Produk";
}

document.getElementById("productSearch").addEventListener("input", renderProducts);

// ========================================
// PILIH PRODUK UNTUK TRANSAKSI
// ========================================

function renderProductOptions() {
    const select = document.getElementById("transactionProduct");

    select.innerHTML = '<option value="">-- Pilih Produk --</option>';

    products.forEach(product => {
        if (product.stock > 0) {
            const option = document.createElement("option");
            option.value = product.id;
            option.textContent =
                `${product.name} - ${rupiah(product.price)} (Stok: ${product.stock})`;

            select.appendChild(option);
        }
    });
}

// ========================================
// KERANJANG
// ========================================

function addToCart() {
    const productId = document.getElementById("transactionProduct").value;
    const quantity = Number(document.getElementById("transactionQty").value);

    const product = products.find(item => item.id === productId);

    if (!product) {
        alert("Silakan pilih produk terlebih dahulu.");
        return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        alert("Jumlah barang harus minimal 1.");
        return;
    }

    const existing = cart.find(item => item.productId === productId);
    const currentQty = existing ? existing.quantity : 0;

    if (currentQty + quantity > product.stock) {
        alert("Stok barang tidak mencukupi!");
        return;
    }

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity
        });
    }

    document.getElementById("transactionQty").value = 1;

    renderCart();
}

function renderCart() {
    const table = document.getElementById("cartTable");

    if (cart.length === 0) {
        table.innerHTML =
            '<tr><td colspan="5">Keranjang masih kosong.</td></tr>';
    } else {
        table.innerHTML = cart.map(item => `
            <tr>
                <td>${safeText(item.name)}</td>
                <td>${rupiah(item.price)}</td>
                <td>${item.quantity}</td>
                <td>${rupiah(item.price * item.quantity)}</td>
                <td>
                    <button class="action-btn delete-btn"
                        onclick="removeFromCart('${item.productId}')">Hapus</button>
                </td>
            </tr>
        `).join("");
    }

    document.getElementById("cartTotal").textContent =
        rupiah(getCartTotal());

    calculateChange();
}

function getCartTotal() {
    return cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    renderCart();
}

document.getElementById("paymentAmount").addEventListener(
    "input",
    calculateChange
);

function calculateChange() {
    const total = getCartTotal();
    const payment = Number(document.getElementById("paymentAmount").value) || 0;
    const change = Math.max(0, payment - total);

    document.getElementById("changeAmount").textContent = rupiah(change);
}

// ========================================
// SELESAIKAN TRANSAKSI
// ========================================

function completeTransaction() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    const total = getCartTotal();
    const payment = Number(document.getElementById("paymentAmount").value);

    if (!Number.isFinite(payment) || payment < total) {
        alert("Uang pembayaran belum mencukupi!");
        return;
    }

    // Pastikan stok masih tersedia
    for (const item of cart) {
        const product = products.find(p => p.id === item.productId);

        if (!product || product.stock < item.quantity) {
            alert(`Stok ${item.name} sudah tidak mencukupi.`);
            return;
        }
    }

    if (!confirm(`Selesaikan transaksi sebesar ${rupiah(total)}?`)) {
        return;
    }

    // Kurangi stok produk
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        product.stock -= item.quantity;
    });

    const transaction = {
        id: "TRX-" + Date.now(),
        date: new Date().toISOString(),
        items: cart.map(item => ({ ...item })),
        total,
        payment,
        change: payment - total
    };

    transactions.push(transaction);

    saveProducts();
    saveTransactions();

    cart = [];

    document.getElementById("paymentAmount").value = "";
    document.getElementById("transactionQty").value = 1;

    renderCart();
    renderProductOptions();
    renderProducts();
    updateDashboard();

    alert(
        "Transaksi berhasil!\n" +
        "Total: " + rupiah(total) + "\n" +
        "Kembalian: " + rupiah(transaction.change)
    );
}

// ========================================
// LAPORAN
// ========================================

function renderReports() {
    const revenue = transactions.reduce(
        (sum, trx) => sum + trx.total, 0
    );

    const totalItems = transactions.reduce((sum, trx) => {
        return sum + trx.items.reduce(
            (itemSum, item) => itemSum + item.quantity, 0
        );
    }, 0);

    document.getElementById("reportRevenue").textContent = rupiah(revenue);
    document.getElementById("reportCount").textContent = transactions.length;
    document.getElementById("reportItems").textContent = totalItems;

    const table = document.getElementById("reportTable");

    if (transactions.length === 0) {
        table.innerHTML =
            '<tr><td colspan="6">Belum ada transaksi.</td></tr>';
        return;
    }

    table.innerHTML = [...transactions].reverse().map((trx, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${new Date(trx.date).toLocaleString("id-ID")}</td>
            <td>${safeText(trx.id)}</td>
            <td>${rupiah(trx.total)}</td>
            <td>${rupiah(trx.payment)}</td>
            <td>${rupiah(trx.change)}</td>
        </tr>
    `).join("");
}

// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {
    document.getElementById("totalProducts").textContent = products.length;

    document.getElementById("totalTransactions").textContent =
        transactions.length;

    const totalSales = transactions.reduce(
        (sum, trx) => sum + trx.total, 0
    );

    document.getElementById("totalSales").textContent = rupiah(totalSales);
}

// TAMPILKAN DATA SAAT APLIKASI DIBUKA
updateDashboard();
