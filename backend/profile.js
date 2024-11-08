document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const createPostBtn = document.getElementById('createPostBtn');
    const userPosts = document.getElementById('userPosts');

    // Проверка наличия токена
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Добавьте кнопку выхода
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Выйти';
    logoutBtn.classList.add('back-button');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
    document.querySelector('.profile-posts').prepend(logoutBtn);

    // Загрузка постов пользователя
    async function loadUserPosts() {
        try {
            const response = await fetch('http://localhost:5000/api/posts', {
                headers: {
                    'Authorization': token
                }
            });

            if (response.ok) {
                const posts = await response.json();
                userPosts.innerHTML = posts.map(post => `
                    <div class="post">
                        <div class="post-header">
                            <h3>Пост от ${new Date(post.createdAt).toLocaleDateString()}</h3>
                        </div>
                        <p>${post.content}</p>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Ошибка загрузки постов:', error);
        }
    }

    // Создание нового поста
    createPostBtn.addEventListener('click', async () => {
        const postContent = document.getElementById('postContent').value;

        if (!postContent.trim()) {
            alert('Введите текст поста');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: postContent })
            });

            if (response.ok) {
                document.getElementById('postContent').value = '';
                loadUserPosts();
            }
        } catch (error) {
            console.error('Ошибка создания поста:', error);
        }
    });

    loadUserPosts();

});
