По ощущениям, Blackbox AI дает верный ответ, но менее оригинален. В процессе работы с Blackbox AI я заметил, что он путался в строках и иногда выдавал бессмысленные результаты. В то время как ChatGPT-4 может генерировать более 200 строк кода, Blackbox AI начинает путаться и нести бред после 100 строк, после чего требуется нажать на кнопку "Продолжить". Я заметил, что порог для ChatGPT-4 находится в диапазоне 150-200 строк.

Я использовал Visual Studio Code и расширение для него; возможно, версия сайта будет более собранной при работе с большим объемом данных. Blackbox AI отлично объяснил, где и как создать папки, чтобы всё работало. Один из примеров структуры проекта выглядит следующим образом:

Insert Code
Edit
Copy code
my-project/
│
├── backend/                # Директория серверной части
│   ├── server.js           # Основной файл сервера
│   ├── routes/             # Директория с маршрутами
│   │   ├── index.js        # Основной файл маршрутов
│   │   └── users.js        # Маршрут для пользователей
│   ├── models/             # Директория с моделями данных
│   │   └── user.js         # Модель пользователя
│   ├── config/             # Конфигурационные файлы
│   │   └── db.js           # Файл подключения к базе данных
│   └── .env                # Файл окружения
│
├── frontend/               # Директория клиентской части
│   ├── index.html          # Основной HTML файл
│   ├── styles/             # Директория со стилями
│   │   └── styles.css      # CSS файл
│   ├── scripts/            # Директория со скриптами
│   │   └── app.js          # Основной JavaScript файл
│   └── images/             # Директория с изображениями
│       └── logo.png        # Логотип
│
├── .gitignore              # Файл для исключения файлов из Git
└── README.md               # Файл с описанием проекта
ChatGPT-4 также может создавать подобные структуры, но, как мне кажется, он никогда не демонстрировал это на практике, а лишь указывал текстом, в какую директорию что поместить.

В этом эксперименте я пришёл к выводу, что backend соответствует ChatGPT-4, а frontend — Blackbox AI. Экспериментируйте с ними: CSS я дорабатывал сам, так как оба AI не справились с этой задачей. Лучше давать им небольшие инструкции, чтобы избежать ошибок и лучше вникать в код.
