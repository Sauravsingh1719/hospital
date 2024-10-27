"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Doctor {
  _id: string;
  name: string;
  department: string;
  fee: number;
  averageRating: number;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
    timeSlots: Record<string, any>;
  };
}

const availableDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DoctorDetailPage = () => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [updatedDoctor, setUpdatedDoctor] = useState<Partial<Doctor>>({});
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/admin/doctor/${id}`);
          if (response.data.success) {
            setDoctor(response.data.data);
            setUpdatedDoctor(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching doctor details:", error);
        }
      }
    };

    fetchDoctorDetails();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/api/admin/doctor/${id}`, {
        fee: updatedDoctor.fee,
        department: updatedDoctor.department,
        availability: updatedDoctor.availability,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  const handleDayChange = (day: string) => {
    setUpdatedDoctor((prev) => {
      const updatedAvailability = {
        ...prev.availability,
        days: prev.availability?.days?.includes(day)
          ? prev.availability.days.filter((d) => d !== day)
          : [...(prev.availability?.days || []), day],
      };

      return {
        ...prev,
        availability: updatedAvailability,
      };
    });
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Update Doctor: {doctor.name}</h1>
      <input
        type="text"
        value={updatedDoctor.department || ""}
        onChange={(e) =>
          setUpdatedDoctor((prev) => ({
            ...prev,
            department: e.target.value,
          }))
        }
      />
      <input
        type="number"
        value={updatedDoctor.fee || 0}
        onChange={(e) =>
          setUpdatedDoctor((prev) => ({
            ...prev,
            fee: parseFloat(e.target.value),
          }))
        }
      />

      <div>
        <label>Update Days:</label>
        {availableDays.map((day) => (
          <div key={day}>
            <input
              type="checkbox"
              checked={updatedDoctor.availability?.days?.includes(day) || false}
              onChange={() => handleDayChange(day)}
            />
            <span>{day}</span>
          </div>
        ))}
      </div>

      <button onClick={handleUpdate}>Update Doctor</button>
    </div>
  );
};

export default DoctorDetailPage;
