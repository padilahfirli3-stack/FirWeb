document.addEventListener("DOMContentLoaded", () => {
    // 1. Cek Sesi Login di Beranda
    const welcomeUser = document.getElementById("welcome-user");
    const accountBtn = document.getElementById("account-btn");
    const currentUser = localStorage.getItem("firweb_logged_user");
    const currentRole = localStorage.getItem("firweb_role");

    if (welcomeUser && accountBtn) {
        if (currentUser) {
            let roleBadge = currentRole === "admin" ? " <span class='admin-badge'>ADMIN</span>" : "";
            welcomeUser.innerHTML = `Halo, <b>${currentUser}</b>${roleBadge}`;
            accountBtn.textContent = "KELUAR";
            accountBtn.style.backgroundColor = "#ef4444";
            accountBtn.style.color = "white";
            
            accountBtn.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("firweb_logged_user");
                localStorage.removeItem("firweb_role");
                window.location.reload();
            });
        } else {
            welcomeUser.textContent = "Halo, Tamu";
            accountBtn.textContent = "ACCOUNT";
        }
    }

    // 2. Sistem Login & Validasi Nama Terdaftar
    const authForm = document.getElementById("auth-form");
    if (authForm) {
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let username = document.getElementById("username").value.trim();
            
            // Ambil database akun yang tersimpan
            let registeredUsers = JSON.parse(localStorage.getItem("firweb_users") || "{}");

            if (registeredUsers[username]) {
                // Jika akun sudah ada, langsung masuk
                localStorage.setItem("firweb_logged_user", username);
                localStorage.setItem("firweb_role", registeredUsers[username]);
                alert("Berhasil masuk kembali!");
            } else {
                // Jika nama belum ada, daftarkan baru
                let role = (username === "FirliOfc") ? "admin" : "user";
                registeredUsers[username] = role;
                localStorage.setItem("firweb_users", JSON.stringify(registeredUsers));
                localStorage.setItem("firweb_logged_user", username);
                localStorage.setItem("firweb_role", role);
                alert(role === "admin" ? "Akun Admin terdeteksi! Selamat datang Firli." : "Akun berhasil dibuat!");
            }
            window.location.href = "index.html";
        });
    }

    // 3. Logika Halaman Konten (Upload, Like, Komentar, Report)
    const urlParams = new URLSearchParams(window.location.search);
    const gameType = urlParams.get("game"); // minecraft atau roblox
    const pageTitle = document.getElementById("page-title");
    const uploadSection = document.getElementById("upload-section");
    const uploadForm = document.getElementById("upload-form");
    const postsContainer = document.getElementById("posts-container");

    if (gameType && pageTitle) {
        pageTitle.textContent = `Kategori: ${gameType.toUpperCase()}`;
        if (currentUser && uploadSection) {
            uploadSection.style.display = "block"; // Munculkan form upload kalau sudah login
        }
        loadPosts(gameType);
    }

    if (uploadForm) {
        uploadForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let title = document.getElementById("content-title").value;
            let category = document.getElementById("content-category").value;
            let desc = document.getElementById("content-desc").value;

            let posts = JSON.parse(localStorage.getItem(`firweb_posts_${gameType}`) || " kaca ");
            // Perbaikan parsing array posts
            try { posts = JSON.parse(localStorage.getItem(`firweb_posts_${gameType}`) || "[]"); } catch(err) { posts = []; }

            let newPost = {
                id: Date.now(),
                author: currentUser,
                isAdmin: currentRole === "admin",
                title: title,
                category: category,
                desc: desc,
                likes: 0,
                comments: []
            };

            posts.unshift(newPost);
            localStorage.setItem(`firweb_posts_${gameType}`, JSON.stringify(posts));
            alert("Konten berhasil diupload!");
            window.location.reload();
        });
    }

    function loadPosts(game) {
        if (!postsContainer) return;
        let posts = [];
        try { posts = JSON.parse(localStorage.getItem(`firweb_posts_${game}`) || "[]"); } catch(err) { posts = []; }

        if (posts.length === 0) {
            postsContainer.innerHTML = "<p>Belum ada konten di kategori ini. Yuk upload!</p>";
            return;
        }

        postsContainer.innerHTML = "";
        posts.forEach((post) => {
            let adminTag = post.isAdmin ? " <span class='admin-badge'>ADMIN</span>" : "";
            let postDiv = document.createElement("div");
            postDiv.className = "post-card";
            postDiv.innerHTML = `
                <h4>${post.title} <span style="font-size:0.8rem; color:#38bdf8;">[${post.category}]</span></h4>
                <p style="font-size:0.85rem; color:#94a3b8; margin-bottom: 8px;">Oleh: ${post.author}${adminTag}</p>
                <p style="margin-bottom: 10px;">${post.desc}</p>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <button class="btn like-btn" data-id="${post.id}" style="padding: 4px 10px; font-size: 0.8rem;">👍 (${post.likes})</button>
                    <button class="btn report-btn" data-id="${post.id}" style="background-color:#ef4444; padding: 4px 10px; font-size: 0.8rem;">Report</button>
                </div>
                <div style="border-top: 1px solid #475569; padding-top: 8px;">
                    <div class="comments-list" style="font-size: 0.85rem; margin-bottom: 5px;">
                        ${post.comments.map(c => `<b>${c.user}:</b> ${c.text}`).join("<br>")}
                    </div>
                    <input type="text" class="comment-input" placeholder="Tulis komentar..." data-id="${post.id}" style="padding: 5px; font-size: 0.85rem; margin-bottom: 5px;">
                </div>
            `;
            postsContainer.appendChild(postDiv);
        });

        // Event Listener untuk Like
        document.querySelectorAll(".like-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                let id = Number(e.target.getAttribute("data-id"));
                let posts = JSON.parse(localStorage.getItem(`firweb_posts_${gameType}`) || "[]");
                let target = posts.find(p => p.id === id);
                if (target) {
                    target.likes += 1;
                    localStorage.setItem(`firweb_posts_${gameType}`, JSON.stringify(posts));
                    loadPosts(gameType);
                }
            });
        });

        // Event Listener untuk Report
        document.querySelectorAll(".report-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                alert("Konten telah dilaporkan ke Admin.");
            });
        });

        // Event Listener untuk Kirim Komentar (tekan Enter)
        document.querySelectorAll(".comment-input").forEach(input => {
            input.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    if (!currentUser) {
                        alert("Kamu harus login dulu untuk berkomentar!");
                        return;
                    }
                    let id = Number(e.target.getAttribute("data-id"));
                    let text = e.target.value.trim();
                    if (!text) return;

                    let posts = JSON.parse(localStorage.getItem(`firweb_posts_${gameType}`) || "[]");
                    let target = posts.find(p => p.id === id);
                    if (target) {
                        target.comments.push({ user: currentUser, text: text });
                        localStorage.setItem(`firweb_posts_${gameType}`, JSON.stringify(posts));
                        loadPosts(gameType);
                    }
                }
            });
        });
    }
});
