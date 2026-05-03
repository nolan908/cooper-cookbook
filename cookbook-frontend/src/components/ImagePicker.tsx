import { useState, useRef } from "react";

export type ImagePickerType = "pfp" | "recipe";

interface ImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  type?: ImagePickerType;
  hidePreview?: boolean;
}

const STOCK_PFP_IMAGES = [
  "https://cdn-icons-png.flaticon.com/512/1154/1154444.png", // Penguin
  "https://cdn-icons-png.flaticon.com/512/1154/1154460.png", // Giraffe
  "https://cdn-icons-png.flaticon.com/512/1154/1154473.png", // Hippo
  "https://cdn-icons-png.flaticon.com/512/1154/1154452.png", // Elephant
  "https://cdn-icons-png.flaticon.com/512/4333/4333609.png", // Classic Silhouette 1
  "https://cdn-icons-png.flaticon.com/512/4333/4333618.png", // Classic Silhouette 2
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // XP-style user
  "https://cdn-icons-png.flaticon.com/512/1154/1154480.png", // Lion
];

const STOCK_RECIPE_IMAGES = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop", // Salad
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop", // Bowl
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop", // Pizza
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=400&fit=crop", // Sandwich
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop", // Meat
  "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=400&fit=crop", // Breakfast
  "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400&h=400&fit=crop", // Pasta
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop", // Steak
];

export default function ImagePicker({ value, onChange, label, type = "recipe", hidePreview = false }: ImagePickerProps) {
  const [mode, setMode] = useState<"url" | "file" | "stock">("url");
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stockImages = type === "pfp" ? STOCK_PFP_IMAGES : STOCK_RECIPE_IMAGES;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
        setImgError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (val: string) => {
    onChange(val);
    setImgError(false);
  };

  return (
    <div className="space-y-4 w-full text-left">
      {label && <label className="block text-[11px] font-black text-fw-navy/40 uppercase tracking-widest">{label}</label>}
      
      <div className="flex gap-2 p-1 bg-fw-navy/5 rounded-xl border border-fw-navy/10">
        <button 
          type="button"
          onClick={() => setMode("url")}
          className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${mode === "url" ? "bg-white text-fw-navy shadow-sm" : "text-fw-navy/40 hover:text-fw-navy"}`}
        >
          URL
        </button>
        <button 
          type="button"
          onClick={() => setMode("file")}
          className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${mode === "file" ? "bg-white text-fw-navy shadow-sm" : "text-fw-navy/40 hover:text-fw-navy"}`}
        >
          Browse
        </button>
        <button 
          type="button"
          onClick={() => setMode("stock")}
          className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${mode === "stock" ? "bg-white text-fw-navy shadow-sm" : "text-fw-navy/40 hover:text-fw-navy"}`}
        >
          Library
        </button>
      </div>

      <div className="bg-white border-2 border-fw-navy p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] min-h-[120px] flex flex-col justify-center">
        {mode === "url" && (
          <input
            type="url"
            placeholder="Enter image URL..."
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full bg-fw-navy/5 p-3 text-xs font-bold focus:bg-fw-yellow transition-all outline-none rounded-lg"
          />
        )}

        {mode === "file" && (
          <div className="flex flex-col items-center gap-3">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-fw-teal text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-fw-navy transition-all"
            >
              Select Local File
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {value.startsWith("data:") && <p className="text-[9px] font-bold text-fw-teal italic">Local image selected ✓</p>}
          </div>
        )}

        {mode === "stock" && (
          <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto p-1">
            {stockImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { onChange(img); setImgError(false); }}
                className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${value === img ? "border-fw-salmon scale-95" : "border-transparent hover:border-fw-navy/20"}`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Stock ${idx}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {!hidePreview && (
        <div className="flex items-center justify-center pt-2">
          <div className="w-20 h-20 rounded-xl border-2 border-fw-navy overflow-hidden bg-fw-navy/5 flex items-center justify-center relative">
              {value && !imgError ? (
                <img 
                  src={value} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-fw-navy/5 text-fw-navy/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
