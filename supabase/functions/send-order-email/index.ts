import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get('RESEND_API_KEY')!)

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { orderData, language = 'EN' } = await req.json()

    // Email to customer
    await resend.emails.send({
      from: 'orders@argenia.com',
      to: 'customer@example.com', // TEMP: Replace with actual customer email when collected
      subject: language === 'EN' ? 'Order Confirmation - Argenia' : 'تأكيد الطلب - أرجينيا',
      html: `
        <h1>${language === 'EN' ? 'Thank you for your order!' : 'شكراً لطلبك!'}</h1>
        <p>${language === 'EN' ? 'Your order has been received and is being processed.' : 'تم استلام طلبك ويتم معالجته الآن.'}</p>
        <h2>${language === 'EN' ? 'Order Details:' : 'تفاصيل الطلب:'}</h2>
        <ul>
          <li><strong>${language === 'EN' ? 'Product:' : 'المنتج:'}</strong> ${orderData.product_name}</li>
          ${orderData.product_color ? `<li><strong>${language === 'EN' ? 'Color:' : 'اللون:'}</strong> ${orderData.product_color}</li>` : ''}
          <li><strong>${language === 'EN' ? 'Quantity:' : 'الكمية:'}</strong> ${orderData.quantity}</li>
          <li><strong>${language === 'EN' ? 'Price:' : 'السعر:'}</strong> ${orderData.product_price} DZD</li>
          <li><strong>${language === 'EN' ? 'Name:' : 'الاسم:'}</strong> ${orderData.name}</li>
          <li><strong>${language === 'EN' ? 'Phone:' : 'الهاتف:'}</strong> ${orderData.phone}</li>
          <li><strong>${language === 'EN' ? 'State:' : 'الولاية:'}</strong> ${orderData.state}</li>
          <li><strong>${language === 'EN' ? 'Commune:' : 'البلدية:'}</strong> ${orderData.commune}</li>
          <li><strong>${language === 'EN' ? 'Address:' : 'العنوان:'}</strong> ${orderData.address}</li>
          ${orderData.notes ? `<li><strong>${language === 'EN' ? 'Notes:' : 'ملاحظات:'}</strong> ${orderData.notes}</li>` : ''}
        </ul>
      `
    })

    // Email to admin
    await resend.emails.send({
      from: 'orders@argenia.com',
      to: 'admin@argenia.com', // TODO: Replace with your actual email
      subject: language === 'EN' ? 'New Order Received - Argenia' : 'طلب جديد مستلم - أرجينيا',
      html: `
        <h1>${language === 'EN' ? 'New Order Received!' : 'طلب جديد مستلم!'}</h1>
        <h2>${language === 'EN' ? 'Order Details:' : 'تفاصيل الطلب:'}</h2>
        <ul>
          <li><strong>${language === 'EN' ? 'Product:' : 'المنتج:'}</strong> ${orderData.product_name}</li>
          ${orderData.product_color ? `<li><strong>${language === 'EN' ? 'Color:' : 'اللون:'}</strong> ${orderData.product_color}</li>` : ''}
          <li><strong>${language === 'EN' ? 'Quantity:' : 'الكمية:'}</strong> ${orderData.quantity}</li>
          <li><strong>${language === 'EN' ? 'Price:' : 'السعر:'}</strong> ${orderData.product_price} DZD</li>
          <li><strong>${language === 'EN' ? 'Name:' : 'الاسم:'}</strong> ${orderData.name}</li>
          <li><strong>${language === 'EN' ? 'Phone:' : 'الهاتف:'}</strong> ${orderData.phone}</li>
          <li><strong>${language === 'EN' ? 'State:' : 'الولاية:'}</strong> ${orderData.state}</li>
          <li><strong>${language === 'EN' ? 'Commune:' : 'البلدية:'}</strong> ${orderData.commune}</li>
          <li><strong>${language === 'EN' ? 'Address:' : 'العنوان:'}</strong> ${orderData.address}</li>
          ${orderData.notes ? `<li><strong>${language === 'EN' ? 'Notes:' : 'ملاحظات:'}</strong> ${orderData.notes}</li>` : ''}
        </ul>
      `
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Email sending error:', error)
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})