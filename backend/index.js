document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userProfile = document.getElementById('userProfile');
    const userNickname = document.getElementById('userNickname');

    if (token) {
        fetch('http://localhost:5000/api/user', {
            headers: {
                'Authorization': token // Используем сохраненный токен с Bearer
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Не удалось загрузить данные пользователя');
        })
        .then(user => {
            userNickname.textContent = user.username;
            userProfile.style.display = 'flex';
        })
        .catch(error => {
            console.error('Ошибка:', error);
            localStorage.removeItem('token');
        });
    }
});