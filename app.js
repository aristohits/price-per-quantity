// Register Service Worker for PWA
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW Registered!', reg))
      .catch(err => console.log('SW Failed!', err));
  });
}

let activeTargetInput = null;
let calcExpression = '';
let productCount = 2; // Default A and B
const productColors = [
  { name: 'indigo', text: 'text-indigo-400', bg: 'bg-indigo-500', border: 'hover:border-indigo-500', ring: 'focus:ring-indigo-900/30', focusBorder: 'focus:border-indigo-500' },
  { name: 'emerald', text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'hover:border-emerald-500', ring: 'focus:ring-emerald-900/30', focusBorder: 'focus:border-emerald-500' },
  { name: 'violet', text: 'text-violet-400', bg: 'bg-violet-500', border: 'hover:border-violet-500', ring: 'focus:ring-violet-900/30', focusBorder: 'focus:border-violet-500' },
  { name: 'amber', text: 'text-amber-400', bg: 'bg-amber-500', border: 'hover:border-amber-500', ring: 'focus:ring-amber-900/30', focusBorder: 'focus:border-amber-500' },
  { name: 'rose', text: 'text-rose-400', bg: 'bg-rose-500', border: 'hover:border-rose-500', ring: 'focus:ring-rose-900/30', focusBorder: 'focus:border-rose-500' },
  { name: 'cyan', text: 'text-cyan-400', bg: 'bg-cyan-500', border: 'hover:border-cyan-500', ring: 'focus:ring-cyan-900/30', focusBorder: 'focus:border-cyan-500' }
];

function vibrate(ms = 20) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(ms);
  }
}

function addProduct() {
  vibrate(15);
  if (productCount >= 26) return; // Limit to Z
  
  const char = String.fromCharCode(65 + productCount);
  const color = productColors[productCount % productColors.length];
  
  const card = document.createElement('div');
  card.id = `card${char}`;
  card.className = `bg-slate-800/50 rounded-2xl p-5 border border-slate-700 transition-all ${color.border} group relative animate-scale-up`;
  
  card.innerHTML = `
    <button type="button" onclick="removeProduct('${char}')" class="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors p-1" title="ลบสินค้า">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
    <h2 class="font-bold mb-4 ${color.text} flex items-center gap-2">
      <span class="w-2 h-2 rounded-full ${color.bg}"></span>
      สินค้า ${char}
    </h2>
    <div class="space-y-3">
      <div>
        <label for="price${char}" class="block text-xs font-semibold text-slate-400 mb-1 ml-1">ราคา สินค้า ${char}</label>
        <div class="relative">
          <input id="price${char}" type="number" placeholder="ราคา (บาท)" step="0.01" min="0" inputmode="decimal" required
            class="w-full p-3 pr-12 bg-slate-800 border border-slate-700 rounded-xl focus:ring-4 ${color.ring} ${color.focusBorder} outline-none transition-all placeholder:text-slate-500 font-medium text-white" />
          <button type="button" onclick="openCalculator('price${char}')" class="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-700 rounded-lg transition-colors ${color.text}" title="เปิดเครื่องคิดเลข">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
      <div>
        <label for="qty${char}" class="block text-xs font-semibold text-slate-400 mb-1 ml-1">ปริมาณ สินค้า ${char}</label>
        <div class="relative">
          <input id="qty${char}" type="number" placeholder="ปริมาณ" step="any" min="0.0001" inputmode="decimal" required
            class="w-full p-3 pr-12 bg-slate-800 border border-slate-700 rounded-xl focus:ring-4 ${color.ring} ${color.focusBorder} outline-none transition-all placeholder:text-slate-500 font-medium text-white" />
          <button type="button" onclick="openCalculator('qty${char}')" class="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-700 rounded-lg transition-colors ${color.text}" title="เปิดเครื่องคิดเลข">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('productContainer').appendChild(card);
  productCount++;
  if (card.scrollIntoView) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function removeProduct(char) {
  vibrate(10);
  const card = document.getElementById(`card${char}`);
  if (card) {
    card.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
      card.remove();
    }, 200);
  }
}

function openCalculator(id) {
  vibrate(10);
  activeTargetInput = id;
  calcExpression = '';
  updateCalcDisplay('0');
  document.getElementById('calculatorModal').classList.remove('hidden');
  document.getElementById('calculatorModal').classList.add('flex');
  window.addEventListener('keydown', handleCalcKeyboard);
}

function closeCalculator() {
  vibrate(5);
  document.getElementById('calculatorModal').classList.add('hidden');
  document.getElementById('calculatorModal').classList.remove('flex');
  activeTargetInput = null;
  window.removeEventListener('keydown', handleCalcKeyboard);
}

function handleCalcKeyboard(e) {
  const key = e.key;
  if (/[0-9\+\-\*\/\.]/.test(key)) {
    calcClick(key);
  } else if (key === 'Enter' || key === '=') {
    calcEqual();
  } else if (key === 'Escape') {
    closeCalculator();
  } else if (key === 'Backspace') {
    vibrate(5);
    calcExpression = calcExpression.slice(0, -1);
    updateCalcDisplay(calcExpression);
  } else if (key === 'c' || key === 'C') {
    calcClear();
  }
}

function calcClick(val) {
  vibrate(10);
  if (calcExpression === 'Error' || calcExpression === 'Infinity') calcExpression = '';
  
  // Prevent multiple decimals in a single number
  if (val === '.') {
    const parts = calcExpression.split(/[\+\-\*\/]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('.')) return;
  }
  
  calcExpression += val;
  updateCalcDisplay(calcExpression);
}

function calcClear() {
  vibrate(15);
  calcExpression = '';
  updateCalcDisplay('0');
}

function calcEqual() {
  vibrate(20);
  if (!calcExpression) return;
  try {
    const result = Function('"use strict";return (' + calcExpression + ')')();
    if (!isFinite(result)) {
      calcExpression = 'Infinity';
    } else {
      calcExpression = result.toString();
    }
    updateCalcDisplay(calcExpression);
  } catch (e) {
    calcExpression = 'Error';
    updateCalcDisplay('Error');
  }
}

function applyCalc() {
  vibrate(25);
  calcEqual();
  const resultValue = parseFloat(calcExpression);
  if (!isNaN(resultValue) && isFinite(resultValue)) {
    const input = document.getElementById(activeTargetInput);
    input.value = resultValue;
    closeCalculator();
  }
}

function updateCalcDisplay(str) {
  document.getElementById('calcDisplay').innerText = str || '0';
}

function resetForm() {
  vibrate(30);
  document.getElementById("compareForm").reset();
  document.getElementById("errorMessage").classList.add("hidden");
  document.getElementById("result").classList.add("hidden");
  
  const container = document.getElementById('productContainer');
  const cards = container.querySelectorAll('[id^="card"]');
  cards.forEach(card => {
    const id = card.id.replace('card', '');
    if (id !== 'A' && id !== 'B') {
      card.remove();
    }
  });
  productCount = 2;
  
  if (window.scrollTo) window.scrollTo({ top: 0, behavior: 'smooth' });
}

function comparePrice() {
  vibrate(40);
  const container = document.getElementById('productContainer');
  const cards = container.querySelectorAll('[id^="card"]');
  const products = [];
  const errorEl = document.getElementById("errorMessage");
  const resultEl = document.getElementById("result");
  const resultListEl = document.getElementById("resultList");
  const winnerEl = document.getElementById("winner");
  
  errorEl.classList.add("hidden");
  resultEl.classList.add("hidden");
  resultListEl.innerHTML = '';

  for (let card of cards) {
    const id = card.id.replace('card', '');
    const price = parseFloat(document.getElementById(`price${id}`).value);
    const qty = parseFloat(document.getElementById(`qty${id}`).value);

    if (isNaN(price) || isNaN(qty)) {
      showError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (qty <= 0) {
      showError(`ปริมาณของสินค้า ${id} ต้องมากกว่า 0`);
      return;
    }

    if (price < 0) {
      showError(`ราคาของสินค้า ${id} ไม่สามารถติดลบได้`);
      return;
    }

    products.push({
      id: id,
      unitPrice: price / qty,
      colorClass: card.querySelector('h2').className.split(' ').find(c => c.startsWith('text-'))
    });
  }

  if (products.length < 2) {
    showError("กรุณาเพิ่มสินค้าอย่างน้อย 2 รายการเพื่อเปรียบเทียบ");
    return;
  }

  const minUnitPrice = Math.min(...products.map(p => p.unitPrice));
  const winners = products.filter(p => Math.abs(p.unitPrice - minUnitPrice) < 0.000001);

  resultEl.classList.remove("hidden");
  
  const formatOptions = { minimumFractionDigits: 2, maximumFractionDigits: 4 };
  
  products.forEach(p => {
    const pEl = document.createElement('p');
    pEl.className = "text-slate-300 font-medium flex justify-between items-center";
    pEl.innerHTML = `
      <span>สินค้า ${p.id}:</span>
      <span class="${p.colorClass}">${p.unitPrice.toLocaleString('th-TH', formatOptions)} บาท / หน่วย</span>
    `;
    resultListEl.appendChild(pEl);
  });

  if (winners.length === 1) {
    winnerEl.innerText = `✨ สินค้า ${winners[0].id} คุ้มค่าที่สุด!`;
    winnerEl.className = "p-4 rounded-xl font-bold text-center text-lg shadow-sm bg-slate-800 text-emerald-400 animate-bounce-short border border-emerald-900/30";
  } else if (winners.length === products.length) {
    winnerEl.innerText = "⚖️ ราคาเท่ากันทุกสินค้า";
    winnerEl.className = "p-4 rounded-xl font-bold text-center text-lg shadow-sm bg-slate-800 text-slate-400 border border-slate-700";
  } else {
    const winnerIds = winners.map(w => w.id).join(', ');
    winnerEl.innerText = `✨ สินค้า ${winnerIds} คุ้มค่าเท่ากัน!`;
    winnerEl.className = "p-4 rounded-xl font-bold text-center text-lg shadow-sm bg-slate-800 text-emerald-400 animate-bounce-short border border-emerald-900/30";
  }

  if (resultEl.scrollIntoView) resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showError(msg) {
  vibrate([50, 30, 50]);
  const errorEl = document.getElementById("errorMessage");
  errorEl.innerText = msg;
  errorEl.classList.remove("hidden");
}

// Export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    vibrate, addProduct, removeProduct, openCalculator, closeCalculator,
    handleCalcKeyboard, calcClick, calcClear, calcEqual, applyCalc,
    updateCalcDisplay, resetForm, comparePrice, showError,
    getCalcExpression: () => calcExpression,
    setCalcExpression: (val) => calcExpression = val,
    getProductCount: () => productCount,
    setProductCount: (val) => productCount = val,
    setActiveTargetInput: (val) => activeTargetInput = val
  };
}
