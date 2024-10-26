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
  
    while (current < end) {
      const start = current.toTimeString().substring(0, 5);
      current.setMinutes(current.getMinutes() + slotLengthInMinutes);
      const slotEnd = current.toTimeString().substring(0, 5);
  
      const slotKey = `slot_${slotCount}`;
      timeSlots.set(slotKey, { start, end: slotEnd, status: "available", bookings: 0 });
      slotCount += 1;
    }
  
    return timeSlots;
  }
  