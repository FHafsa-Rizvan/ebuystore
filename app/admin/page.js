"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatPrice } from "@/data/products";
import ProductForm, { storagePathFromUrl, imagesOfRow, categoriesOfRow } from "@/components/admin/ProductForm";
import { CategoryTag } from "@/components/CategoryIcon";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Incorrect email or password.");
    setBusy(false);
  }

  return (
    <div className="admin-wrap" style={{ maxWidth: 420 }}>
      <form className="admin-card admin-form" onSubmit={handleSubmit}>
        <h1>Ebuy admin</h1>
        <label className="field">Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label className="field">Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
      </form>
    </div>
  );
}

function Dashboard({ email }) {
  const [rows, setRows] = useState(null);
  const [editing, setEditing] = useState(null); // null = list, "new" = add form, or a row = edit form
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else {
      setError("");
      setRows(data);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleStock(row) {
    const { error } = await supabase.from("products").update({ in_stock: !row.in_stock }).eq("id", row.id);
    if (error) setError(error.message);
    else load();
  }

  async function remove(row) {
    if (!window.confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", row.id);
    if (error) return setError(error.message);
    const paths = imagesOfRow(row).map(storagePathFromUrl).filter(Boolean);
    if (paths.length) await supabase.storage.from("product-images").remove(paths);
    load();
  }

  if (editing) {
    return (
      <div className="admin-wrap">
        <ProductForm
          product={editing === "new" ? null : editing}
          onSaved={() => {
            setEditing(null);
            load();
          }}
          onCancel={() => setEditing(null)}
        />
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <div className="admin-top">
        <div>
          <h1>Products</h1>
          <span className="who">Signed in as {email}</span>
        </div>
        <div className="admin-actions">
          <button className="btn" onClick={() => setEditing("new")}>+ Add product</button>
          <button className="btn btn-outline" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {rows === null && !error && <p className="empty">Loading products...</p>}
      {rows && rows.length === 0 && (
        <div className="admin-card empty">No products yet. Click "Add product" to create the first one.</div>
      )}

      {rows?.map((row) => (
        <div className="admin-row" key={row.id}>
          <div className="thumb" style={{ background: "#f1ede6" }}>
            {imagesOfRow(row)[0] ? <img src={imagesOfRow(row)[0]} alt={row.name} /> : <span>🛍️</span>}
          </div>
          <div className="meta">
            <div className="name">
              {row.name}
              {row.in_stock === false && <span className="badge-out">Out of stock</span>}
            </div>
            <div className="sub">
              {formatPrice(row.price)} · {imagesOfRow(row).length} {imagesOfRow(row).length === 1 ? "photo" : "photos"}
            </div>
            <div className="tags">
              {categoriesOfRow(row).length === 0
                ? <span className="tag tag-more">No category yet. Click Edit</span>
                : categoriesOfRow(row).map((id) => <CategoryTag key={id} id={id} />)}
            </div>
          </div>
          <div className="btns">
            <button className="btn btn-outline btn-sm" onClick={() => setEditing(row)}>Edit</button>
            <button className="btn btn-outline btn-sm" onClick={() => toggleStock(row)}>
              {row.in_stock === false ? "Mark in stock" : "Mark out of stock"}
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => remove(row)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState(undefined); // undefined = still checking

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-wrap">
        <div className="admin-card">
          <h1>Admin not set up yet</h1>
          <p className="admin-msg">
            Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to
            <code>.env.local</code>, then restart the site. See README.md for the steps.
          </p>
        </div>
      </div>
    );
  }

  if (session === undefined) return <p className="empty">Loading...</p>;
  if (!session) return <Login />;
  return <Dashboard email={session.user.email} />;
}