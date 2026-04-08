# Backend Setup Instructions

## Supabase Setup

1. **Create the orders table:**
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Run the SQL from `supabase-orders-table.sql`

2. **Deploy the Edge Function:**
   - Install Supabase CLI: `npm install -g supabase`
   - Login: `supabase login`
   - Link your project: `supabase link --project-ref YOUR_PROJECT_REF`
   - Deploy the function: `supabase functions deploy send-order-email`

3. **Set environment variables in Supabase:**
   - Go to Project Settings > Edge Functions
   - Add environment variable: `RESEND_API_KEY` with your Resend API key

4. **Update email addresses:**
   - In the Edge Function (`supabase/functions/send-order-email/index.ts`), replace:
     - `'customer@example.com'` with the customer's email (if you collect email)
     - `'admin@argenia.com'` with your actual admin email
   - In the client code, update the `from` email to a verified domain in Resend

## Environment Variables

Add these to your `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing

1. Submit an order through the website
2. Check Supabase dashboard > Table Editor > orders table
3. Check your email for notifications

## Notes

- Orders are stored in Supabase regardless of email sending status
- Email sending failures won't prevent order submission
- Make sure your Resend account has the sending domain verified