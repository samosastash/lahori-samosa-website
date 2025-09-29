// Test the updated order structure
const { createClient } = require('@jsr/supabase__supabase-js');

const projectId = "xdjndwdeepruvhprtjvt";
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhkam5kd2RlZXBydXZocHJ0anZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5OTQ0NjMsImV4cCI6MjA3NDU3MDQ2M30.w4NYWDsnha-AjdkfBHSmGMhZAAd4PmGdgwDUIdzhiSo";

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

async function testOrderInsert() {
  console.log('🧪 Testing Order Insert with Updated Structure...');
  
  const testOrder = {
    id: `TEST-${Date.now()}`,
    order_details: {
      items: [
        { name: 'Pizza Samosa (12p)', quantity: 2, price: 650 },
        { name: 'Tiki Samosa', quantity: 1, price: 300 }
      ],
      total: 1600,
      payment_method: 'Cash on Delivery'
    },
    customer_name: 'Test Customer',
    customer_phone: '+923244060113',
    total_price: 1600
  };
  
  console.log('📝 Test order data:', JSON.stringify(testOrder, null, 2));
  
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([testOrder])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Insert failed:');
      console.error('   Error code:', error.code);
      console.error('   Error message:', error.message);
      console.error('   Error details:', error.details);
      return false;
    }
    
    console.log('✅ Insert successful!');
    console.log('📊 Inserted data:', data);
    
    // Clean up
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', testOrder.id);
    
    if (deleteError) {
      console.warn('⚠️ Could not clean up:', deleteError);
    } else {
      console.log('🧹 Test record cleaned up');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

testOrderInsert().then(success => {
  if (success) {
    console.log('🎉 Order insert test passed! The structure is correct.');
  } else {
    console.log('❌ Order insert test failed. Check the errors above.');
  }
});
