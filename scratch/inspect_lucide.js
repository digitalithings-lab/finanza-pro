
const lucide = require('./node_modules/@lucide/angular/fesm2022/lucide-angular.mjs');
console.log(Object.keys(lucide).filter(k => k.includes('Module') || k.includes('Lucide')));
