import { useState, useRef } from "react";
import "./Product-Form.css";
import { X, Upload, Plus, Trash2, ChevronDown } from "lucide-react";

// Constants pulled from the Products.js model
const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const CATEGORIES = ["tshirt", "hoodie", "tote", "mug", "sticker", "keychain", "print3D", "other"];
const NECK_TYPES = ["round", "v-neck"]; 
const V_NECK_DEPTHS = ["shallow", "classic", "medium", "deep", "plunging"];

const EMPTY_COLOR = { name: { en: "", fr: "" }, hex: "#000000" };
const EMPTY_VARIANT = { size: "", colorName: "", stock: 0 };

// Helper
const buildFormData = (fields, images) => {
  const fd = new FormData();

  fd.append("name", JSON.stringify(fields.name));
  fd.append("description", JSON.stringify(fields.description));
  fd.append("price", fields.price);
  fd.append("category", fields.category);
  fd.append("sizes", JSON.stringify(fields.sizes));
  fd.append("colors", JSON.stringify(fields.colors));
  fd.append("variants", JSON.stringify(fields.variants));

  if (fields.neckType) fd.append("neckType", fields.neckType);
  if (fields.vNeckDepth) fd.append("vNeckDepth", fields.vNeckDepth);
  if (fields.vNeckDepthLabels)
    fd.append("vNeckDepthLabels", JSON.stringify(fields.vNeckDepthLabels));

  images.forEach((img) => fd.append("images", img));

  return fd;
};

// Sub-components

const SectionTitle = ({ children }) => (
  <h3 className="pf-section-title">{children}</h3>
);

const Field = ({ label, children, hint }) => (
  <div className="pf-field">
    <label className="pf-label">{label}</label>
    {children}
    {hint && <span className="pf-hint">{hint}</span>}
  </div>
);

const BilingualInput = ({ label, values, onChange, multiline = false, required = false }) => (
  <div className="pf-bilingual">
    <label className="pf-label">{label}</label>
    <div className="pf-bilingual-row">
      <div className="pf-bilingual-col">
        <span className="pf-lang-badge">EN</span>
        {multiline ? (
          <textarea
            className="pf-input pf-textarea"
            value={values.en}
            required={required}
            placeholder={`${label} in English`}
            onChange={(e) => onChange("en", e.target.value)}
          />
        ) : (
          <input
            className="pf-input"
            type="text"
            value={values.en}
            required={required}
            placeholder={`${label} in English`}
            onChange={(e) => onChange("en", e.target.value)}
          />
        )}
      </div>
      <div className="pf-bilingual-col">
        <span className="pf-lang-badge">FR</span>
        {multiline ? (
          <textarea
            className="pf-input pf-textarea"
            value={values.fr}
            required={required}
            placeholder={`${label} en français`}
            onChange={(e) => onChange("fr", e.target.value)}
          />
        ) : (
          <input
            className="pf-input"
            type="text"
            value={values.fr}
            required={required}
            placeholder={`${label} en français`}
            onChange={(e) => onChange("fr", e.target.value)}
          />
        )}
      </div>
    </div>
  </div>
);

// Main component

const ProductForm = ({ onClose, onSuccess }) => {
  // ── Core fields
  const [name, setName] = useState({ en: "", fr: "" });
  const [description, setDescription] = useState({ en: "", fr: "" });
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);

  // ── Sizes — multi-select toggle
  const [sizes, setSizes] = useState([]);

  // ── Colors
  const [colors, setColors] = useState([{ ...EMPTY_COLOR }]);

  // ── Neck type (optional)
  const [neckType, setNeckType] = useState("");
  const [vNeckDepth, setVNeckDepth] = useState("");

  // ── Variants
  const [variants, setVariants] = useState([{ ...EMPTY_VARIANT }]);

  // ── Images
  const [imageFiles, setImageFiles] = useState([]);   // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // data URLs
  const fileInputRef = useRef(null);

  // ── UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Image handlers
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newFiles = [...imageFiles, ...files].slice(0, 10); // cap at 10
    setImageFiles(newFiles);

    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews(newPreviews);
  };

  const removeImage = (idx) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== idx);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== idx);
    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  // Size toggle
  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Color handlers
  const addColor = () => setColors((prev) => [...prev, { ...EMPTY_COLOR, name: { en: "", fr: "" } }]);

  const removeColor = (idx) =>
    setColors((prev) => prev.filter((_, i) => i !== idx));

  const updateColor = (idx, field, value) => {
    setColors((prev) => {
      const updated = [...prev];
      if (field === "hex") {
        updated[idx] = { ...updated[idx], hex: value };
      } else {
        // field is "name.en" or "name.fr"
        const [, lang] = field.split(".");
        updated[idx] = {
          ...updated[idx],
          name: { ...updated[idx].name, [lang]: value },
        };
      }
      return updated;
    });
  };

  // Variant handlers
  const addVariant = () => setVariants((prev) => [...prev, { ...EMPTY_VARIANT }]);

  const removeVariant = (idx) =>
    setVariants((prev) => prev.filter((_, i) => i !== idx));

  const updateVariant = (idx, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  // Submit form
const handleSubmit = async () => {
    setError("");

    // Basic validation
    if (!name.en || !name.fr) return setError("Product name is required in both languages.");
    if (!description.en || !description.fr) return setError("Description is required in both languages.");
    if (!price || isNaN(price) || Number(price) < 0) return setError("A valid price is required.");
    if (!category) return setError("Please select a category.");
    if (sizes.length === 0) return setError("Select at least one size.");
    if (colors.some((c) => !c.hex || !c.name.en || !c.name.fr))
      return setError("Each color needs a name (EN + FR) and a hex value.");
    if (variants.some((v) => !v.size || !v.colorName || v.stock === ""))
      return setError("Each variant needs a size, color name, and stock quantity.");

    const fields = {
      name,
      description,
      price,
      category,
      sizes,
      colors,
      variants,
      neckType: neckType || null,
      vNeckDepth: vNeckDepth || null,
      isActive,
    };

    const fd = buildFormData(fields, imageFiles);

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });

      // 1. First, check if the response status indicates an error (e.g., 404, 500)
      if (!res.ok) {
        let errorMessage = "An unexpected server error occurred. Please try again later.";
        
        // 2. Safely check the content-type to ensure the server returned a JSON payload
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await res.json();
            // If the backend provided a specific, controlled error message, use it
            if (errorData && errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (e) {
            // Silently catch JSON parsing errors to prevent crashing on HTML error pages
          }
        }
        
        throw new Error(errorMessage);
      }

      // 3. Response is successful (res.ok), so it is completely safe to parse the JSON
      const data = await res.json();

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess(data);
        if (onClose) onClose();
      }, 1200);
    } catch (err) {
      // 4. Catch network connectivity errors or custom errors thrown above
      if (err.message.includes("Failed to fetch")) {
        setError("Unable to connect to the server. Please check your internet connection.");
      } else {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render
  if (success) {
    return (
      <div className="pf-overlay">
        <div className="pf-modal">
          <div className="pf-success">
            <div className="pf-success-icon">✓</div>
            <p>Product created successfully!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pf-overlay">
      <div className="pf-modal">
        {/* Header */}
        <div className="pf-header">
          <div>
            <h2 className="pf-title">New Product</h2>
            <p className="pf-subtitle">Fill in all fields in both languages</p>
          </div>
          <button className="pf-close" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Error banner */}
        {error && <div className="pf-error">{error}</div>}

        <div className="pf-body">
          {/* ── Section 1: Basics ── */}
          <SectionTitle>Basic Info</SectionTitle>

          <BilingualInput
            label="Product Name"
            values={name}
            onChange={(lang, val) => setName((p) => ({ ...p, [lang]: val }))}
            required
          />

          <BilingualInput
            label="Description"
            values={description}
            onChange={(lang, val) => setDescription((p) => ({ ...p, [lang]: val }))}
            multiline
            required
          />

          <div className="pf-row">
            <Field label="Price (CAD)">
              <input
                className="pf-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Field>

            <Field label="Category">
              <div className="pf-select-wrap">
                <select
                  className="pf-input pf-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="pf-select-icon" />
              </div>
            </Field>

            <Field label="Status">
              <div className="pf-toggle-row">
                <button
                  type="button"
                  className={`pf-toggle-btn ${isActive ? "active" : ""}`}
                  onClick={() => setIsActive(true)}
                >
                  Active
                </button>
                <button
                  type="button"
                  className={`pf-toggle-btn ${!isActive ? "active" : ""}`}
                  onClick={() => setIsActive(false)}
                >
                  Inactive
                </button>
              </div>
            </Field>
          </div>

          {/* ── Section 2: Sizes ── */}
          <SectionTitle>Sizes</SectionTitle>
          <div className="pf-size-grid">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                className={`pf-size-chip ${sizes.includes(s) ? "selected" : ""}`}
                onClick={() => toggleSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* ── Section 3: Neck type ── */}
          {(category === "tshirt" || category === "hoodie") && (
            <>
              <SectionTitle>Neck Type (optional)</SectionTitle>
              <div className="pf-row">
                <Field label="Neck Type">
                  <div className="pf-select-wrap">
                    <select
                      className="pf-input pf-select"
                      value={neckType}
                      onChange={(e) => {
                        setNeckType(e.target.value);
                        if (e.target.value !== "v-neck") setVNeckDepth("");
                      }}
                    >
                      <option value="">None</option>
                      {NECK_TYPES.map((n) => (
                        <option key={n} value={n}>
                          {n.charAt(0).toUpperCase() + n.slice(1)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="pf-select-icon" />
                  </div>
                </Field>

                {neckType === "v-neck" && (
                  <Field label="V-Neck Depth">
                    <div className="pf-select-wrap">
                      <select
                        className="pf-input pf-select"
                        value={vNeckDepth}
                        onChange={(e) => setVNeckDepth(e.target.value)}
                      >
                        <option value="">Select depth</option>
                        {V_NECK_DEPTHS.map((d) => (
                          <option key={d} value={d}>
                            {d.charAt(0).toUpperCase() + d.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pf-select-icon" />
                    </div>
                  </Field>
                )}
              </div>
            </>
          )}

          {/* ── Section 4: Colors ── */}
          <SectionTitle>Colors</SectionTitle>
          <div className="pf-color-list">
            {colors.map((color, idx) => (
              <div key={idx} className="pf-color-row">
                <div className="pf-color-swatch-wrap">
                  <input
                    type="color"
                    className="pf-color-picker"
                    value={color.hex}
                    onChange={(e) => updateColor(idx, "hex", e.target.value)}
                    title="Pick color"
                  />
                  <span className="pf-color-hex">{color.hex}</span>
                </div>
                <input
                  className="pf-input"
                  type="text"
                  placeholder="Name (EN)"
                  value={color.name.en}
                  onChange={(e) => updateColor(idx, "name.en", e.target.value)}
                />
                <input
                  className="pf-input"
                  type="text"
                  placeholder="Nom (FR)"
                  value={color.name.fr}
                  onChange={(e) => updateColor(idx, "name.fr", e.target.value)}
                />
                {colors.length > 1 && (
                  <button
                    type="button"
                    className="pf-icon-btn pf-icon-btn--danger"
                    onClick={() => removeColor(idx)}
                    title="Remove color"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" className="pf-add-row-btn" onClick={addColor}>
            <Plus size={14} /> Add Color
          </button>

          {/* ── Section 5: Variants ── */}
          <SectionTitle>Stock Variants</SectionTitle>
          <p className="pf-hint pf-hint--block">
            One row per size × color combination. "Color name" must match the English name you entered above.
          </p>
          <div className="pf-variants-list">
            <div className="pf-variant-header">
              <span>Size</span>
              <span>Color (EN name)</span>
              <span>Stock</span>
              <span />
            </div>
            {variants.map((v, idx) => (
              <div key={idx} className="pf-variant-row">
                <div className="pf-select-wrap">
                  <select
                    className="pf-input pf-select"
                    value={v.size}
                    onChange={(e) => updateVariant(idx, "size", e.target.value)}
                  >
                    <option value="">Size</option>
                    {SIZES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pf-select-icon" />
                </div>
                <div className="pf-select-wrap">
                  <select
                    className="pf-input pf-select"
                    value={v.colorName}
                    onChange={(e) => updateVariant(idx, "colorName", e.target.value)}
                  >
                    <option value="">Color</option>
                    {colors
                      .filter((c) => c.name.en)
                      .map((c, ci) => (
                        <option key={ci} value={c.name.en}>{c.name.en}</option>
                      ))}
                  </select>
                  <ChevronDown size={14} className="pf-select-icon" />
                </div>
                <input
                  className="pf-input"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={v.stock}
                  onChange={(e) => updateVariant(idx, "stock", Number(e.target.value))}
                />
                {variants.length > 1 && (
                  <button
                    type="button"
                    className="pf-icon-btn pf-icon-btn--danger"
                    onClick={() => removeVariant(idx)}
                    title="Remove variant"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" className="pf-add-row-btn" onClick={addVariant}>
            <Plus size={14} /> Add Variant
          </button>

          {/* ── Section 6: Images ── */}
          <SectionTitle>Images</SectionTitle>
          <p className="pf-hint pf-hint--block">
            Up to 10 images. Uploaded directly to Cloudinary via the backend.
          </p>

          {/* Upload zone */}
          <div
            className="pf-upload-zone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);
              const dt = { target: { files } };
              handleImageSelect(dt);
            }}
          >
            <Upload size={22} className="pf-upload-icon" />
            <p>Click or drag images here</p>
            <span className="pf-hint">{imageFiles.length} / 10 selected</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleImageSelect}
            />
          </div>

          {/* Previews */}
          {imagePreviews.length > 0 && (
            <div className="pf-image-previews">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="pf-preview-wrap">
                  <img src={src} alt={`preview-${idx}`} className="pf-preview-img" />
                  <button
                    type="button"
                    className="pf-preview-remove"
                    onClick={() => removeImage(idx)}
                    title="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pf-footer">
          <button type="button" className="pf-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="pf-btn-submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;