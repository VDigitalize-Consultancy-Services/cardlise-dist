# Cardlise Theme Boilerplate

A starter template for building custom card themes for the [Cardlise](https://cardlise.com) marketplace.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Validate your theme
npm run validate

# Build for submission
npm run build
```

## Structure

```
├── theme.json          # Theme metadata & config schema
├── styles/
│   ├── main.css        # Core styles
│   └── variables.css   # CSS custom properties
├── layouts/
│   └── default.html    # Card layout template
├── preview/
│   ├── thumbnail.png   # 400x300 marketplace thumbnail
│   └── preview-*.png   # Full preview screenshots
└── package.json
```

## Documentation

Full documentation: [Theme Development Guide](https://cardlise.com/docs/theme-development.md)

## Configuration

Edit `theme.json` to define:
- Theme metadata (name, description, category, tags, price)
- Configuration schema (user-customizable options)
- Default configuration values

## Publishing

1. Run `npm run validate` to check for errors
2. Run `npm run build` to package your theme
3. Upload via the Developer Dashboard at cardlise.com/dashboard/themes

## Guidelines

- Original designs only
- Mobile-responsive required
- Must work with all card data fields
- Preview images must be accurate
- No malicious code or tracking

## Support

- Docs: https://docs.cardlise.com/themes
- Email: themes@cardlise.com
- Issues: https://github.com/vdigitalize/cardlise-theme-boilerplate/issues

---

© 2026 VDigitalize Consultancy Services Private Limited
