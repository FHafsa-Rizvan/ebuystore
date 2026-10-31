# Ebuy Shop

A Next.js storefront for Ebuy (homeware, glassware and more). Customers browse products, add them to a cart, and click **Buy Now on WhatsApp** to send their order to Ebuy as a pre-filled WhatsApp message.

Ebuy staff manage products (add, edit, photos, prices, out-of-stock, delete) at **/admin**, with no developer needed. Products and photos are stored in Supabase.

## 1. Run the site

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

Until Supabase is set up, the shop shows 12 sample products from `data/products.js` and `/admin` shows a "not set up" message.

## 2. Set up Supabase (one time, about 10 minutes)

1. Create a free account and a **New project** at supabase.com. Save the database password somewhere safe.
2. Open **SQL Editor**, click **New query**, paste the whole of `supabase/schema.sql`, and click **Run**. This creates the products table, the photo storage, and the security rules (anyone can view products, only logged-in admins can change them).
3. Go to **Project Settings -> API** and copy the **Project URL** and the **anon / publishable** key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```
4. Go to **Authentication -> Users -> Add user -> Create new user**. Enter the admin's email and a strong password, and tick **Auto Confirm User**. Repeat for each staff member who needs access.
5. **Important:** in **Authentication** settings (Sign In / Providers), turn **off** "Allow new users to sign up". Otherwise anyone could create an account and edit your products.
6. Restart `npm run dev`, open **http://localhost:3000/admin**, sign in, and add products.

Menu names in Supabase change occasionally, so look for the closest match if a label differs.

## Using the admin

- **Add product**: name, category (pick one or type a new one), price, description, photo.
- **Edit**: change anything; uploading a new photo replaces the old one.
- **Mark out of stock**: the product stays visible but cannot be added to a cart.
- **Delete**: removes the product and its photo.
- Photos are resized automatically in the browser, so phone photos are fine.

## Other settings

- **WhatsApp number**: `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` (country code, digits only, e.g. `94771234567`).
- **WhatsApp message wording**: `lib/whatsapp.js`.
- **Colors**: CSS variables at the top of `app/globals.css`.

## Deploy (Vercel)

Push to GitHub and import the repo in Vercel (free tier works). Add all three variables from `.env.local` under the project's Environment Variables.

## Project layout

```
app/             pages: home, product detail, cart, admin
components/      storefront components; components/admin has the product form
data/            sample products (used only until Supabase is set up)
lib/             Supabase client, product loading, WhatsApp message builder
supabase/        schema.sql (run once in Supabase)
```
