import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";
import ProductFormModal from "./ProductFormModal";
import { getImageUrl } from "../../utils/image";


const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState(undefined); // undefined = closed, null = add new, object = edit

  const fetchProducts = () => {
    setLoading(true);
    api
      .get("/api/products/admin/all")
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchProducts, []);

  const handleSaved = () => {
    setModalProduct(undefined);
    fetchProducts();
  };

  const handleDelete = async (product) => {
    if (!confirm(`Remove "${product.name}" from the store? Past orders won't be affected.`)) return;
    try {
      await api.delete(`/api/products/${product._id}`);
      toast.success("Bouquet removed");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove bouquet.");
    }
  };

  return (
    <AdminLayout>
      <div className="toolbar">
        <h2>Bouquets</h2>
        <button className="btn btn-primary" onClick={() => setModalProduct(null)}>
          + Add Bouquet
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img className="table-thumb" src={getImageUrl(p.image)} alt={p.name} />
                  </td>
                  <td>
                    <strong>{p.name}</strong> {p.isNewCollection && <span className="tag tag-new">New</span>}
                  </td>
                  <td>{p.category}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                  <td>{p.isActive ? "Live" : "Hidden"}</td>
                  <td>
                    <button className="btn-ghost" onClick={() => setModalProduct(p)}>
                      Edit
                    </button>
                    {p.isActive && (
                      <button className="btn-ghost" style={{ color: "var(--rosewood)" }} onClick={() => handleDelete(p)}>
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalProduct !== undefined && (
        <ProductFormModal
          product={modalProduct}
          onClose={() => setModalProduct(undefined)}
          onSaved={handleSaved}
        />
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
