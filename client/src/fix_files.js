const fs = require('fs');
const path = require('path');

const filesToFix = [
  'pages/accounting-form.tsx',
  'pages/accounting-list.tsx', 
  'pages/appointment-form.tsx',
  'pages/barber-plan-form.tsx',
  'pages/barber-plan-list.tsx',
  'pages/client-form.tsx',
  'pages/client-list.tsx',
  'pages/service-form.tsx',
  'pages/settings.tsx',
  'pages/whatsapp-list.tsx',
  'pages/payment-gateway-list.tsx',
  'pages/support-ticket-form.tsx',
  'pages/support-ticket-list.tsx'
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove selectedBusinessId references
    content = content.replace(/const\s+selectedBusinessId\s*=\s*[^;]+;?\s*/g, '');
    content = content.replace(/sessionStorage\.getItem\(['"]selectedBusinessId['"]\)/g, '');
    content = content.replace(/,\s*selectedBusinessId/g, '');
    content = content.replace(/selectedBusinessId\s*,/g, '');
    content = content.replace(/\[\s*selectedBusinessId\s*\]/g, '[]');
    content = content.replace(/enabled:\s*!!\s*selectedBusinessId\s*,?\s*/g, '');
    content = content.replace(/business_id:\s*selectedBusinessId\s*/g, 'business_id: 0');
    content = content.replace(/['"]business-id['"]:\s*selectedBusinessId[^,}]*/g, '');
    content = content.replace(/['"]X-Selected-Business-Id['"]:\s*selectedBusinessId[^,}]*/g, '');
    
    // Fix query syntax
    content = content.replace(/queryKey:\s*\[\s*(['"][^'"]+['"])\s*,\s*\]/g, 'queryKey: [$1]');
    content = content.replace(/queryKey:\s*\[\s*(['"][^'"]+['"])\s*,\s*$/gm, 'queryKey: [$1],');
    
    // Fix incomplete parameters
    content = content.replace(/business_id:\s*$/gm, 'business_id: 0,');
    content = content.replace(/headers\[['"]X-Selected-Business-Id['"]\]\s*=\s*$/gm, '// No business context needed');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${file}`);
  }
});

console.log('All files fixed!');
