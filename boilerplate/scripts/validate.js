const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'theme.json',
  'styles/main.css',
  'styles/variables.css',
  'layouts/default.html',
];

const VALID_CATEGORIES = ['professional', 'creative', 'minimal', 'bold', 'elegant', 'dark', 'other'];
const VALID_CONFIG_TYPES = ['color', 'select', 'text', 'range', 'boolean', 'image'];
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_LONG_DESCRIPTION_LENGTH = 5000;

let errors = [];
let warnings = [];

function validate() {
  console.log('🔍 Validating Cardlise theme...\n');

  // Check required files
  console.log('📁 Checking required files...');
  for (const file of REQUIRED_FILES) {
    const filePath = path.resolve(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing required file: ${file}`);
    } else {
      console.log(`  ✅ ${file}`);
    }
  }

  // Validate theme.json
  console.log('\n📋 Validating theme.json...');
  const themeJsonPath = path.resolve(__dirname, '..', 'theme.json');
  
  if (!fs.existsSync(themeJsonPath)) {
    errors.push('theme.json not found');
    printResults();
    return;
  }

  let theme;
  try {
    const content = fs.readFileSync(themeJsonPath, 'utf-8');
    theme = JSON.parse(content);
  } catch (e) {
    errors.push(`theme.json is not valid JSON: ${e.message}`);
    printResults();
    return;
  }

  // Required fields
  const requiredFields = ['name', 'version', 'description', 'category', 'config_schema', 'default_config'];
  for (const field of requiredFields) {
    if (!theme[field]) {
      errors.push(`theme.json missing required field: ${field}`);
    }
  }

  // Name validation
  if (theme.name && (theme.name.length < 3 || theme.name.length > 50)) {
    errors.push('Theme name must be 3-50 characters');
  }

  // Description validation
  if (theme.description && theme.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`Description exceeds ${MAX_DESCRIPTION_LENGTH} characters`);
  }

  if (theme.long_description && theme.long_description.length > MAX_LONG_DESCRIPTION_LENGTH) {
    errors.push(`Long description exceeds ${MAX_LONG_DESCRIPTION_LENGTH} characters`);
  }

  // Category validation
  if (theme.category && !VALID_CATEGORIES.includes(theme.category)) {
    warnings.push(`Category "${theme.category}" is non-standard. Valid: ${VALID_CATEGORIES.join(', ')}`);
  }

  // Config schema validation
  if (theme.config_schema) {
    console.log('  Validating config_schema...');
    for (const [key, config] of Object.entries(theme.config_schema)) {
      if (!config.type) {
        errors.push(`config_schema.${key} missing "type"`);
      } else if (!VALID_CONFIG_TYPES.includes(config.type)) {
        errors.push(`config_schema.${key} has invalid type "${config.type}". Valid: ${VALID_CONFIG_TYPES.join(', ')}`);
      }

      if (!config.label) {
        warnings.push(`config_schema.${key} missing "label"`);
      }

      if (config.default === undefined) {
        warnings.push(`config_schema.${key} missing "default" value`);
      }

      if (config.type === 'select' && (!config.options || !Array.isArray(config.options))) {
        errors.push(`config_schema.${key} is type "select" but missing "options" array`);
      }

      if (config.type === 'range') {
        if (!config.min || !config.max) {
          errors.push(`config_schema.${key} is type "range" but missing "min" or "max"`);
        }
      }

      // Check default_config has matching key
      if (theme.default_config && theme.default_config[key] === undefined) {
        warnings.push(`default_config missing value for config_schema key "${key}"`);
      }
    }
    console.log(`  ✅ ${Object.keys(theme.config_schema).length} config options validated`);
  }

  // Price validation
  if (theme.price !== undefined && theme.price !== 0) {
    if (theme.price < 49) {
      errors.push('Minimum price for paid themes is ₹49');
    }
    if (theme.price > 999) {
      errors.push('Maximum price for themes is ₹999');
    }
  }

  // Tags validation
  if (theme.tags) {
    if (!Array.isArray(theme.tags)) {
      errors.push('"tags" must be an array');
    } else if (theme.tags.length > 10) {
      warnings.push('Maximum 10 tags recommended');
    }
  }

  // Check preview images
  console.log('\n🖼️  Checking preview images...');
  const previewDir = path.resolve(__dirname, '..', 'preview');
  if (fs.existsSync(previewDir)) {
    const files = fs.readdirSync(previewDir);
    const hasThumbnail = files.some(f => f.startsWith('thumbnail'));
    if (!hasThumbnail) {
      warnings.push('Missing preview/thumbnail.png (recommended: 400x300)');
    } else {
      console.log('  ✅ Thumbnail found');
    }
  } else {
    warnings.push('No preview/ directory found. Add thumbnail and preview images for marketplace.');
  }

  // CSS validation (basic)
  console.log('\n🎨 Checking CSS...');
  const mainCssPath = path.resolve(__dirname, '..', 'styles/main.css');
  if (fs.existsSync(mainCssPath)) {
    const css = fs.readFileSync(mainCssPath, 'utf-8');
    if (css.includes('!important')) {
      warnings.push('Avoid using !important in CSS - it may conflict with user customizations');
    }
    if (css.includes('position: fixed')) {
      warnings.push('Avoid position: fixed - it may break card rendering in different contexts');
    }
    console.log(`  ✅ CSS file size: ${(Buffer.byteLength(css) / 1024).toFixed(1)}KB`);
  }

  printResults();
}

function printResults() {
  console.log('\n' + '='.repeat(50));
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ Theme validation passed! Ready to build.\n');
    process.exit(0);
  }

  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} Error(s):`);
    errors.forEach(e => console.log(`   • ${e}`));
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} Warning(s):`);
    warnings.forEach(w => console.log(`   • ${w}`));
  }

  console.log('');
  
  if (errors.length > 0) {
    console.log('Fix errors before publishing.\n');
    process.exit(1);
  } else {
    console.log('Warnings won\'t block publishing but should be addressed.\n');
    process.exit(0);
  }
}

validate();
