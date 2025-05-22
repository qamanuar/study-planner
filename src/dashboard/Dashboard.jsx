import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import ReminderModal from "../component/ReminderModal";
import { motion, AnimatePresence } from "framer-motion";
import LogoutButton from "../component/SignOut"

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [session, setSession] = useState(null);
  const [editingReminder, setEditingReminder] = useState(null); // State for editing reminder
  const [sortByPriority, setSortByPriority] = useState(false);
  const [showTime, setShowTime] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showOverdue, setShowOverdue] = useState(true);
  const [showToday, setShowToday] = useState(true);
  const [showTomorrow, setShowTomorrow] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);


  // Keep currentDate updated every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60 * 1000); // update every 60 seconds

    return () => clearInterval(interval); // cleanup
  }, []);

  // Fetch session and reminders
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();
  }, []);

  useEffect(() => {
    if (session) {
      fetchReminders();
    }
  }, [session]);

  const formatDate = (date) => {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};


  // Fetch reminders from Supabase
  const fetchReminders = async () => {
    if (!session) return;

    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", session.user.id)
      .order("due_date", { ascending: true });

    if (error) {
      console.error("Error fetching reminders:", error);
    } else {
      setReminders(data);
    }
  };

  // Handle reminder submission (both add and update)
  const handleReminderSubmit = async (data) => {
    const now = new Date();
    const time = data.time || "00:00"; // Default time to "12 AM" if not provided
    const due_date = data.due_date || new Date(now.setDate(now.getDate() + 1)).toISOString().split("T")[0]; // Default due date to tomorrow if not provided

    let error;
    if (editingReminder) {
      // Update existing reminder
      const { error: updateError } = await supabase
        .from("reminders")
        .update({
          title: data.title,
          time,
          priority: data.priority,
          due_date,
        })
        .eq("id", editingReminder.id);
      error = updateError;
    } else {
      // Insert new reminder
      const { error: insertError } = await supabase.from("reminders").insert([
        {
          title: data.title,
          time,
          priority: data.priority,
          due_date,
          user_id: session.user.id,
        },
      ]);
      error = insertError;
    }

    if (error) {
      console.error("Reminder submission failed:", error.message);
    } else {
      fetchReminders(); // Re-fetch reminders after adding/updating
      setIsModalOpen(false); // Close modal
      setEditingReminder(null); // Clear edit state
    }
  };

  // Handle delete reminder
  const handleDeleteReminder = async (id) => {
    const { error } = await supabase
      .from("reminders")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete failed:", error.message);
    } else {
      setReminders(reminders.filter((r) => r.id !== id));
    }
  };

  // Handle edit reminder
  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder); // Set reminder for editing
    setIsModalOpen(true);          // Open the modal for editing
  };

  const SectionHeader = ({ title, isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className="w-full text-left text-lg font-semibold py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg flex justify-between items-center"
  >
    <span>{title}</span>
    <span>{isOpen ? "▲" : "▼"}</span>
  </button>
  );

  const formatTimeTo12Hour = (timeStr) => {
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };
  
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };

  const sortedReminders = sortByPriority
  ? [...reminders].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  : reminders;

  const today = currentDate.toLocaleDateString("en-CA");

  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(currentDate.getDate() + 1);
  const tomorrow = tomorrowDate.toLocaleDateString("en-CA");



  const groupRemindersByDate = (reminders) => {
  return reminders.reduce((acc, reminder) => {
    if (!acc[reminder.due_date]) {
      acc[reminder.due_date] = [];
    }
    acc[reminder.due_date].push(reminder);
    return acc;
  }, {});
};
  const groupedReminders = groupRemindersByDate(sortedReminders);
  

  return (
    <div className="screen flex justify-center items-start w-full bg-gray-100 min-h-screen p-6">
      <div className="content w-4/5 max-w-4xl">
        <div className="space-y-6">
          <div className="flex">
            <h1 className="font-medium flex-grow text-xl">Dashboard</h1>
            <div className="w-1/4">
              <LogoutButton />
            </div>
          </div>

          <button
            className="h-20 bg-blue-500 shadow-md hover:shadow-xl transform hover:scale-105 transition rounded-xl flex w-full items-center justify-center"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src="/add.png"
              alt="add"
              className="border-2 rounded-lg mx-2 border-white w-8 h-8"
            />
            <h1 className="text-md font-semibold text-white">Create new Reminder</h1>
          </button>

          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex">
              <h2 className="text-xl flex-grow font-semibold">Tasks</h2>
              <button
                onClick={() => setSortByPriority(!sortByPriority)}
                className="toggleBtn mb-4 px-4 py-2 bg-white border-2 text-purple-600 border-purple-500 transition text-white rounded-3xl mx-2 hover:bg-purple-500 hover:text-white"
              >
                {sortByPriority ? "Sort: Priority" : "Sort: Default"}
              </button>
              <button
                onClick={() => setShowTime(!showTime)}
                className="toggleBtn mb-4 px-4 py-2 bg-white border-2 text-blue-600 border-blue-500 transition text-white rounded-3xl mx-2 hover:bg-blue-500 hover:text-white"
              >
                {showTime ? "Hide Time" : "Show Time"}
              </button>
            </div>

            {/* Overdue */}
            <div>
              <SectionHeader
                title="Overdue"
                isOpen={showOverdue}
                onToggle={() => setShowOverdue(!showOverdue)}
              />

              <AnimatePresence initial={false}>
                {showOverdue && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden list-disc ml-6"
                  >
                    {(() => {
                      const overdueReminders = sortedReminders.filter((r) => r.due_date < today);
                      return overdueReminders.length === 0 ? (
                        <p className="text-gray-500 text-center px-4 py-2">No overdue reminders 🎉</p>
                      ) : (
                        overdueReminders.map((r) => (   
                        <li
                          key={r.id}
                          className="list-none bg-white flex justify-between items-center flex-row my-2 py-3 px-5 rounded-lg border border-gray-400"
                        >
                          {/* Reminder Title and Time */}
                          <div className="flex-1">
                            {r.title}
                            {showTime && ` at ${formatTimeTo12Hour(r.time)}`}
                          </div>

                          {/* Priority Badge */}
                          <span
                            className={`text-sm font-medium w-1/6 text-center mx-[1rem] py-1 rounded-full priority
                              ${
                                r.priority === "High"
                                  ? "bg-red-100 text-red-700 border border-red-300"
                                  : r.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                  : "bg-green-100 text-green-700 border border-green-300"
                              }`}
                          >
                            {r.priority}
                          </span>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleEditReminder(r)}
                            className="p-2 text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            ✏️
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteReminder(r.id)}
                            className="p-2 text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </li>                      
                        ))
                      );
                    })()}
                  </motion.ul>
                )}
              </AnimatePresence>

            </div>

            {/* Today */}
            <div>

              <SectionHeader
                title="Due Today"
                isOpen={showToday}
                onToggle={() => setShowToday(!showToday)}
              />

              <AnimatePresence initial={false}>
                {showToday && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden list-disc ml-6"
                  >
                    {(() => {
                      const overdueReminders = sortedReminders.filter((r) => r.due_date === today);
                      return overdueReminders.length === 0 ? (
                        <p className="text-gray-500 text-center px-4 py-2">No today reminders 🎉</p>
                      ) : (
                        overdueReminders.map((r) => (   
                        <li
                          key={r.id}
                          className="list-none bg-white flex justify-between items-center flex-row my-2 py-3 px-5 rounded-lg border border-gray-400"
                        >
                          {/* Reminder Title and Time */}
                          <div className="flex-1">
                            {r.title}
                            {showTime && ` at ${formatTimeTo12Hour(r.time)}`}
                          </div>

                          {/* Priority Badge */}
                          <span
                            className={`text-sm font-medium w-1/6 text-center mx-[1rem] py-1 rounded-full priority
                              ${
                                r.priority === "High"
                                  ? "bg-red-100 text-red-700 border border-red-300"
                                  : r.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                  : "bg-green-100 text-green-700 border border-green-300"
                              }`}
                          >
                            {r.priority}
                          </span>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleEditReminder(r)}
                            className="p-2 text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            ✏️
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteReminder(r.id)}
                            className="p-2 text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </li>                      
                        ))
                      );
                    })()}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Tomorrow */}
            <div>
              <SectionHeader
                title="Due Tomorrow"
                isOpen={showTomorrow}
                onToggle={() => setShowTomorrow(!showTomorrow)}
              />

              <AnimatePresence initial={false}>
                {showTomorrow && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden list-disc ml-6"
                  >
                    {(() => {
                      const overdueReminders = sortedReminders.filter((r) => r.due_date === tomorrow);
                      return overdueReminders.length === 0 ? (
                        <p className="text-gray-500 text-center px-4 py-2">No tomorrow reminders 🎉</p>
                      ) : (
                        overdueReminders.map((r) => (   
                        <li
                          key={r.id}
                          className="list-none bg-white flex justify-between items-center flex-row my-2 py-3 px-5 rounded-lg border border-gray-400"
                        >
                          {/* Reminder Title and Time */}
                          <div className="flex-1">
                            {r.title}
                            {showTime && ` at ${formatTimeTo12Hour(r.time)}`}
                          </div>

                          {/* Priority Badge */}
                          <span
                            className={`text-sm font-medium w-1/6 text-center mx-[1rem] py-1 rounded-full priority
                              ${
                                r.priority === "High"
                                  ? "bg-red-100 text-red-700 border border-red-300"
                                  : r.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                  : "bg-green-100 text-green-700 border border-green-300"
                              }`}
                          >
                            {r.priority}
                          </span>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleEditReminder(r)}
                            className="p-2 text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            ✏️
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteReminder(r.id)}
                            className="p-2 text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </li>                      
                        ))
                      );
                    })()}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {Object.entries(groupedReminders)
              .filter(([date]) => date > tomorrow)
              .length > 0 && (
                <div>
                  <SectionHeader
                    title="Upcoming"
                    isOpen={showUpcoming}
                    onToggle={() => setShowUpcoming(!showUpcoming)}
                  />

                  <AnimatePresence initial={false}>
                    {showUpcoming && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {Object.entries(groupedReminders)
                          .filter(([date]) => date > tomorrow)
                          .map(([date, remindersForDate]) => (
                            <div key={date}>
                              <div className="mb-1 mt-4 text-sm font-medium text-gray-500 ml-6">
                                {formatDate(new Date(date))}
                              </div>
                              <ul className="list-disc ml-6 space-y-2">
                                {remindersForDate.map((r) => (
                                  <li
                                    key={r.id}
                                    className="list-none bg-white flex justify-between items-center flex-row my-2 py-3 px-5 rounded-lg border border-gray-400"
                                  >
                                    {/* Title and Time */}
                                    <div className="flex-1">
                                      {r.title}
                                      {showTime && ` at ${formatTimeTo12Hour(r.time)}`}
                                    </div>

                                    {/* Priority Badge */}
                                    <span
                                      className={`text-sm font-medium w-1/6 text-center mx-[1rem] py-1 rounded-full priority
                                        ${
                                          r.priority === "High"
                                            ? "bg-red-100 text-red-700 border border-red-300"
                                            : r.priority === "Medium"
                                            ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                            : "bg-green-100 text-green-700 border border-green-300"
                                        }`}
                                    >
                                      {r.priority}
                                    </span>

                                    {/* Edit Button */}
                                    <button
                                      onClick={() => handleEditReminder(r)}
                                      className="p-2 text-blue-600 hover:text-blue-800"
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                      onClick={() => handleDeleteReminder(r.id)}
                                      className="p-2 text-red-600 hover:text-red-800"
                                      title="Delete"
                                    >
                                      🗑️
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
            )}


          </div>
        </div>

        <ReminderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleReminderSubmit}
          editingReminder={editingReminder} // Pass editing reminder data to modal
        />
      </div>
    </div>
  );
}

export default Dashboard;
