import React, { useState, useEffect } from "react";
import { PlusCircle, Edit2, Trash2, XCircle } from "lucide-react";

const CatatanKeuangan = () => {
  const [notes, setNotes] = useState(() => {
    const data = localStorage.getItem("notes");
    return data ? JSON.parse(data) : [];
  });

  const [formData, setFormData] = useState({
    type: "income",
    amount: "",
    description: "",
  });

  const [saldo, setSaldo] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));

    // Hitung saldo dari semua catatan
    const total = notes.reduce((acc, item) => {
      const nominal = parseFloat(item.amount);
      return item.type === "income" ? acc + nominal : acc - nominal;
    }, 0);
    setSaldo(total);
  }, [notes]);

  const clearForm = () => {
    setFormData({ type: "income", amount: "", description: "" });
    setEditingIndex(null);
  };

  const submitNote = () => {
    if (!formData.amount || !formData.description) {
      alert("Harap isi semua kolom");
      return;
    }

    const newEntry = {
      ...formData,
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
    };

    if (editingIndex !== null) {
      const updated = [...notes];
      updated[editingIndex] = newEntry;
      setNotes(updated);
    } else {
      setNotes([...notes, newEntry]);
    }

    clearForm();
  };

  const handleDelete = (idx) => {
    const confirmDelete = window.confirm("Hapus catatan ini?");
    if (!confirmDelete) return;

    const filtered = notes.filter((_, i) => i !== idx);
    setNotes(filtered);

    if (editingIndex === idx) clearForm();
  };

  const handleEdit = (idx) => {
    const selected = notes[idx];
    setFormData({
      type: selected.type,
      amount: selected.amount,
      description: selected.description,
    });
    setEditingIndex(idx);
  };

  return (
    <div className="min-h-screen p-6 bg-blue-50 flex flex-col">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Catatan Keuangan 📝</h1>
      </header>

      <main className="flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow p-6 max-w-6xl mx-auto w-full">
        <div className="md:w-1/3 space-y-5">
          <div className="p-5 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl text-center">
            <h2 className="text-lg text-gray-600">Saldo Saat Ini</h2>
            <p className={`text-3xl font-bold mt-2 ${saldo >= 0 ? "text-green-600" : "text-red-600"}`}>
              Rp {saldo.toLocaleString()}
            </p>
          </div>

          <div className="space-y-3">
            <label className="block font-medium">Tipe</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block font-medium">Jumlah</label>
            <input
              type="number"
              min={0}
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Rp 0"
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div className="space-y-3">
            <label className="block font-medium">Deskripsi</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Contoh: gaji, jajan, dll"
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={submitNote}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 flex items-center justify-center gap-2"
            >
              {editingIndex !== null ? (
                <>
                  <Edit2 size={18} />
                  Simpan
                </>
              ) : (
                <>
                  <PlusCircle size={18} />
                  Tambah
                </>
              )}
            </button>
            {editingIndex !== null && (
              <button
                onClick={clearForm}
                className="flex-1 bg-gray-300 hover:bg-gray-400 rounded-lg py-2 flex items-center justify-center gap-2"
              >
                <XCircle size={18} />
                Batal
              </button>
            )}
          </div>
        </div>

       <div className="md:w-2/3 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Riwayat Catatan ({notes.length})
          </h3>

          {notes.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              Belum ada data.
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[65vh] pr-2">
              {notes.map((note, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-4 rounded-lg border shadow-sm ${
                    note.type === "income"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div>
                    <p className="font-bold text-gray-700">
                      {note.type === "income" ? "🟢" : "🔴"} Rp {note.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{note.description}</p>
                  </div>
                  <div className="flex gap-3 text-gray-600">
                    <button onClick={() => handleEdit(i)} title="Edit">
                      <Edit2 size={20} className="hover:text-yellow-600" />
                    </button>
                    <button onClick={() => handleDelete(i)} title="Hapus">
                      <Trash2 size={20} className="hover:text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CatatanKeuangan;
