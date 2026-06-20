# Meract

meract.com

Интерактивная стриминговая платформа с прямыми трансляциями, чатом в реальном времени, достижениями, гильдиями и созданием маршрутов на основе геолокации.

## Быстрый старт

### Требования

- Node.js (v16+)
- Запущенный backend API сервер

### Установка

```bash
npm install
# или
yarn install
```

### Настройка окружения

Создайте файл `.env` в корневой директории:

```env
VITE_API_URL=http://localhost:3000
VITE_AGORA_APP_ID=your_agora_app_id
```

### Запуск dev-сервера

```bash
npm run dev
# или
yarn dev
```

Приложение будет доступно по адресу `http://localhost:5173`

### Сборка для продакшена

```bash
npm run build
npm run preview
```

## Архитектура проекта

### Технологический стек

- **React 19** - UI фреймворк
- **Vite** - Инструмент сборки и dev-сервер
- **React Router** - Клиентская маршрутизация
- **Zustand** - Управление состоянием
- **Axios** - HTTP клиент
- **Socket.io** - Связь в реальном времени
- **Agora SDK** - Прямые трансляции
- **Leaflet** - Карты и геолокация
- **React Toastify** - Уведомления

### Структура папок

```
./
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── public/
│   ├── icons/
│   │   ├── arrowDown.svg
│   │   ├── arrowUp.svg
│   │   ├── backArrow3.svg
│   │   ├── back_arrow.svg
│   │   ├── back_arrowV2.svg
│   │   ├── bell.svg
│   │   ├── chat/
│   │   │   ├── chat.png
│   │   │   ├── file.png
│   │   │   ├── geo.png
│   │   │   ├── send.png
│   │   │   └── smile.png
│   │   ├── favorites_icon.png
│   │   ├── flash.svg
│   │   ├── google.svg
│   │   ├── guild/
│   │   │   └── light.svg
│   │   ├── hummer.svg
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   ├── intro.svg
│   │   ├── link_icon.svg
│   │   ├── manual.svg
│   │   ├── multiHero.svg
│   │   ├── music.svg
│   │   ├── NavBar/
│   │   │   ├── actLogo.svg
│   │   │   ├── chatLogo.svg
│   │   │   ├── guildLogo.svg
│   │   │   ├── playBtn.svg
│   │   │   └── rankLogo.svg
│   │   ├── outro.svg
│   │   ├── planet.svg
│   │   ├── plus.svg
│   │   ├── singleHero.svg
│   │   └── voting.svg
│   └── manifest.json
├── README.md
├── src/
│   ├── app/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── router/
│   │       └── Routers.jsx
│   ├── features/
│   │   └── Auth/
│   │       ├── forgotPassword/
│   │       │   ├── forgot.module.css
│   │       │   ├── ForgotPassword.jsx
│   │       │   └── hooks/
│   │       │       ├── useChangePassword.js
│   │       │       ├── useForgotPassword.js
│   │       │       └── useVerifyCode.js
│   │       ├── hooks/
│   │       │   ├── useChangePassword.js
│   │       │   ├── useForgotPassword.js
│   │       │   └── useVerifyCode.js
│   │       ├── Login/
│   │       │   ├── hooks/
│   │       │   │   └── useAuth.js
│   │       │   ├── Login.jsx
│   │       │   ├── Login.module.css
│   │       │   ├── MainBanner.jsx
│   │       │   └── mainbanner.module.css
│   │       ├── PasswordProtection/
│   │       │   ├── PasswordProtection.jsx
│   │       │   └── PasswordProtection.module.css
│   │       ├── registration/
│   │       │   ├── hooks/
│   │       │   │   └── useSignUp.js
│   │       │   ├── SignUp.jsx
│   │       │   ├── signup.module.css
│   │       │   ├── TermOfUse.jsx
│   │       │   └── termofuse.module.css
│   │       ├── RequireAuth.jsx
│   │       └── startpage/
│   │           ├── StartPage.jsx
│   │           └── StartPage.module.css
│   ├── images/
│   │   ├── ALL IMAGES
│   ├── main.jsx
│   ├── pages/
│   │   ├── achievements/
│   │   │   ├── AchievementsPage.jsx
│   │   │   └── AchievementsPage.module.css
│   │   ├── actDetail/
│   │   │   ├── ActDetailPage.jsx
│   │   │   └── ActDetailPage.module.css
│   │   ├── acts/
│   │   │   ├── ActsDetail.jsx
│   │   │   ├── ActsDetail.module.css
│   │   │   ├── ActsFilters.jsx
│   │   │   ├── ActsPage.jsx
│   │   │   ├── ActsPage.module.css
│   │   │   ├── components/
│   │   │   │   ├── ActCard.jsx
│   │   │   │   ├── ActCard.module.css
│   │   │   │   ├── actChat.jsx
│   │   │   │   ├── EmojiPicker.jsx
│   │   │   │   ├── EmojiPicker.module.css
│   │   │   │   ├── StreamSetup.jsx
│   │   │   │   ├── StreamSetup.module.css
│   │   │   │   ├── StreamViewer.jsx
│   │   │   │   └── StreamViewer.module.css
│   │   │   ├── hooks/
│   │   │   │   ├── useActs.js
│   │   │   │   └── useChat.js
│   │   │   └── MyActs.jsx
│   │   ├── chats/
│   │   │   ├── ChatCreate.jsx
│   │   │   ├── ChatMulti.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── ChatPage.module.css
│   │   │   ├── ChatSingle.jsx
│   │   │   └── CompanionProfile.jsx
│   │   ├── createAct/
│   │   │   ├── AddMember.jsx
│   │   │   ├── components/
│   │   │   │   ├── StreamHost.jsx
│   │   │   │   └── StreamHost.module.css
│   │   │   ├── CreateAct.jsx
│   │   │   ├── CreateAct.module.css
│   │   │   ├── hooks/
│   │   │   │   ├── useCategories.js
│   │   │   │   ├── useCreateAct.js
│   │   │   │   └── useCreateSequel.js
│   │   │   └── TeamDetail.jsx
│   │   ├── guilds/
│   │   │   ├── components/
│   │   │   │   ├── GuildAbout.jsx
│   │   │   │   ├── GuildAbout.module.css
│   │   │   │   ├── GuildCard.jsx
│   │   │   │   ├── GuildCard.module.css
│   │   │   │   ├── GuildSettings.jsx
│   │   │   │   └── GuildSettings.module.css
│   │   │   ├── GuildDetailPage.jsx
│   │   │   ├── GuildDetailPage.module.css
│   │   │   ├── GuildsFilter.jsx
│   │   │   ├── GuildsPage.jsx
│   │   │   ├── GuildsPage.module.css
│   │   │   └── hooks/
│   │   │       └── useUserGuild.js
│   │   ├── Menu/
│   │   │   ├── Menu.jsx
│   │   │   └── Menu.module.css
│   │   ├── myAchieve/
│   │   │   ├── MyAchieve.jsx
│   │   │   └── MyAchieve.module.css
│   │   ├── NotFoundPage.jsx
│   │   ├── notifications/
│   │   │   ├── Notifications.jsx
│   │   │   └── Notifications.module.css
│   │   ├── pay/
│   │   │   ├── PayDetail.jsx
│   │   │   ├── PayPage.jsx
│   │   │   ├── PayPage.module.css
│   │   │   ├── PayStore.jsx
│   │   │   ├── PayTransferDetail.jsx
│   │   │   └── PayTransfer.jsx
│   │   ├── rank/
│   │   │   ├── RankAchive.jsx
│   │   │   ├── RankDetailt.jsx
│   │   │   ├── RankFilters.jsx
│   │   │   ├── RankPage.jsx
│   │   │   └── RankPage.module.css
│   │   ├── sceneControl/
│   │   │   ├── intro/
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useIntros.js
│   │   │   │   │   └── useUploadIntro.js
│   │   │   │   ├── SceneControlIntro.jsx
│   │   │   │   └── SelectSequel/
│   │   │   │       ├── hooks/
│   │   │   │       │   ├── useCreateSequel.js
│   │   │   │       │   └── useSequels.js
│   │   │   │       ├── SelectSequel.jsx
│   │   │   │       └── SelectSequel.module.css
│   │   │   ├── music/
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useMusic.js
│   │   │   │   ├── SceneControlMusic.jsx
│   │   │   │   ├── selectMusic/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   │   ├── useMusic.js
│   │   │   │   │   │   └── useUploadMusic.js
│   │   │   │   │   ├── SelectMusic.jsx
│   │   │   │   │   ├── SelectMusic.module.css
│   │   │   │   │   └── utils/
│   │   │   │   │       └── musicUtils.js
│   │   │   │   └── utils/
│   │   │   │       └── musicUtils.js
│   │   │   ├── outro/
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useOutros.js
│   │   │   │   │   └── useUploadOutro.js
│   │   │   │   └── SceneControlOutro.jsx
│   │   │   ├── SceneControl.module.css
│   │   │   └── transition/
│   │   │       ├── hooks/
│   │   │       │   ├── useEffects.js
│   │   │       │   └── useUploadEffect.js
│   │   │       └── SceneControlTransition.jsx
│   │   ├── settings/
│   │   │   ├── AuthModal.jsx
│   │   │   ├── EmailModal.jsx
│   │   │   ├── LanguagePage.jsx
│   │   │   ├── LocalTime.jsx
│   │   │   ├── LocaltionDetail.jsx
│   │   │   ├── LocationPage.jsx
│   │   │   ├── ModalLayout.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── PasswordModal.jsx
│   │   │   ├── PersonalData.jsx
│   │   │   ├── PhoneModal.jsx
│   │   │   ├── SecurityPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── SettingsPage.module.css
│   │   ├── stream/
│   │   │   ├── StreamPage.jsx
│   │   │   └── StreamPage.module.css
│   │   ├── streamHost/
│   │   │   ├── StreamHostPage.jsx
│   │   │   └── StreamHostPage.module.css
│   │   ├── TechnicalSupport/
│   │   │   ├── TechnicalSupport.jsx
│   │   │   └── TechnicalSupport.module.css
│   │   └── TechnicalWorkPage.jsx
│   ├── service-worker.js
│   └── shared/
│       ├── api/
│       │   ├── achievementApi.js
│       │   ├── act.js
│       │   ├── api.js
│       │   ├── chat.js
│       │   ├── guild.js
│       │   ├── notifications.js
│       │   ├── pay.js
│       │   ├── profile.js
│       │   ├── rank.js
│       │   └── spotAgentApi.js
│       ├── hooks/
│       │   ├── useAchievements.js
│       │   └── useSpotAgent.js
│       ├── stores/
│       │   ├── achievementStore.js
│       │   ├── actsFilters.js
│       │   ├── actsStore.js
│       │   ├── authStore.js
│       │   ├── index.js
│       │   ├── MenuData.js
│       │   ├── sequelStore.js
│       │   ├── soundStore.js
│       │   ├── spotAgentStore.js
│       │   └── teamStore.js
│       ├── types/
│       │   └── act.js
│       ├── ui/
│       │   ├── AchievementNotification/
│       │   │   ├── AchievementNotification.jsx
│       │   │   └── AchievementNotification.module.css
│       │   ├── AchievementNotificationContainer/
│       │   │   └── AchievementNotificationContainer.jsx
│       │   ├── CustomSelect/
│       │   │   ├── CustomSelect.jsx
│       │   │   ├── CustomSelect.module.css
│       │   │   └── index.js
│       │   ├── NavBar/
│       │   │   ├── NavBar.jsx
│       │   │   └── NavBar.module.css
│       │   └── SpotAgent/
│       │       ├── index.js
│       │       ├── SpotAgentAssigned.jsx
│       │       ├── SpotAgentAssigned.module.css
│       │       ├── SpotAgentCandidates.jsx
│       │       ├── SpotAgentCandidates.module.css
│       │       ├── SpotAgentSection.jsx
│       │       └── SpotAgentSection.module.css
│       └── utils/
│           ├── achievementSocket.js
│           └── videoEffects.js
├── vite.config.js
└── yarn.lock

```

## Основные функции

### Аутентификация

- Вход и регистрация через email/пароль
- Интеграция с Google OAuth
- Механизм обновления JWT токенов
- Защищенные маршруты через `RequireAuth`

### ACT (активности)

- Создание ACT с названием, типом (одиночный/мульти герой) и форматом
- Прямые трансляции через Agora SDK
- Чат в реальном времени во время стримов
- Управление задачами для каждого ACT
- Планирование маршрута с несколькими точками
- Методы выбора Hero/Navigator (голосование, ставки, вручную)

### Стриминг

- Вещание стримов с видео/аудио
- Режим зрителя с чатом в реальном времени
- Управление сценами (интро, аутро, музыка, переходы)
- Видео эффекты и фильтры

### Гильдии

- Создание и вступление в гильдии
- Чат гильдии в реальном времени через Socket.io
- Управление участниками гильдии

### Достижения

- Уведомления о достижениях в реальном времени через WebSocket
- Персональные и гильдийские достижения
- Панель наград достижений

### Геолокация

- Отслеживание текущего местоположения
- Создание маршрута с несколькими точками
- Интерактивная карта (Leaflet + OpenStreetMap)
- Визуализация маршрута через OSRM

## Управление состоянием

### Zustand хранилища

- **authStore** - Аутентификация пользователя, токены, геолокация и маршруты
- **actsStore** - Список ACT, задачи и состояние форм
- **achievementStore** - Достижения и уведомления
- **sequelStore** - Выбор сиквелов/сцен (интро, аутро, музыка)

## Интеграция с API

### HTTP (Axios)

- Автоматическое добавление JWT токена
- Автоматическое обновление токена при 401
- Базовый URL из `VITE_API_URL`

### WebSocket (Socket.io)

- Уведомления о достижениях (`achievementSocket.js`)
- Чат гильдии (`GuildDetailPage.jsx`)
- Чат ACT во время стримов (`useChat.js`)

## Заметки для разработчиков

- **Service Worker**: Поддержка PWA через `service-worker.js`
- **Manifest**: PWA манифест в `public/manifest.json`
- **Icons**: UI иконки в `public/icons/`
- **Password Protection**: Опциональная парольная защита в разработке

## Скрипты

- `npm run dev` - Запустить dev-сервер
- `npm run build` - Собрать для продакшена
- `npm run preview` - Предпросмотр production сборки
- `npm run lint` - Запустить ESLint
