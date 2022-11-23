export type EventNameDTO =
  | "AllergyIntolerance"
  | "Appointment"
  | "CarePlan"
  | "Condition"
  | "Diagnosis"
  | "Immunization"
  | "MedicationStatement"
  | "Observation"
  | "Procedure";

export type EventDTO = {
  id: string;
  appointmentId?: string;
  name: EventNameDTO;
  resource: EventNameDTO;
  date: string;
};
