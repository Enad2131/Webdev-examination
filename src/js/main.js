function getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

function getPosts() {
    const saved = localStorage.getItem("posts_v2");
    if (!saved) {
        const initialPosts = [
            {
                id: 1,
                author: "frankdagat",
                text: "Sumbagay tawag diring numbera zeroninezerofivethreetwoonezero",
                time: "10 mins ago"
            }
        ];
        localStorage.setItem("posts_v2", JSON.stringify(initialPosts));
        return initialPosts;
    }
    return JSON.parse(saved);
}

function signup() {
    const userBox = document.getElementById("signup-username");
    const passBox = document.getElementById("signup-password");

    if (!userBox.value || !passBox.value) {
        alert("Please fill in both fields.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find(u => u.username === userBox.value)) {
        alert("Username is taken.");
        return;
    }

    const newUser = { username: userBox.value, password: passBox.value };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    alert("Account created!");
    window.location.href = "../index.html";
}

function login() {
    const userBox = document.getElementById("login-username");
    const passBox = document.getElementById("login-password");

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(u => u.username === userBox.value && u.password === passBox.value);

    if (found) {
        localStorage.setItem("currentUser", JSON.stringify(found));
        alert("Logged in!");
        window.location.href = "../index.html";
    } else {
        alert("Wrong username or password.");
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    alert("Logged out.");
    window.location.reload();
}

function addPost() {
    const user = getCurrentUser();
    if (!user) {
        alert("Please log in to post.");
        window.location.href = "pages/login.html";
        return;
    }

    const box = document.getElementById("post-text");
    if (!box.value.trim()) return;

    const posts = getPosts();
    posts.unshift({
        id: Date.now(),
        author: user.username,
        text: box.value,
        time: "Just now"
    });

    localStorage.setItem("posts_v2", JSON.stringify(posts));
    box.value = "";
    displayFeed();
}

function deletePost(id) {
    let posts = getPosts();
    posts = posts.filter(post => post.id !== id);
    localStorage.setItem("posts_v2", JSON.stringify(posts));
    location.reload();
}

function displayFeed() {
    const feed = document.getElementById("feed");
    if (!feed) return;

    const posts = getPosts();
    const user = getCurrentUser();
    feed.innerHTML = "";

    posts.forEach(post => {
        const isOwner = user && user.username === post.author;
        feed.innerHTML += `
      <div class="post">
        <div class="post-meta">
          <strong>@${post.author}</strong> • ${post.time}
          <span class="badge">Shielded</span>
          ${isOwner ? `<button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>` : ''}
        </div>
        <div>${post.text}</div>
      </div>
    `;
    });
}