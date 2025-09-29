// Simple Supabase connection test
const { createClient } = require('@jsr/supabase__supabase-js');

const projectId = "xdjndwdeepruvhprtjvt";
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhkam5kd2RlZXBydXZocHJ0anZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5OTQ0NjMsImV4cCI6MjA3NDU3MDQ2M30.w4NYWDsnha-AjdkfBHSmGMhZAAd4PmGdgwDUIdzhiSo";

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...');
  console.log('📡 Project ID:', projectId);
  console.log('🔑 Using public anon key:', publicAnonKey.substring(0, 20) + '...');
  
  try {
    // Test basic connection
    console.log('📡 Testing basic connection...');
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:');
      console.error('   Error code:', error.code);
      console.error('   Error message:', error.message);
      console.error('   Error details:', error.details);
      console.error('   Error hint:', error.hint);
      return false;
    }
    
    console.log('✅ Basic connection successful');
    console.log('📊 Sample data:', data);
    
    // Test table structure
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
        console.log('📋 Available columns:', Object.keys(structureData[0]));
      }
    }
    
    console.log('🎉 Supabase connection is working!');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('✅ All tests passed - Supabase is connected!');
  } else {
    console.log('❌ Connection failed - check the errors above');
  }
});
