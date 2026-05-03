import { useState, type KeyboardEvent } from "react";

interface TagInputProps {
  label: string;
  value: string; // Comma-separated tags
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TagInput({ label, value, onChange, placeholder }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  
  // Convert comma-separated string to array
  const tags = value ? value.split(",").map(t => t.trim()).filter(t => t !== "") : [];

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        onChange(newTags.join(", "));
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      const newTags = tags.slice(0, -1);
      onChange(newTags.join(", "));
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(t => t !== tagToRemove);
    onChange(newTags.join(", "));
  };

  return (
    <div className="w-full text-left">
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2 p-2 border border-slate-300 rounded focus-within:ring-2 focus-within:ring-emerald-500 bg-white min-h-[42px]">
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className="bg-fw-yellow text-fw-navy px-2 py-1 rounded text-xs font-black flex items-center gap-1 border border-fw-navy/10"
          >
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)}
              className="hover:text-fw-salmon transition-colors font-bold"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 outline-none text-sm min-w-[120px]"
        />
      </div>
      <p className="text-[10px] text-slate-400 mt-1 italic">Press Enter to add a tag</p>
    </div>
  );
}
