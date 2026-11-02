"use client";

import { useEffect, useRef, useState } from "react";
import { LuCheck, LuStar, LuX } from "react-icons/lu";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, LEGACY_CATEGORY } from "@/lib/categories";
import { CategoryIcon } from "@/components/CategoryIcon";
import {
  BUCKET, CACHE_SECONDS, FULL_MAX, THUMB_MAX,
  resizeImage, storagePathFromUrl, thumbPath, withThumbs,
} from "@/lib/images";

const MAX_IMAGES = 6;

// All saved image URLs of a product row (new `images` list, or the old single image)
export function imagesOfRow(row) {
  if (Array.isArray(row?.images) && row.images.length) return row.images;
  return row?.image_url ? [row.image_url] : [];
}

// Category ids of a product row (new `categories` list, or the old single category)
export function categoriesOfRow(row) {
  if (Array.isArray(row?.categories) && row.categories.length) return row.categories;
  const legacy = LEGACY_CATEGORY[String(row?.category || "").toLowerCase()];
  return legacy ? [legacy] : [];
}

export default function ProductForm({ product, onSaved, onCancel }) {
  const editing = Boolean(product);
  const [name, setName] = useState(product?.name || "");
  const [cats, setCats] = useState(() => categoriesOfRow(product));
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [description, setDescription] = useState(product?.description || "");
  const [inStock, setInStock] = useState(product ? product.in_stock !== false : true);
  // Each photo: { key, url (saved or preview), file (only for new photos) }
  const [photos, setPhotos] = useState(() =>
    imagesOfRow(product).map((url) => ({ key: url, url, file: null }))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // Product code: existing products keep theirs; a new product gets the next one reserved now
  const [code, setCode] = useState(product?.code || "");
  const fileInput = useRef(null);

  useEffect(() => {
    if (editing) return;
    let cancelled = false;
    supabase.rpc("next_product_code").then(({ data, error: rpcErr }) => {
      if (cancelled) return;
      if (rpcErr || !data) {
        setError("Could not create a product code. Run supabase/migration-product-codes.sql in Supabase first.");
      } else {
        setCode(data);
      }
    });
    return () => { cancelled = true; };
  }, [editing]);

  const toggleCat = (id) =>
    setCats((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    if (files.some((f) => !f.type.startsWith("image/"))) {
      return setError("Please choose image files only (JPG or PNG).");
    }
    const room = MAX_IMAGES - photos.length;
    if (files.length > room) {
      setError(`You can add up to ${MAX_IMAGES} photos per product.`);
    } else {
      setError("");
    }
    const added = files.slice(0, Math.max(0, room)).map((file) => ({
      key: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    }));
    setPhotos((p) => [...p, ...added]);
  }

  const removePhoto = (key) => setPhotos((p) => p.filter((x) => x.key !== key));
  const makeMain = (key) =>
    setPhotos((p) => {
      const chosen = p.find((x) => x.key === key);
      return [chosen, ...p.filter((x) => x.key !== key)];
    });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const priceNum = Math.round(Number(price));
    if (!editing && !code) return setError("The product code is not ready yet. Please wait a moment and try again.");
    if (!name.trim()) return setError("Please enter the product name.");
    if (cats.length === 0) return setError("Please choose at least one category.");
    if (price.trim() === "" || !Number.isFinite(priceNum) || priceNum < 0) {
      return setError("Please enter a valid price.");
    }

    setSaving(true);
    const uploaded = []; // files uploaded in this save, removed again if saving fails
    try {
      const urls = [];
      for (const p of photos) {
        if (!p.file) {
          urls.push(p.url);
          continue;
        }
        // Two sizes: full photo for the product page, small one for the shop cards
        const full = await resizeImage(p.file, FULL_MAX, 0.82);
        const small = await resizeImage(p.file, THUMB_MAX, 0.78);
        const path = `${crypto.randomUUID()}.jpg`;
        const opts = { contentType: "image/jpeg", cacheControl: CACHE_SECONDS };
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, full, opts);
        if (upErr) throw upErr;
        uploaded.push(path);
        const { error: thErr } = await supabase.storage.from(BUCKET).upload(thumbPath(path), small, opts);
        if (thErr) throw thErr;
        uploaded.push(thumbPath(path));
        urls.push(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
      }

      const row = {
        ...(editing ? {} : { code }),
        name: name.trim(),
        categories: cats,
        price: priceNum,
        description: description.trim(),
        in_stock: inStock,
        images: urls,
        image_url: urls[0] || null,
      };

      const { error: dbErr } = editing
        ? await supabase.from("products").update(row).eq("id", product.id)
        : await supabase.from("products").insert(row);
      if (dbErr) throw dbErr;

      // Only remove photos the admin deleted once the product saved successfully
      const gone = imagesOfRow(product)
        .filter((u) => !urls.includes(u))
        .map(storagePathFromUrl)
        .filter(Boolean);
      if (gone.length) await supabase.storage.from(BUCKET).remove(withThumbs(gone));

      onSaved();
    } catch (err) {
      if (uploaded.length) await supabase.storage.from(BUCKET).remove(uploaded);
      setError(err.message || "Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form className="admin-card admin-form" onSubmit={handleSubmit}>
      <h2>{editing ? "Edit product" : "Add product"}</h2>

      <div className="code-box">
        <span>Product code</span>
        <strong>{code || (editing ? "Not assigned yet" : "Creating...")}</strong>
        <small>{editing ? "Customers quote this on WhatsApp. It never changes." : "Created automatically. Customers will quote this on WhatsApp."}</small>
      </div>

      <label className="field">Product name *
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label className="field">Price (Rs.) *
        <input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
      </label>

      <div className="field">Categories * <span className="hint">(tick every one that fits)</span>
        <div className="cat-picker">
          {CATEGORIES.map((c) => {
            const on = cats.includes(c.id);
            return (
              <button
                type="button"
                key={c.id}
                className={`cat-pick${on ? " on" : ""}`}
                aria-pressed={on}
                onClick={() => toggleCat(c.id)}
              >
                <CategoryIcon id={c.id} size={20} box={34} radius={10} />
                <span>{c.label}</span>
                {on && <LuCheck className="cat-pick-check" size={16} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>

      <label className="field">Description
        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      <div className="field">Photos <span className="hint">(up to {MAX_IMAGES}. The first one is the main photo)</span>
        <div className="photo-grid">
          {photos.map((p, i) => (
            <div className="photo" key={p.key}>
              <img src={p.url} alt={`Photo ${i + 1}`} />
              {i === 0 ? (
                <span className="photo-main"><LuStar size={12} aria-hidden="true" /> Main</span>
              ) : (
                <button type="button" className="photo-make" onClick={() => makeMain(p.key)}>Make main</button>
              )}
              <button type="button" className="photo-x" onClick={() => removePhoto(p.key)} aria-label={`Remove photo ${i + 1}`}>
                <LuX size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
          {photos.length < MAX_IMAGES && (
            <button type="button" className="photo-add" onClick={() => fileInput.current?.click()}>
              <span>+</span>
              Add photos
            </button>
          )}
        </div>
        <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
      </div>

      <label className="check">
        <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
        In stock (untick to show "Out of stock" on the shop)
      </label>

      {error && <p className="error">{error}</p>}

      <div className="buttons">
        <button type="submit" className="btn" disabled={saving}>
          {saving ? "Saving..." : editing ? "Save changes" : "Add product"}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}