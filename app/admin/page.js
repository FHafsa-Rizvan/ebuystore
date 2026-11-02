"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatPrice } from "@/data/products";
import ProductForm, { imagesOfRow, categoriesOfRow } from "@/components/admin/ProductForm";
import {
  BUCKET, CACHE_SECONDS, THUMB_FOLDER, THUMB_MAX,
  resizeImage, storagePathFromUrl, thumbPath, thumbUrl, withThumbs,
} from "@/lib/images";
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
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50); // rows shown; "Show more" adds 50
  const [tool, setTool] = useState({ busy: false, msg: "" });

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
    if (paths.length) await supabase.storage.from(BUCKET).remove(withThumbs(paths));
    load();
  }

  // Creates small thumbnails for photos uploaded before thumbnails existed
  async function makeThumbnails() {
    setTool({ busy: true, msg: "Checking photos..." });
    try {
      const have = new Set();
      for (let offset = 0; ; offset += 1000) {
        const { data, error } = await supabase.storage.from(BUCKET).list(THUMB_FOLDER, { limit: 1000, offset });
        if (error) throw error;
        data.forEach((f) => have.add(f.name));
        if (data.length < 1000) break;
      }
      const todo = [...new Set((rows || []).flatMap(imagesOfRow))]
        .map((url) => ({ url, path: storagePathFromUrl(url) }))
        .filter((x) => x.path && !x.path.startsWith(`${THUMB_FOLDER}/`) && !have.has(x.path.split("/").pop()));

      if (todo.length === 0) return setTool({ busy: false, msg: "All photos already have thumbnails. Nothing to do." });

      let done = 0;
      let failed = 0;
      for (const item of todo) {
        setTool({ busy: true, msg: `Creating thumbnails: ${done + failed} of ${todo.length}. Please keep this page open.` });
        try {
          const blob = await (await fetch(item.url)).blob();
          const small = await resizeImage(blob, THUMB_MAX, 0.78);
          const { error } = await supabase.storage
            .from(BUCKET)
            .upload(thumbPath(item.path), small, { contentType: "image/jpeg", cacheControl: CACHE_SECONDS, upsert: true });
          if (error) throw error;
          done++;
        } catch {
          failed++;
        }
      }
      setTool({ busy: false, msg: `Done. ${done} thumbnails created${failed ? `, ${failed} could not be created (run it again)` : ""}.` });
    } catch (err) {
      setTool({ busy: false, msg: `Could not finish: ${err.message || "unknown error"}` });
    }
  }

  // Find a product by its code (EB-0012, or just 12) or by any part of its name
  const q = search.trim().toLowerCase();
  const shown = (rows || []).filter((r) => !q || `${r.code || ""} ${r.name}`.toLowerCase().includes(q));

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

      {rows && rows.length > 0 && (
        <div className="admin-search">
          <input
            type="search"
            placeholder="Search by product code or name, e.g. EB-0012"
            aria-label="Search products by code or name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setLimit(50);
            }}
          />
          <span>{q ? `${shown.length} of ${rows.length}` : `${rows.length} products`}</span>
        </div>
      )}
      {rows && rows.length > 0 && shown.length === 0 && (
        <div className="admin-card empty">No product matches "{search}".</div>
      )}

      {shown.slice(0, limit).map((row) => (
        <div className="admin-row" key={row.id}>
          <div className="thumb" style={{ background: "#f1ede6" }}>
            {imagesOfRow(row)[0] ? (
              <img
                src={thumbUrl(imagesOfRow(row)[0])}
                alt={row.name}
                loading="lazy"
                onError={(e) => {
                  if (e.currentTarget.dataset.full !== "1") {
                    e.currentTarget.dataset.full = "1";
                    e.currentTarget.src = imagesOfRow(row)[0];
                  }
                }}
              />
            ) : (
              <span>🛍️</span>
            )}
          </div>
          <div className="meta">
            <div className="name">
              {row.code && <span className="code">{row.code}</span>} {row.name}
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

      {shown.length > limit && (
        <button type="button" className="btn btn-outline show-more" onClick={() => setLimit((n) => n + 50)}>
          Show more ({shown.length - limit} left)
        </button>
      )}

      {rows && rows.length > 0 && (
        <div className="admin-card tool-card">
          <strong>Speed up photos</strong>
          <p>
            New photos get a small version for the shop automatically. Use this button once to create small versions
            of photos you uploaded earlier, so the shop loads faster and uses less data.
          </p>
          <button type="button" className="btn btn-outline" onClick={makeThumbnails} disabled={tool.busy}>
            {tool.busy ? "Working..." : "Create thumbnails for existing photos"}
          </button>
          {tool.msg && <p className="tool-msg" role="status">{tool.msg}</p>}
        </div>
      )}
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