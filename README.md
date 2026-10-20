# carservice124 — сайт для GitHub Pages

Отдельная копия шаблона для шиномонтажной мастерской и СТО carservice124 в Минусинске. Исходный шаблон остаётся в соседней папке `shinomontazh-template`.

## Публикация на GitHub Pages

Репозиторий сайта: [archRDS/minusinsk_service](https://github.com/archRDS/minusinsk_service). Публичный адрес: [archrds.github.io/minusinsk_service](https://archrds.github.io/minusinsk_service/).

GitHub Pages настроен на публикацию ветки `main` из корня репозитория. Поэтому `index.html` и остальные файлы сайта лежат прямо здесь. Сборка и зависимости не требуются; файл `.nojekyll` отключает обработку Jekyll.

Локальный репозиторий уже подключён к GitHub. Для дальнейших обновлений выполните из этой папки:

```powershell
git add .
git commit -m "Update carservice124 site"
git push
```

После `git push` GitHub Pages обновит публичную страницу. `server.mjs` запускает локальную копию, а `preview.png` хранит снимок экрана.

## Запуск

Откройте PowerShell в этой папке и выполните:

```powershell
node server.mjs
```

Сайт будет доступен по адресу <http://localhost:4174>. Для остановки сервера нажмите `Ctrl+C`.

## Данные

Название, адрес, телефон, WhatsApp, режим работы, услуги, цены и отзывы находятся в [`config.js`](config.js). Фото первого экрана — `hero-photo.png`.

Данные проверены 20.10.2026 по карточке [carservice124 в 2ГИС](https://2gis.ru/minusinsk/firm/70000001064887213), её разделам [«Цены»](https://2gis.ru/minusinsk/firm/70000001064887213/tab/prices), [«Инфо»](https://2gis.ru/minusinsk/firm/70000001064887213/tab/info) и [«Отзывы»](https://2gis.ru/minusinsk/firm/70000001064887213/tab/reviews). В карточке прайс отмечен как обновлённый 01.12.2025, поэтому стоимость стоит подтвердить у владельца перед передачей сайта клиентам.

Форма открывает подготовленное сообщение в WhatsApp компании. Заявка считается отправленной, только когда посетитель отправит это сообщение сам; время подтверждает мастерская. Сайт не хранит заявки и не резервирует свободные интервалы.

Для клиентов используйте публичную ссылку GitHub Pages; localhost виден только на вашем компьютере.
