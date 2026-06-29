import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const CATEGORIES = ["Birthday", "Anniversary", "Romance", "Congratulations", "Sympathy", "Everyday", "Wedding", "Chocolates"];

const ProductFormModal = ({ product, onClose, onSaved }) => {
  const isEdit = Boolean(product);
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "Everyday",
    stock: product?.stock ?? 10,
    isNewCollection: product?.isNewCollection || false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEdit && !imageFile) {
      toast.error("Please add a photo of the bouquet.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);

      if (isEdit) {
        await api.put(`/api/products/${product._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Bouquet updated");
      } else {
        await api.post("/api/products", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Bouquet added to the store");
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save bouquet.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? "Edit Bouquet" : "Add New Bouquet"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Bouquet name (this shows bold on the storefront)</label>
            <input
              className="input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Description (visible when a customer taps the bouquet)</label>
            <textarea
              className="textarea"
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="field-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="field">
              <label>Price (₹)</label>
              <input
                className="input"
                type="number"
                min="0"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Stock</label>
              <input
                className="input"
                type="number"
                min="0"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>
          <div className="field">
            <label>Category</label>
            <select
              className="select"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Photo {isEdit && "(leave empty to keep current photo)"}</label>
            <input
              className="input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>
          <div className="checkbox-row">
            <input
              type="checkbox"
              id="isNew"
              checked={form.isNewCollection}
              onChange={(e) => setForm({ ...form, isNewCollection: e.target.checked })}
            />
            <label htmlFor="isNew">Mark as New Collection</label>
          </div>
          <div className="admin-modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Bouquet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
