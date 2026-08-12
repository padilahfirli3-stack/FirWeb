document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("firweb_user");
    const currentRole = localStorage.getItem("firweb_role");

    // 1. Header Auth Status
    const userInfo = document.getElementById("user-info");
    const authBtn = document.getElementById("auth-btn");
    if (userInfo && authBtn) {
        if (currentUser) {
            let badge = currentRole === "admin" ? " <span class='blue-badge'>✓</span>" : "";
            userInfo.innerHTML = `Halo, <a href="profile.html?user=${currentUser}" style="text-decoration:none; color:inherit;"><b>${currentUser}</b></a>${badge}`;
            authBtn.textContent = "Keluar";
            authBtn.href = "#";
            authBtn.addEventListener("click", () => {
                localStorage.removeItem("firweb_user");
                localStorage.removeItem("firweb_role");
                window.location.reload();
            });
        } else {
            userInfo.textContent = "Halo, Tamu";
            authBtn.textContent = "Sign In";
            authBtn.href = "login.html";
        }
    }

    // 2. Login & Pendaftaran Akun (Cek Password & Nama Unik + Google Simluasi)
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let u = document.getElementById("username").value.trim();
            let p = document.getElementById("password").value;
            let db = JSON.parse(localStorage.getItem("firweb_db_users") || "{}");

            if (db[u]) {
                if (db[u].password !== p) {
                    alert("Password salah! Tidak bisa masuk.");
                    return;
                }
                localStorage.setItem("firweb_user", u);
                localStorage.setItem("firweb_role", db[u].role);
            } else {
                let role = (u === "FirliOfc") ? "admin" : "user";
                db[u] = { password: p, role: role };
                localStorage.setItem("firweb_db_users", JSON.stringify(db));
                localStorage.setItem("firweb_user", u);
                localStorage.setItem("firweb_role", role);
            }
            window.location.href = "index.html";
        });

        document.getElementById("google-btn").addEventListener("click", () => {
            let googleUser = "GoogleUser_" + Math.floor(Math.random() * 1000);
            localStorage.setItem("firweb_user", googleUser);
            localStorage.setItem("firweb_role", "user");
            alert("Berhasil masuk dengan akun Google!");
            window.location.href = "index.html";
        });
    }

    // 3. Pengaturan Kategori Berdasarkan Game di Halaman Upload
    const upGame = document.getElementById("up-game");
    const upCategory = document.getElementById("up-category");
    const versionWrapper = document.getElementById("version-wrapper");
    const scriptSection = document.getElementById("script-section");
    const downloadSection = document.getElementById("download-section");

    function updateCategories() {
        if (!upCategory) return;
        upCategory.innerHTML = "";
        let game = upGame.value;
        let cats = [];
        if (game === "minecraft") {
            cats = ["Skin", "World", "Add-on", "Resource pack", "Behavior pack", "Shader", "Texture pack"];
            if (versionWrapper) versionWrapper.style.display = "block";
        } else {
            cats = ["Uncopylocked", "Game", "Script", "Script Exploit", "Avatar", "Model"];
            if (versionWrapper) versionWrapper.style.display = "none";
        }
        cats.forEach(c => {
            let opt = document.createElement("option");
            opt.value = c; opt.textContent = c;
            upCategory.appendChild(opt);
        });
        toggleScriptMode();
    }

    function toggleScriptMode() {
        if (!upCategory) return;
        let val = upCategory.value;
        if (val === "Script" || val === "Script Exploit") {
            if (scriptSection) scriptSection.style.display = "block";
            if (downloadSection) downloadSection.style.display = "none";
        } else {
            if (scriptSection) scriptSection.style.display = "none";
            if (downloadSection) downloadSection.style.display = "block";
        }
    }

    if (upGame) {
        upGame.addEventListener("change", updateCategories);
        upCategory.addEventListener("change", toggleScriptMode);
        updateCategories();
    }

    // Tambah Kolom Script Dinamis Tanpa Batas
    const addScriptBtn = document.getElementById("add-script-btn");
    const scriptContainer = document.getElementById("script-container");
    if (addScriptBtn && scriptContainer) {
        let scriptCount = 0;
        function addScriptField() {
            scriptCount++;
            let div = document.createElement("div");
            div.style.marginBottom = "10px";
            div.innerHTML = `<input type="text" class="script-input" placeholder="Script ${scriptCount} (Tulis atau paste kode..." required>`;
            scriptContainer.appendChild(div);
        }
        addScriptField(); // Minimal 1 kolom awal
        addScriptBtn.addEventListener("click", addScriptField);
    }

    // Proses Submit Upload
    const uploadForm = document.getElementById("upload-form");
    if (uploadForm) {
        if (!currentUser) {
            alert("Harus login dulu untuk upload!");
            window.location.href = "login.html";
        }
        uploadForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let game = upGame.value;
            let cat = upCategory.value;
            let title = document.getElementById("up-title").value;
            let thumb = document.getElementById("up-thumbnail").value;
            let desc = document.getElementById("up-desc").value;
            let robux = document.getElementById("up-robux").value || 0;
            let version = versionWrapper ? document.getElementById("up-version").value : "";

            let scriptsArr = [];
            if (cat === "Script" || cat === "Script Exploit") {
                document.querySelectorAll(".script-input").forEach(inp => {
                    if (inp.value) scriptsArr.push(inp.value);
                });
            }
            let link = document.getElementById("up-link") ? document.getElementById("up-link").value : "";

            let post = {
                id: Date.now(),
                author: currentUser,
                isAdmin: currentRole === "admin",
                game, category: cat, title, thumb, desc, robux, version, scripts: scriptsArr, link,
                likes: 0, comments: []
            };

            let posts = JSON.parse(localStorage.getItem("firweb_posts") || "[]");
            posts.unshift(post);
            localStorage.setItem("firweb_posts", JSON.stringify(posts));
            alert("Konten berhasil diupload!");
            window.location.href = `content.html?game=${game}`;
        });
    }

    // 4. Halaman Tampil Konten
    const urlParams = new URLSearchParams(window.location.search);
    const gameParam = urlParams.get("game");
    const categoryTitle = document.getElementById("category-title");
    const postsList = document.getElementById("posts-list");
    const fabUpload = document.getElementById("fab-upload");

    if (gameParam && categoryTitle) {
        categoryTitle.textContent = gameParam.toUpperCase() + " Hub";
        if (currentUser && fabUpload) fabUpload.style.display = "flex";

        let posts = JSON.parse(localStorage.getItem("firweb_posts") || "[]");
        let filtered = posts.filter(p => p.game === gameParam);

        if (filtered.length === 0) {
            postsList.innerHTML = "<p>Belum ada konten di sini.</p>";
        } else {
            postsList.innerHTML = "";
            filtered.forEach(p => {
                let badge = p.isAdmin ? " <span class='blue-badge'>✓</span>" : "";
                let div = document.createElement("div");
                div.className = "post-item";
                
                let actionHtml = "";
                if (p.scripts && p.scripts.length > 0) {
                    actionHtml = p.scripts.map((s, idx) => `<button class="btn copy-btn" data-code="${encodeURIComponent(s)}" style="margin:5px 5px 5px 0;">Copy Script ${idx+1}</button>`).join("");
                } else {
                    actionHtml = `<a href="${p.link}" target="_blank" class="btn">Download</a>`;
                }

                div.innerHTML = `
                    <div style="display:flex; gap:15px;">
                        <img src="${p.thumb}" alt="thumb" style="width:100px; height:100px; object-fit:cover; border-radius:6px;">
                        <div>
                            <h3>${p.title} <span style="font-size:0.8rem; color:#64748b;">[${p.category}]</span></h3>
                            <p style="font-size:0.85rem; color:#64748b;">Oleh: <a href="profile.html?user=${p.author}">${p.author}</a>${badge}</p>
                            <p style="margin: 5px 0;">${p.desc}</p>
                            ${p.robux > 0 ? `<p style="color:#d97706; font-weight:bold;">Harga: ${p.robux} Robux</p>` : ""}
                            <div style="margin-top:10px;">${actionHtml}</div>
                        </div>
                    </div>
                `;
                postsList.appendChild(div);
            });

            // Tombol Copy Script
            document.querySelectorAll(".copy-btn").forEach(b => {
                b.addEventListener("click", (e) => {
                    let code = decodeURIComponent(e.target.getAttribute("data-code"));
                    navigator.clipboard.writeText(code);
                    alert("Script berhasil disalin!");
                });
            });
        }
    }

    // 5. Halaman Profil Pengguna, Follow, & DM
    const profileName = document.getElementById("profile-name");
    const targetUser = new URLSearchParams(window.location.search).get("user");
    if (profileName && targetUser) {
        document.getElementById("user-title-display").textContent = targetUser + (targetUser === "FirliOfc" ? " ✓" : "");
        profileName.textContent = `Profil: ${targetUser}`;

        let followBtn = document.getElementById("follow-btn");
        let follows = JSON.parse(localStorage.getItem(`firweb_follows_${targetUser}`) || "[]");
        document.getElementById("follower-count").textContent = `Pengikut: ${follows.length}`;

        if (currentUser && currentUser !== targetUser) {
            if (follows.includes(currentUser)) followBtn.textContent = "Unfollow";
            followBtn.addEventListener("click", () => {
                if (follows.includes(currentUser)) {
                    follows = follows.filter(f => f !== currentUser);
                    followBtn.textContent = "Follow";
                } else {
                    follows.push(currentUser);
                    followBtn.textContent = "Unfollow";
                }
                localStorage.setItem(`firweb_follows_${targetUser}`, JSON.stringify(follows));
                document.getElementById("follower-count").textContent = `Pengikut: ${follows.length}`;
            });
        } else {
            followBtn.style.display = "none";
        }

        // Fitur DM Sederhana
        let sendDmBtn = document.getElementById("send-dm-btn");
        let dmList = document.getElementById("dm-list");
        let dmsKey = `firweb_dm_${targetUser}`;
        function loadDMs() {
            let dms = JSON.parse(localStorage.getItem(dmsKey) || "[]");
            dmList.innerHTML = dms.map(d => `<b>${d.from}:</b> ${d.text}`).join("<br>") || "Belum ada pesan.";
        }
        loadDMs();

        sendDmBtn.addEventListener("click", () => {
            if (!currentUser) { alert("Login dulu untuk kirim DM!"); return; }
            let text = document.getElementById("dm-text").value.trim();
            if(!text) return;
            let dms = JSON.parse(localStorage.getItem(dmsKey) || "[]");
            dms.push({ from: currentUser, text });
            localStorage.setItem(dmsKey, JSON.stringify(dms));
            document.getElementById("dm-text").value = "";
            loadDMs();
        });
    }
});
