export interface TimeSlot {
    start: string;
    end: string;
    status: string;
    bookings: number;
  }
  
  export function generateTimeSlots(
    startTime: string,
    endTime: string,
    slotLengthInMinutes: number,
    hourlyLimit: number
  ): Map<string, TimeSlot> {
    const timeSlots = new Map<string, TimeSlot>();
    let current = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    let slotCount = 1;
  
    let slotsThisHour = 0; 
    let currentHour = current.getHours();
  
    while (current < end) {
      const start = current.toTimeString().substring(0, 5);
      current.setMinutes(current.getMinutes() + slotLengthInMinutes);
      const slotEnd = current.toTimeString().substring(0, 5);
  
      // Reset the counter if we move to the next hour
      if (current.getHours() !== currentHour) {
        currentHour = current.getHours();
        slotsThisHour = 0;
      }
  
      // Only add slots if the hourly limit has not been reached
      if (slotsThisHour < hourlyLimit) {
        const slotKey = `slot_${slotCount}`;
        timeSlots.set(slotKey, {
          start,
          end: slotEnd,
          status: "available",
          bookings: 0,
        });
  
        slotCount += 1;
        slotsThisHour += 1;
      }
    }
  
    return timeSlots;
  }
  