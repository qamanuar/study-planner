import { Link, useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import LogoutButton from "./SignOut"

const Sidebar = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const links = [
    // Add more links as needed
  ];

  return (
    <div className="w-64">
      <div className="fixed w-64 h-screen bg-gray-800 text-white flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-8">Study Planner</h1>
        <nav className="space-y-2 flex-grow">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-2 rounded-md hover:bg-gray-700 transition ${
                activePath === link.path ? "bg-gray-700" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Logout button component */}
        <div className="my-2 text-center">
          <LogoutButton />
        </div>
      </div>
    </div>  
  );
};

export default Sidebar;
