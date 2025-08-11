// کتابخانه Supabase را که نصب کردیم، وارد می‌کنیم
import { createClient } from '@supabase/supabase-js';

// تابع اصلی ما که روی سرور Netlify اجرا می‌شود
exports.handler = async function(event, context) {
    
    // کلیدهای مخفی را که در تنظیمات Netlify ذخیره کردیم، به صورت امن می‌خوانیم
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    // یک اتصال به پایگاه داده Supabase برقرار می‌کنیم
    const supabase = createClient(supabaseUrl, supabaseKey);

    // اطلاعاتی که کاربر در فرم وارد کرده را از event.body می‌خوانیم
    // نکته: Netlify اطلاعات فرم را به صورت یک رشته خاص ارسال می‌کند، باید آن را تبدیل کنیم
    const formData = new URLSearchParams(event.body);
    const email = formData.get('email');
    const phone_number = formData.get('phone');
    const password = formData.get('password'); // در آینده این را رمزنگاری می‌کنیم

    // دستور اصلی: اطلاعات را در جدول 'users' ذخیره کن
    const { data, error } = await supabase
        .from('users')
        .insert([
            { email: email, phone_number: phone_number, password: password }
        ]);

    // اگر خطایی در هنگام ذخیره کردن رخ داد، آن را برگردان
    if (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "خطا در ذخیره اطلاعات:", error: error.message })
        };
    }

    // اگر همه چیز موفقیت آمیز بود، یک پیغام جدید برگردان
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "کاربر با موفقیت در پایگاه داده ذخیره شد!" })
    };
};