import React, { useState, useEffect } from "react";

const ReminderModal = ({ isOpen, onClose, onSubmit, editingReminder }) => {
  const [formData, setFormData] = useState({
    title: "",
    time: "",
    priority: "Medium",
    due_date: "",
  });

  // Prefill form when editingReminder changes
  useEffect(() => {
    if (editingReminder) {
      setFormData({
        title: editingReminder.title || "",
        time: editingReminder.time || "",
        priority: editingReminder.priority || "Medium",
        due_date: editingReminder.due_date || "",
      });
    } else {
      setFormData({
        title: "",
        time: "",
        priority: "Medium",
        due_date: "",
      });
    }
  }, [editingReminder, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editingReminder ? "Edit Reminder" : "New Reminder"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <input
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;
