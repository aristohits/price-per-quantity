import { describe, it, expect, beforeEach, vi } from 'vitest';
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('App Logic', () => {
  let dom;
  let window;
  let document;
  let app;

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
    dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
    window = dom.window;
    document = window.document;
    
    // Stub globals
    vi.stubGlobal('window', window);
    vi.stubGlobal('document', document);
    vi.stubGlobal('navigator', window.navigator);
    vi.stubGlobal('HTMLElement', window.HTMLElement);
    vi.stubGlobal('Node', window.Node);

    // Mock vibrate
    window.navigator.vibrate = vi.fn();
    
    // Mock scrollTo
    window.scrollTo = vi.fn();

    // Clear module cache to ensure fresh state for app.js
    delete require.cache[require.resolve('./app.js')];
    app = require('./app.js');
    
    // Attach functions to window
    Object.assign(window, app);
  });

  describe('Utility Functions', () => {
    it('should call vibrate', () => {
      app.vibrate(100);
      expect(window.navigator.vibrate).toHaveBeenCalledWith(100);
    });

    it('should show error message', () => {
      app.showError('Test Error');
      const errorEl = document.getElementById('errorMessage');
      expect(errorEl.classList.contains('hidden')).toBe(false);
      expect(errorEl.innerText).toBe('Test Error');
    });
  });

  describe('Calculator', () => {
    it('should clear the calculator expression', () => {
      app.setCalcExpression('1+2');
      app.calcClear();
      expect(app.getCalcExpression()).toBe('');
      expect(document.getElementById('calcDisplay').innerText).toBe('0');
    });

    it('should append values to the expression', () => {
      app.calcClick('1');
      app.calcClick('+');
      app.calcClick('2');
      expect(app.getCalcExpression()).toBe('1+2');
      expect(document.getElementById('calcDisplay').innerText).toBe('1+2');
    });

    it('should prevent multiple decimals in one number', () => {
      app.calcClick('1');
      app.calcClick('.');
      app.calcClick('2');
      app.calcClick('.');
      expect(app.getCalcExpression()).toBe('1.2');
    });

    it('should evaluate expression correctly', () => {
      app.setCalcExpression('10+20*2');
      app.calcEqual();
      expect(app.getCalcExpression()).toBe('50');
      expect(document.getElementById('calcDisplay').innerText).toBe('50');
    });

    it('should handle division by zero', () => {
      app.setCalcExpression('1/0');
      app.calcEqual();
      expect(app.getCalcExpression()).toBe('Infinity');
    });

    it('should handle invalid expressions', () => {
      app.setCalcExpression('1++2');
      app.calcEqual();
      expect(app.getCalcExpression()).toBe('Error');
    });

    it('should apply calculation result to input', () => {
      const input = document.getElementById('priceA');
      app.setActiveTargetInput('priceA');
      app.setCalcExpression('5*10');
      app.applyCalc();
      expect(input.value).toBe('50');
      expect(document.getElementById('calculatorModal').classList.contains('hidden')).toBe(true);
    });
  });

  describe('Product Management', () => {
    it('should add a new product', () => {
      const initialCount = app.getProductCount();
      app.addProduct();
      expect(app.getProductCount()).toBe(initialCount + 1);
      const char = String.fromCharCode(65 + initialCount);
      expect(document.getElementById(`card${char}`)).not.toBeNull();
    });

    it('should not add more than 26 products', () => {
      app.setProductCount(26);
      app.addProduct();
      expect(app.getProductCount()).toBe(26);
    });

    it('should remove a product', (done) => {
      app.addProduct(); // Add C
      const initialCount = app.getProductCount();
      app.removeProduct('C');
      
      // Wait for the timeout in removeProduct
      setTimeout(() => {
        expect(document.getElementById('cardC')).toBeNull();
        done();
      }, 300);
    });
  });

  describe('Comparison Logic', () => {
    it('should show error if fields are empty', () => {
      app.comparePrice();
      expect(document.getElementById('errorMessage').classList.contains('hidden')).toBe(false);
      expect(document.getElementById('errorMessage').innerText).toBe('กรุณากรอกข้อมูลให้ครบถ้วน');
    });

    it('should show error if quantity is 0 or negative', () => {
      document.getElementById('priceA').value = '10';
      document.getElementById('qtyA').value = '0';
      document.getElementById('priceB').value = '20';
      document.getElementById('qtyB').value = '1';
      app.comparePrice();
      expect(document.getElementById('errorMessage').innerText).toContain('ปริมาณของสินค้า A ต้องมากกว่า 0');
    });

    it('should correctly identify the cheapest product', () => {
      // Product A: 10 baht / 2 units = 5 per unit
      document.getElementById('priceA').value = '10';
      document.getElementById('qtyA').value = '2';
      // Product B: 20 baht / 5 units = 4 per unit
      document.getElementById('priceB').value = '20';
      document.getElementById('qtyB').value = '5';
      
      app.comparePrice();
      
      expect(document.getElementById('result').classList.contains('hidden')).toBe(false);
      expect(document.getElementById('winner').innerText).toContain('สินค้า B คุ้มค่าที่สุด!');
    });

    it('should handle tie in value', () => {
      document.getElementById('priceA').value = '10';
      document.getElementById('qtyA').value = '2';
      document.getElementById('priceB').value = '10';
      document.getElementById('qtyB').value = '2';
      
      app.comparePrice();
      
      expect(document.getElementById('winner').innerText).toContain('ราคาเท่ากันทุกสินค้า');
    });

    it('should handle multiple winners', () => {
      app.addProduct(); // Product C
      document.getElementById('priceA').value = '10';
      document.getElementById('qtyA').value = '2';
      document.getElementById('priceB').value = '10';
      document.getElementById('qtyB').value = '2';
      document.getElementById('priceC').value = '20';
      document.getElementById('qtyC').value = '2';
      
      app.comparePrice();
      
      expect(document.getElementById('winner').innerText).toContain('สินค้า A, B คุ้มค่าเท่ากัน!');
    });
  });

  describe('Form Reset', () => {
    it('should reset the form and remove extra products', () => {
      app.addProduct(); // Add C
      document.getElementById('priceA').value = '10';
      app.resetForm();
      
      expect(document.getElementById('priceA').value).toBe('');
      expect(document.getElementById('cardC')).toBeNull();
      expect(app.getProductCount()).toBe(2);
      expect(document.getElementById('result').classList.contains('hidden')).toBe(true);
    });
  });
});
