import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid, time, pgEnum } from "drizzle-orm/pg-core";

// Tabela de usuários - armazena informações básicas dos usuários do sistema
export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
});

// Tabela de relacionamento entre usuários e clínicas - permite que usuários sejam associados a múltiplas clínicas
export const usersToClinicsTable = pgTable("users_to_clinics", {
  userId: uuid("user_id").references(() => usersTable.id, {onDelete: "cascade"}).notNull(),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {onDelete: "cascade"}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersToClinicsTableRelations = relations(usersToClinicsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [usersToClinicsTable.userId],
    references: [usersTable.id],
  }),
  clinic: one(clinicsTable, {
    fields: [usersToClinicsTable.clinicId],
    references: [clinicsTable.id],
  }),
}));

// Tabela de clínicas - armazena informações das clínicas médicas
export const clinicsTable = pgTable("clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(appointmentsTable),
  usersToClinicsTable: many(usersToClinicsTable),
}));

// Tabela de médicos - armazena informações dos médicos, incluindo disponibilidade e especialidade
export const doctorsTable = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {onDelete: "cascade"}).notNull(),
  name: text("name").notNull(), 
  avatarImageUrl: text("avatar_image_url"),
  // 1 - Monday , 2 - Tuesday , 3  Wednesday , 4 - Thursday, 5 - Friday, 6 - Saturday , 0 - Sunday
  availebleFroomWeekDay: integer("availeble_from_week_day").notNull(), // 1
  availebleToWeekDay: integer("availeble_to_week_day").notNull(),
  availebleFromTime: time("availeble_from_time").notNull(),
  availebleToTime: time("availeble_to_time").notNull(),
  especiality: text("especiality").notNull(),
  appointmentPriceIncents: integer("appointment_price_in_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const doctorsTableRelations = relations(doctorsTable, ({ one, many }) => ({
  clinic: one(clinicsTable, {
    fields: [doctorsTable.clinicId],
    references: [clinicsTable.id],
  }),
  appointments: many(appointmentsTable),
}));

// Enum para gênero dos pacientes
export const patientsGenderEnum = pgEnum("patients_gender", ["male", "female"]);

// Tabela de pacientes - armazena informações dos pacientes da clínica
export const patientsTable = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {onDelete: "cascade"}).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").notNull(),
  sex: patientsGenderEnum("sex").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const patientsTableRelations = relations(patientsTable, ({ one, many }) => ({
  clinic: one(clinicsTable, {
    fields: [patientsTable.clinicId],
    references: [clinicsTable.id],
  }),
  appointments: many(appointmentsTable),
}));

// Tabela de consultas - gerencia os agendamentos entre pacientes e médicos
export  const appointmentsTable = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date").notNull(),
  patientId: uuid("patient_id").references(() => patientsTable.id).notNull(),
  doctorId: uuid("doctor_id").references(() => doctorsTable.id),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {onDelete: "cascade"}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const appointmentsTableRelations = relations(appointmentsTable, ({ one }) => ({
  patient: one(patientsTable, {
    fields: [appointmentsTable.patientId],
    references: [patientsTable.id],
  }),
  doctor: one(doctorsTable, {
    fields: [appointmentsTable.doctorId],
    references: [doctorsTable.id],
  }),
  clinic: one(clinicsTable, {
    fields: [appointmentsTable.clinicId],
    references: [clinicsTable.id],
  }),
}));