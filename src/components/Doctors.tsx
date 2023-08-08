import { useEffect, useState } from "react";
import { Doctor } from "@/lib/types/types";

const Doctors = () => {
  const [user, setUser] = useState<Doctor[] | null>(null);

  useEffect(() => {
    const getPatient = async () => {
      const res = await fetch("/api/getDoctors");
      const data = await res.json();
      setUser(data);
    };

    getPatient();
  }, []);

  return (
    <div className="p-4">
      {user && (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-8">
          {user.map((doctor) => (
            <div
              key={doctor.user_id}
              className="bg-white shadow-md p-4 rounded-lg w-64"
            >
              <div className="flex justify-center items-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                  <span className="text-gray-600 text-xl">
                    {doctor.first_name?.charAt(0)}
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Dr. {doctor.first_name} {doctor.last_name}
              </h2>
              <div className="text-gray-500">
                <p className="truncate">Email: {doctor.email || "N/A"}</p>
                <p>Specialization: {doctor.specialization || "N/A"}</p>
                <p>
                  Date of Birth: {doctor.DOB?.toString().slice(0, 10) || "N/A"}
                </p>
                <p>Gender: {doctor.gender || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!user && <div>Loading...</div>}
    </div>
  );
};

export default Doctors;
