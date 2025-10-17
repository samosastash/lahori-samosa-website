// Console Ninja Test - This file tests if Console Ninja extension is working
// You can delete this file after testing

export function testConsoleNinja() {
  console.log('🧪 Testing Console Ninja Extension...');
  
  // Test different types of console logs
  console.log('📝 Simple log message');
  console.warn('⚠️ Warning message');
  console.error('❌ Error message');
  console.info('ℹ️ Info message');
  
  // Test object logging
  const testObject = {
    name: 'Lahori Samosa',
    price: 650,
    category: 'Frozen Food',
    inStock: true,
    tags: ['authentic', 'pakistani', 'frozen']
  };
  
  console.log('🛒 Product Object:', testObject);
  
  // Test array logging
  const products = [
    { name: 'Pizza Samosa', price: 650 },
    { name: 'BBQ Samosa', price: 600 },
    { name: 'Potato Samosa', price: 300 }
  ];
  
  console.log('📦 Products Array:', products);
  
  // Test function logging
  const calculateTotal = (items: any[]) => {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    console.log('💰 Total calculation:', { items: items.length, total });
    return total;
  };
  
  calculateTotal(products);
  
  // Test async logging
  setTimeout(() => {
    console.log('⏰ Async log after 1 second');
  }, 1000);
  
  // Test error with stack trace
  try {
    throw new Error('Test error for Console Ninja');
  } catch (error) {
    console.error('🚨 Caught error:', error);
  }
  
  console.log('✅ Console Ninja test completed!');
  console.log('💡 If you see enhanced console output with better formatting, Console Ninja is working!');
}

// Auto-run test when imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  testConsoleNinja();
}
