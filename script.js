document.addEventListener("DOMContentLoaded", () => {
    // 1. TEMA SISTEM & CUSTOM
    const themeSelector = document.getElementById("theme-selector");
    const savedTheme = localStorage.getItem("firweb_theme") || "light";
    if (themeSelector) themeSelector.value = savedTheme;
    applyTheme(savedTheme);

    if (themeSelector) {
        themeSelector.addEventListener("change", (e) => {
            let t = e.target.value;
            localStorage.setItem("firweb_theme", t);
            applyTheme(t);
        });
    }

    function applyTheme(t) {
        document.body.className = "";
        if (t === "dark") document.body.classList.add("dark");
        else if (t === "gradient") document.body.classList.add("gradient");
        else if (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.body.classList.add("dark");
        }
    }

    // 2. AUTH & SESSION
    const currentUser = localStorage.getItem("firweb_user");
    const currentRole = localStorage.getItem("firweb_role");
    const userInfo = document.getElementById("user-info");
    const authBtn = document.getElementById("auth-btn");

    if (userInfo && authBtn) {
        if (currentUser) {
            userInfo.innerHTML = `Halo, <a href="profile.html" style="color:var(--primary); text-decoration:none;"><b>${currentUser}</b></a>`;
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

    // 3. VALIDASI PASSWORD REALTIME & LOGIN
    const passwordInput = document.getElementById("password");
    const loginForm = document.getElementById("login-form");
    const errorMsg = document.getElementById("error-msg");

    if (passwordInput) {
        passwordInput.addEventListener("input", () => {
            let val = passwordInput.value;
            let len = val.length >= 8;
            let upper = /[A-Z]/.test(val);
            let num = /[0-9]/.test(val);

            updateRuleUI("rule-len", len);
            updateRuleUI("rule-upper", upper);
            updateRuleUI("rule-num", num);
        });
    }

    function updateRuleUI(id, isValid) {
        let el = document.getElementById(id);
        if (!el) return;
        if (isValid) {
            el.className = "rule-item rule-green";
            el.textContent = el.textContent.replace("•", "✓");
        } else {
            el.className = "rule-item rule-red";
            el.textContent = el.textContent.replace("✓", "•");
        }
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let u = document.getElementById("username").value.trim();
            let p = passwordInput.value;

            if (p.length < 8 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) {
                errorMsg.textContent = "Password belum memenuhi aturan di atas!";
                return;
            }

            let db = JSON.parse(localStorage.getItem("firweb_db_users") || "{}");
            if (db[u]) {
                if (db[u].password !== p) {
                    errorMsg.textContent = "Password salah!";
                    return;
                }
                localStorage.setItem("firweb_user", u);
                localStorage.setItem("firweb_role", db[u].role);
            } else {
                let role = (u === "FirliOfc") ? "admin" : "user";
                db[u] = { password: p, role: role, display: u, lastDisplayChange: 0, lastUserChange: 0 };
                localStorage.setItem("firweb_db_users", JSON.stringify(db));
                localStorage.setItem("firweb_user", u);
                localStorage.setItem("firweb_role", role);
            }
            window.location.href = "index.html";
        });

        document.getElementById("google-login-btn").addEventListener("click", () => {
            let gName = prompt("Pilih/Masukkan Username baru dari akun Google Anda:");
            if (!gName) return;
            let db = JSON.parse(localStorage.getItem("firweb_db_users") || "{}");
            if (db[gName]) {
                alert("Username sudah terpakai!");
                return;
            }
            db[gName] = { password: "GoogleLogin123", role: "user", display: gName, lastDisplayChange: 0, lastUserChange: 0 };
            localStorage.setItem("firweb_db_users", JSON.stringify(db));
            localStorage.setItem("firweb_user", gName);
            localStorage.setItem("firweb_role", "user");
            window.location.href = "index.html";
        });
    }

    // 4. UPLOAD & EDIT KONTEN (VERTIKAL & SCRIPT KEBAWAH)
    const upGame = document.getElementById("up-game");
    const upCategory = document.getElementById("up-category");
    const scriptSection = document.getElementById("script-section");
    const robuxWrapper = document.getElementById("robux-wrapper");
    const uploadMethod = document.getElementById("upload-method");
    const inputFileWrap = document.getElementById("input-file-wrap");
    const inputLinkWrap = document.getElementById("input-link-wrap");

    function setupCategories() {
        if (!upCategory) return;
        upCategory.innerHTML = "";
        let cats = upGame.value === "minecraft" 
            ? ["Skin", "World", "Add-on", "Resource pack", "Behavior pack", "Shader", "Texture pack"]
            : ["Uncopylocked", "Game", "Script", "Script Exploit", "Avatar", "Model"];
        
        cats.forEach(c => {
            let opt = document.createElement("option");
            opt.value = c; opt.textContent = c;
            upCategory.appendChild(opt);
        });
        checkSpecialCategories();
    }

    function checkSpecialCategories() {
        if (!upCategory) return;
        let val = upCategory.value;
        if (scriptSection) scriptSection.style.display = (val === "Script" || val === "Script Exploit") ? "block" : "none";
        if (robuxWrapper) robuxWrapper.style.display = (val === "Avatar") ? "block" : "none";
    }

    if (upGame) {
        upGame.addEventListener("change", setupCategories);
        upCategory.addEventListener("change", checkSpecialCategories);
        setupCategories();
    }

    if (uploadMethod) {
        uploadMethod.addEventListener("change", () => {
            if (uploadMethod.value === "file") {
                inputFileWrap.style.display = "block";
                inputLinkWrap.style.display = "none";
            } else {
                inputFileWrap.style.display = "none";
                inputLinkWrap.style.display = "block";
            }
        });
    }

    // Tambah Script Kebawah Tanpa Batas
    const addScriptBtn = document.getElementById("add-script-btn");
    const scriptContainer = document.getElementById("script-container");
    if (addScriptBtn && scriptContainer) {
        function addScriptRow(val = "") {
            let div = document.createElement("div");
            div.innerHTML = `<textarea class="script-row" rows="2" placeholder="Tulis kode script...">${val}</textarea>`;
            scriptContainer.appendChild(div);
        }
        if (scriptContainer.children.length === 0) addScriptRow();
        addScriptBtn.addEventListener("click", () => addScriptRow());
    }

    // Submit Upload / Edit
    const uploadForm = document.getElementById("upload-form");
    if (uploadForm) {
        if (!currentUser) { window.location.href = "login.html"; }

        // Cek jika mode Edit
        let editId = new URLSearchParams(window.location.search).get("edit");
        if (editId) {
            document.getElementById("form-heading").textContent = "Edit Konten";
            let posts = JSON.parse(localStorage.getItem("firweb_posts") || "[]");
            let target = posts.find(p => p.id == editId);
            if (target) {
                document.getElementById("edit-id").value = target.id;
                upGame.value = target.game;
                setupCategories();
                upCategory.value = target.category;
                checkSpecialCategories();
                document.getElementById("up-title").value = target.title;
                document.getElementById("up-desc").value = target.desc;
                document.getElementById("up-robux").value = target.robux || 0;
            }
        }

        uploadForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let id = document.getElementById("edit-id").value || Date.now();
            let game = upGame.value;
            let cat = upCategory.value;
            let title = document.getElementById("up-title").value;
            let desc = document.getElementById("up-desc").value;
            let robux = document.getElementById("up-robux").value || 0;

            let thumbLink = document.getElementById("up-thumb-link").value;
            let thumbFile = document.getElementById("up-thumb-file").files[0];

            let scriptsArr = [];
            document.querySelectorAll(".script-row").forEach(el => {
                if (el.value) scriptsArr.push(el.value);
            });

            function finalizeSave(thumbUrl) {
                let post = {
                    id: Number(id), author: currentUser,
                    game, category: cat, title, thumb: thumbUrl || "https://via.placeholder.com/300",
                    desc, robux, scripts: scriptsArr
                };

                let posts = JSON.parse(localStorage.getItem("firweb_posts") || "[]");
                let idx = posts.findIndex(p => p.id == id);
                if (idx >= 0) posts[idx] = post;
                else posts.unshift(post);

                localStorage.setItem("firweb_posts", JSON.stringify(posts));
                alert("Konten berhasil disimpan!");
                window.location.href = `content.html?game=${game}`;
            }

            if (thumbFile) {
                let reader = new FileReader();
                reader.onload = (ev) => finalizeSave(ev.target.result);
                reader.readAsDataURL(thumbFile);
            } else {
                finalizeSave(thumbLink);
            }
        });
    }

    // 5. TAMPILAN KONTEN VERTIKAL & TOMBOL SALIN SCRIPT
    const urlParams = new URLSearchParams(window.location.search);
    const gameParam = urlParams.get("game");
    const postsList = document.getElementById("posts-list");
    const categoryTitle = document.getElementById("category-title");
    const fabUpload = document.getElementById("fab-upload");

    if (gameParam && postsList) {
        categoryTitle.textContent = gameParam.toUpperCase() + " Hub";
        if (currentUser && fabUpload) fabUpload.style.display = "flex";

        let posts = JSON.parse(localStorage.getItem("firweb_posts") || "[]").filter(p => p.game === gameParam);
        postsList.innerHTML = posts.length === 0 ? "<p>Belum ada konten.</p>" : "";

        posts.forEach(p => {
            let div = document.createElement("div");
            div.className = "post-item-vertical";

            let scriptsHtml = "";
            if (p.scripts && p.scripts.length > 0) {
                scriptsHtml = p.scripts.map((s, idx) => `
                    <div style="display:flex; gap:10px; margin-top:5px;">
                        <textarea rows="2" readonly style="flex:1;">${s}</textarea>
                        <button class="btn copy-script-btn" data-code="${encodeURIComponent(s)}">Salin Script ${idx+1}</button>
                    </div>
                `).join("");
            }

            let editBtn = (currentUser === p.author || currentRole === "admin") ? `<a href="upload.html?edit=${p.id}" class="btn" style="background:#d97706; margin-top:5px;">Edit Konten</a>` : "";

            div.innerHTML = `
                <img src="${p.thumb}" class="post-thumb">
                <h3>${p.title} <span style="font-size:0.8rem; color:var(--primary);">[${p.category}]</span></h3>
                <p style="font-size:0.85rem; color:#64748b;">Oleh: ${p.author}</p>
                <p>${p.desc}</p>
                ${p.robux > 0 ? `<p style="color:#d97706; font-weight:bold;">Harga: ${p.robux} Robux</p>` : ""}
                ${scriptsHtml}
                ${editBtn}
            `;
            postsList.appendChild(div);
        });

        document.querySelectorAll(".copy-script-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                let code = decodeURIComponent(e.target.getAttribute("data-code"));
                navigator.clipboard.writeText(code);
                alert("Script berhasil disalin!");
            });
        });
    }

    // 6. PROFIL & BATASAN WAKTU GANTI NAMA
    const newUsernameInput = document.getElementById("new-username");
    if (newUsernameInput) {
        let db = JSON.parse(localStorage.getItem("firweb_db_users") || "{}");
        let userData = db[currentUser] || {};
        document.getElementById("profile-username").textContent = "@" + currentUser;
        document.getElementById("profile-display-name").textContent = userData.display || currentUser;
        newUsernameInput.value = currentUser;

        document.getElementById("save-username-btn").addEventListener("click", () => {
            let now = Date.now();
            let limit = 30 * 30 * 24 * 60 * 60 * 1000; // 30 bulan
            if (userData.lastUserChange && (now - userData.lastUserChange < limit)) {
                alert("Username baru bisa diubah kembali setelah 30 bulan!");
                return;
            }
            let newU = newUsernameInput.value.trim();
            if (db[newU]) { alert("Username sudah dipakai!"); return; }

            db[newU] = db[currentUser];
            delete db[currentUser];
            db[newU].lastUserChange = now;
            localStorage.setItem("firweb_db_users", JSON.stringify(db));
            localStorage.setItem("firweb_user", newU);
            alert("Username berhasil diubah!");
            window.location.reload();
        });
    }
});
