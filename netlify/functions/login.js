import { createClient } from '@supabase/supabase-js';

exports.handler = async function(event, context) {
    // اتصال به پایگاه داده (مانند قبل)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // دریافت ایمیل و رمز عبور از فرم
    const formData = new URLSearchParams(event.body);
    const email = formData.get('email');
    const password = formData.get('password');

    // جستجو در جدول 'users' برای پیدا کردن کاربری با این ایمیل
    const { data, error } = await supabase
        .from('users')
        .select('*') // تمام اطلاعات کاربر را انتخاب کن
        .eq('email', email) // جایی که ایمیل برابر با ایمیل ورودی باشد
        .single(); // ما انتظار داریم فقط یک نتیجه پیدا شود

    // بررسی خطاها یا پیدا نشدن کاربر
    if (error || !data) {
        return {
            statusCode: 404, // Not Found
            body: JSON.stringify({ message: "کاربری با این ایمیل یافت نشد." })
        };
    }

    // مقایسه رمز عبور ورودی با رمز عبور ذخیره شده در پایگاه داده
    if (data.password !== password) {
        // نکته امنیتی: در آینده این مقایسه باید با رمزنگاری (hashing) انجام شود
        return {
            statusCode: 401, // Unauthorized
            body: JSON.stringify({ message: "رمز عبور اشتباه است." })
        };
    }

    // اگر همه چیز درست بود، ورود موفقیت آمیز است
    // ما اطلاعات کاربر را برمی‌گردانیم تا در فرانت‌اند استفاده شود
    return {
        statusCode: 200,
        body: JSON.stringify({ 
            message: "ورود با موفقیت انجام شد!",
            user: { id: data.id, email: data.email } 
        })
    };
};