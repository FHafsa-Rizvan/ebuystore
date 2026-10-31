"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const BUCKET = "product-images";

// Phone photos are often 5 MB+. Shrink to max 1200px JPEG before uploading.
async function resizeImage(file, max = 1200) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  if (!blob) throw new Error("Could not process this image. Try a JPG or PNG photo.");
  return blob;
}

// Works out the file path inside the bucket from a public image URL.
export function storagePathFromUrl(url) {
  if (!url) return null;
  const marker = `/${BUCKET}/`;
  const i = url.indexOf(marker);
  return i >= 0 ? decodeURIComponent(url.slice(i + marker.length)) : null;
}

export default function ProductForm({ product, categories, onSaved, onCancel }) {
  const editing = Boolean(product);
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(product?.category || "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [description, setDescription] = useState(product?.description || "");
  const [inStock, setInStock] = useState(product ? product.in_stock !== false : true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(product?.image_url || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (JPG or PNG).");
      return;
    }
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const priceNum = Math.round(Number(price));
    if (!name.trim() || !category.trim()) return setError("Name and category are required.");
    if (price.trim() === "" || !Number.isFinite(priceNum) || priceNum < 0) {
      return setError("Please enter a valid price.");
    }

    setSaving(true);
    try {
      let imageUrl = product?.image_url || null;
      let oldPath = null;

      if (file) {
        const blob = await resizeImage(file);
        const path = `${crypto.randomUUID()}.jpg`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, blob, { contentType: "image/jpeg" });
        if (upErr) throw upErr;
        imageUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
        oldPath = storagePathFromUrl(product?.image_url);
      }

      const row = {
        name: name.trim(),
        category: category.trim(),
        price: priceNum,
        description: description.trim(),
        in_stock: inStock,
        image_url: imageUrl,
      };

      const { error: dbErr } = editing
        ? await supabase.from("products").update(row).eq("id", product.id)
        : await supabase.from("products").insert(row);
      if (dbErr) throw dbErr;

      // Only remove the replaced photo once the product saved successfully
      if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath]);

      onSaved();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form className="admin-card admin-form" onSubmit={handleSubmit}>
      <h2>{editing ? "Edit product" : "Add product"}</h2>

      <label className="field">Product name *
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <div className="row2">
        <label className="field">Category *
          <input list="category-options" value={category} onChange={(e) => setCategory(e.target.value)} />
          <datalist id="category-options">
            {categories.map((c) => <option key={c} value={c} />)}
          </datalist>
        </label>
        <label className="field">Price (Rs.) *
          <input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
      </div>

      <label className="field">Description
        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      <div className="field">Photo
        {preview && <img className="preview" src={preview} alt="Product preview" />}
        <input type="file" accept="image/*" onChange={handleFile} />
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
