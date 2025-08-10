// این یک تابع Node.js است که روی سرورهای Netlify اجرا می‌شود
exports.handler = async function(event, context) {
    
    // ما فعلاً فقط چک می‌کنیم که اطلاعات ارسال شده یا نه
    // در آینده اینجا کد اتصال به پایگاه داده را می‌نویسیم
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed",
        };
    }

    // اطلاعات فرم از event.body خوانده می‌شود
    // فعلاً فقط یک پیغام موفقیت برمی‌گردانیم
    const successMessage = {
        message: "ثبت نام شما با موفقیت (به صورت آزمایشی) دریافت شد!"
    };

    return {
        statusCode: 200, // کد 200 یعنی همه چیز موفقیت آمیز بود
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(successMessage) // پیغام را به صورت JSON برمی‌گردانیم
    };
};