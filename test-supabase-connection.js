import { supabase } from './src/utils/supabase/client';

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...');
  
  try {
    // Test 1: Basic connection
    console.log('📡 Testing basic connection...');
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error);
      return false;
    }
    
    console.log('✅ Basic connection successful');
    console.log('📊 Sample data:', data);
    
    // Test 2: Check table structure
    console.log('🔍 Checking table structure...');
    const { data: structureData, error: structureError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (structureError) {
      console.error('❌ Structure check failed:', structureError);
    } else {
      console.log('✅ Table structure accessible');
      if (structureData && structureData.length > 0) {
        console.log('📋 Sample record structure:', Object.keys(structureData[0]));
      }
    }
    
    // Test 3: Test insert permissions
    console.log('🔍 Testing insert permissions...');
    const testOrder = {
      id: `TEST-${Date.now()}`,
      order_details: {
        items: [{ name: 'Test Item', quantity: 1, price: 100 }],
        total: 100,
        payment_method: 'Cash on Delivery'
      },
      customer_name: 'Test Customer',
      customer_phone: '+1234567890',
      customer_email: 'test@example.com',
      customer_address: 'Test Address',
      status: 'pending'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('orders')
      .insert([testOrder])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
      console.error('Error code:', insertError.code);
      console.error('Error message:', insertError.message);
      console.error('Error details:', insertError.details);
      return false;
    }
    
    console.log('✅ Insert test successful');
    console.log('📝 Inserted record:', insertData);
    
    // Clean up test record
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', testOrder.id);
    
    if (deleteError) {
      console.warn('⚠️ Could not clean up test record:', deleteError);
    } else {
      console.log('🧹 Test record cleaned up');
    }
    
    console.log('🎉 All Supabase tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the test
testSupabaseConnection().then(success => {
  if (success) {
    console.log('✅ Supabase connection is working perfectly!');
  } else {
    console.log('❌ Supabase connection has issues that need to be fixed.');
  }
});
