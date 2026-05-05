# Повна інструкція підключення Contentful CMS

## Крок 1 — Встановлення пакету

```bash
npm install contentful
```

---

## Крок 2 — Налаштування .env

Відкрий `.env` і додай:

```
REACT_APP_CONTENTFUL_SPACE_ID=xxxxxxxxxxxxxxxx
REACT_APP_CONTENTFUL_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Де взяти:
- Зайди на https://app.contentful.com
- Settings → API keys → Add API key
- Скопіюй Space ID та Content Delivery API - access token

---

## Крок 3 — Створення Content Types у Contentful

Зайди: Content model → Add content type

### 3.1 Content Type: `service`
Display name: **Service**

| Field name       | Field ID         | Type        | Required |
|------------------|------------------|-------------|----------|
| ID               | `serviceId`      | Short text  | ✅       |
| Number           | `num`            | Short text  | ✅       |
| Category         | `category`       | Short text  | ✅       |
| Title            | `title`          | Short text  | ✅       |
| Short desc       | `short`          | Short text  | ✅       |
| Full description | `fullDesc`       | Long text   | ✅       |
| Tagline          | `tagline`        | Short text  | ✅       |
| Price            | `price`          | Short text  | ✅       |
| Duration         | `duration`       | Short text  | ✅       |
| Sessions         | `sessions`       | Short text  | ✅       |
| Effect           | `effect`         | Short text  |          |
| Benefits         | `benefits`       | Short text, List | ✅  |
| Procedure steps  | `procedure`      | Short text, List | ✅  |
| Contraindications| `contraindications` | Short text, List | ✅ |

### 3.2 Content Type: `pricingItem`
Display name: **Pricing Item**

| Field name  | Field ID   | Type       | Required |
|-------------|------------|------------|----------|
| Name        | `name`     | Short text | ✅       |
| Category    | `category` | Short text | ✅       |
| Duration    | `duration` | Short text |          |
| Price       | `price`    | Short text | ✅       |
| Sort order  | `order`    | Integer    |          |

### 3.3 Content Type: `galleryItem`
Display name: **Gallery Item**

| Field name  | Field ID    | Type       | Required |
|-------------|-------------|------------|----------|
| Title       | `title`     | Short text | ✅       |
| Category    | `category`  | Short text | ✅       |
| Description | `desc`      | Short text | ✅       |
| Photo       | `photo`     | Media      |          |
| Sort order  | `order`     | Integer    |          |

### 3.4 Content Type: `siteSettings`
Display name: **Site Settings**
(Один запис — загальні налаштування сайту)

| Field name      | Field ID        | Type       | Required |
|-----------------|-----------------|------------|----------|
| Phone           | `phone`         | Short text | ✅       |
| Email           | `email`         | Short text | ✅       |
| Address         | `address`       | Short text | ✅       |
| Working hours   | `workingHours`  | Short text | ✅       |
| Instagram URL   | `instagram`     | Short text |          |
| TikTok URL      | `tiktok`        | Short text |          |
| Facebook URL    | `facebook`      | Short text |          |
| Telegram URL    | `telegram`      | Short text |          |

### 3.5 Content Type: `specialist`
Display name: **Specialist**

| Field name      | Field ID         | Type            | Required |
|-----------------|------------------|-----------------|----------|
| Name            | `name`           | Short text      | ✅       |
| Role            | `role`           | Short text      | ✅       |
| Bio             | `bio`            | Long text       | ✅       |
| Experience      | `experience`     | Short text      | ✅       |
| Photo           | `photo`          | Media           |          |
| Specializations | `specializations`| Short text, List| ✅       |
| Certifications  | `certifications` | Short text, List| ✅       |

---

## Крок 4 — Заповнення контенту

### Services (11 записів):

**endosphere**
- serviceId: endosphere
- num: 01
- category: Апаратні
- title: Ендосфера (обличчя та тіло)
- short: Апаратний масаж компресійними мікросферами, який стимулює кровообіг, зменшує целюліт, набряки та підтягує шкіру.
- tagline: Компресійний масаж нового покоління
- price: від 250 грн
- duration: 30–90 хв
- sessions: 8–15 сеансів
- effect: Антицелюліт, дренаж
- benefits: Стимуляція кровообігу та лімфодренажу | Зменшення целюліту та набряків | Підтягування та пружність шкіри | Розгладження нерівностей | Покращення контурів тіла | Видимий результат після 1–3 сеансів
- procedure: Консультація та визначення зон обробки | Підготовка шкіри, нанесення засобу | Обробка апаратом ендосфери по масажних лініях | Фінальний лімфодренажний прийом | Рекомендації по догляду
- contraindications: Вагітність та лактація | Онкологічні захворювання | Тромбоз | Гострі запальні процеси

(Аналогічно для lpg, rf-lifting, cavitation, cryolipolysis, vacuum-roller, pressotherapy, emslim, microcurrent, morpheus8, laser)

### Pricing Items (37 записів):
Категорії: Апаратні процедури / LPG Масаж / Ендосфера / Лазерна епіляція / Комплекси

### Gallery Items (12 записів):
Категорії: Тіло / Обличчя / Епіляція / Салон

### Site Settings (1 запис):
- phone: +38 (000) 000-00-00
- email: pudra.beautyroom@gmail.com
- address: м. Нововолинськ, вул. Незалежності, 24
- workingHours: Пн–Пт: 09:00 – 20:00 / Сб–Нд: 10:00 – 18:00

### Specialist (1 запис):
- name: Наталія Щербачук
- role: Засновниця & Головний косметолог
- experience: 8+ років практики
- specializations: LPG масаж | Ендосфера | RF-ліфтинг | EMSLIM | Кріоліполіз | Лазерна епіляція | Morpheus8
- certifications: (8 сертифікатів з AboutPage)

---

## Крок 5 — Код вже оновлено автоматично

Файли що були змінені:
- src/lib/contentful.js — клієнт та всі функції запитів
- src/pages/ServicesPage.js — дані з Contentful
- src/pages/PricingPage.js — дані з Contentful
- src/pages/GalleryPage.js — дані з Contentful
- src/pages/AboutPage.js — дані з Contentful
- src/pages/ServiceDetailPage.js — дані з Contentful
- src/pages/ContactPage.js — контакти з Contentful
- src/pages/BookingPage.js — список послуг з Contentful
- src/pages/HomePage.js — список послуг з Contentful
