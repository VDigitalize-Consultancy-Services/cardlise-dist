# Cardlise Theme Development Guide

Welcome to the Cardlise Theme Developer Program! This guide will help you create, test, and publish custom card themes on the Cardlise Marketplace.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Theme Structure](#theme-structure)
3. [Configuration Schema](#configuration-schema)
4. [Styling Guide](#styling-guide)
5. [Publishing Your Theme](#publishing-your-theme)
6. [Revenue & Pricing](#revenue--pricing)
7. [Guidelines & Policies](#guidelines--policies)
8. [API Reference](#api-reference)

---

## Getting Started

### Prerequisites

- Basic knowledge of HTML, CSS, and JSON
- A Cardlise account (register at https://cardlise.com)
- Familiarity with Tailwind CSS (recommended)

### Quick Start

1. Clone this boilerplate:
   ```bash
   git clone https://github.com/vdigitalize/cardlise-theme-boilerplate.git my-theme
   cd my-theme
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3001` to see your theme preview

---

## Theme Structure

```
my-theme/
├── theme.json          # Theme metadata & configuration schema
├── styles/
│   ├── main.css        # Main theme styles
│   └── variables.css   # CSS custom properties (theme variables)
├── layouts/
│   └── default.html    # Default card layout template
├── components/
│   ├── header.html     # Card header component
│   ├── contact.html    # Contact info component
│   ├── links.html      # Social/external links
│   ├── services.html   # Services section
│   └── lead-form.html  # Lead capture form
├── assets/
│   ├── fonts/          # Custom fonts (optional)
│   └── images/         # Theme images
├── preview/
│   ├── thumbnail.png   # 400x300 thumbnail for marketplace
│   ├── preview-1.png   # Full preview screenshot 1
│   └── preview-2.png   # Full preview screenshot 2
├── package.json
└── README.md
```

### theme.json

This is the main configuration file for your theme:

```json
{
  "name": "My Awesome Theme",
  "version": "1.0.0",
  "description": "A brief description of your theme (max 500 chars)",
  "long_description": "Detailed description for the marketplace page (max 5000 chars)",
  "author": "Your Name",
  "category": "creative",
  "tags": ["modern", "colorful", "animated"],
  "price": 0,
  "config_schema": {
    "primary_color": {
      "type": "color",
      "label": "Primary Color",
      "default": "#4F46E5",
      "description": "Main brand color used for buttons and accents"
    },
    "font": {
      "type": "select",
      "label": "Font Family",
      "default": "Inter",
      "options": ["Inter", "Poppins", "Playfair Display", "Space Grotesk"]
    },
    "layout": {
      "type": "select",
      "label": "Layout Style",
      "default": "centered",
      "options": ["centered", "left-aligned", "split", "asymmetric"]
    },
    "border_radius": {
      "type": "range",
      "label": "Border Radius",
      "default": "12px",
      "min": "0px",
      "max": "24px"
    },
    "show_animations": {
      "type": "boolean",
      "label": "Enable Animations",
      "default": true
    }
  },
  "default_config": {
    "primary_color": "#4F46E5",
    "font": "Inter",
    "layout": "centered",
    "border_radius": "12px",
    "show_animations": true
  }
}
```

---

## Configuration Schema

The `config_schema` defines what users can customize when they apply your theme. Supported types:

| Type | Description | Properties |
|------|-------------|------------|
| `color` | Color picker | `default` |
| `select` | Dropdown select | `default`, `options[]` |
| `text` | Text input | `default`, `maxLength` |
| `range` | Slider | `default`, `min`, `max`, `step` |
| `boolean` | Toggle switch | `default` |
| `image` | Image upload | `default`, `maxSize` |

### Example

```json
{
  "background_style": {
    "type": "select",
    "label": "Background Style",
    "default": "solid",
    "options": ["solid", "gradient", "image", "pattern"],
    "description": "Choose the background style for the card"
  }
}
```

---

## Styling Guide

### CSS Variables

Your theme should use CSS custom properties that map to the `config_schema`:

```css
/* styles/variables.css */
:root {
  --theme-primary: var(--config-primary-color, #4F46E5);
  --theme-font: var(--config-font, 'Inter');
  --theme-radius: var(--config-border-radius, 12px);
  --theme-bg: var(--config-background, #FFFFFF);
}
```

### Layout Templates

Use Handlebars-style template syntax for dynamic content:

```html
<!-- layouts/default.html -->
<div class="card-wrapper" style="font-family: var(--theme-font)">
  {{> header}}
  {{> contact}}
  {{> links}}
  {{> services}}
  {{> lead-form}}
</div>
```

### Component Templates

```html
<!-- components/header.html -->
<div class="card-header">
  {{#if card.cover_image}}
    <img src="{{card.cover_image}}" alt="Cover" class="cover-image" />
  {{/if}}
  <div class="profile-section">
    {{#if card.profile_photo}}
      <img src="{{card.profile_photo}}" alt="{{card.full_name}}" class="avatar" />
    {{/if}}
    <h1 class="name">{{card.full_name}}</h1>
    <p class="designation">{{card.designation}}</p>
    <p class="company">{{card.company_name}}</p>
  </div>
</div>
```

### Available Card Data

Your templates have access to these variables:

```
card.full_name          - Card owner's full name
card.designation        - Job title / designation
card.company_name       - Company name
card.bio                - Bio / about text
card.profile_photo      - Profile photo URL
card.cover_image        - Cover image URL
card.logo               - Company logo URL
card.email              - Email address
card.mobile             - Mobile number
card.whatsapp_number    - WhatsApp number
card.website            - Website URL
card.location           - Location text
card.links[]            - Array of social/external links
card.services[]         - Array of services
card.sections[]         - Array of custom sections
```

---

## Publishing Your Theme

### 1. Validate

Run the validation tool to check your theme:

```bash
npm run validate
```

This checks:
- Valid `theme.json` structure
- All required files present
- CSS syntax is valid
- Preview images are correct size
- No prohibited content

### 2. Build

Package your theme for upload:

```bash
npm run build
```

This creates `dist/theme.zip` ready for upload.

### 3. Submit via API

```bash
curl -X POST https://api.cardlise.com/api/developer/themes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Theme",
    "description": "A beautiful card theme",
    "category": "creative",
    "tags": ["modern", "clean"],
    "price": 149,
    "config_schema": {...},
    "default_config": {...}
  }'
```

### 4. Upload Assets

After creating the theme, upload your thumbnail and preview images.

### 5. Publish

Once you're satisfied with your theme:

```bash
curl -X POST https://api.cardlise.com/api/developer/themes/{id}/publish \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Revenue & Pricing

### Free Themes
- Great for building reputation and portfolio
- Increases your visibility in the marketplace
- No revenue share

### Paid Themes
- Set your own price (minimum ₹49, maximum ₹999)
- **Revenue split: 70% to developer, 30% to platform**
- Payouts processed monthly via bank transfer
- Minimum payout: ₹500

### Pricing Tips
- Start with a free theme to build trust
- Price based on complexity and uniqueness
- Consider offering a free "lite" version with a premium upgrade

---

## Guidelines & Policies

### Content Guidelines
- ✅ Original designs only
- ✅ Clean, professional aesthetics
- ✅ Mobile-responsive layouts
- ✅ Accessible (WCAG 2.1 AA recommended)
- ❌ No copyrighted images or fonts without license
- ❌ No malicious code or tracking scripts
- ❌ No inappropriate content
- ❌ No direct copies of existing themes

### Quality Standards
- Theme must render correctly on all screen sizes
- All configuration options must work as documented
- Preview images must accurately represent the theme
- Description must be honest and not misleading

### Report System
- Users can report themes for: fake content, malicious code, broken functionality, copyright issues, or inappropriate content
- **Themes with 3 or more reports are automatically unpublished**
- Cards using an unpublished theme are reset to the default theme
- Developers are notified when their theme is reported or unpublished

### Appeal Process
- If your theme is wrongly unpublished, email themes@cardlise.com
- Include your theme ID and explanation
- Reviews are processed within 48 hours

---

## API Reference

### Create Theme
```
POST /api/developer/themes
```

### Update Theme
```
PUT /api/developer/themes/{id}
```

### Publish Theme
```
POST /api/developer/themes/{id}/publish
```

### Get My Themes
```
GET /api/developer/themes
```

### Get Theme Analytics
```
GET /api/developer/themes/{id}/analytics
```

Response:
```json
{
  "installs": 156,
  "rating": 4.7,
  "reviews": 12,
  "revenue": 23244,
  "reports": 0
}
```

---

## Support

- **Documentation**: https://docs.cardlise.com/themes
- **Developer Discord**: https://discord.gg/cardlise-devs
- **Email**: themes@cardlise.com
- **GitHub Issues**: https://github.com/vdigitalize/cardlise-theme-boilerplate/issues

---

© 2026 VDigitalize Consultancy Services Private Limited. All rights reserved.
