allstar-Frontend
================
Frontend-часть сайта риэлеторского агентства allstar

Установка
------------
    npm i

Использование
-------------
В папке <i>app</i> находятся исходные файлы проекта. <br>
В папке <i>dist</i> находятся конечные файлы (pug -> html, sass -> css, bundled js, optimized images).

Gulp-commands
-------------
Создание страницы с именем <i>name</i> (app/views/name.pug, app/styles/name.sass, app/js/name.js):

    gulp new-page --name <name>
    
Запуск browserSync-сервера со страницей с именем <i>name</i> в качестве домашней. Регирование на изменение исходных файлов страницы.

    gulp --production --name <name>     // Сжимать и минифировать файлы если --production  
    
Запуск browserSync-сервера со страницей с именем <i>name</i> в качестве домашней. Регирование на изменение исходных файлов страницы. пересборка файлов страницы.

    gulp build --production --name <name>     // Сжимать и минифировать файлы если --production  