/**
 * Grade de Programação Semanal - CORRIGIDA
 * Usa APENAS vídeos que existem no mockData.ts
 */
export interface ScheduledProgram {
  time: string; // Formato HH:MM:SS
  videoId: string;
  title?: string;
  startAt?: number;
  endAt?: number;
}

/**
 * Mapeamento dos dias da semana (Date.getDay()):
 * 0: Domingo, 1: Segunda, 2: Terça, 3: Quarta, 4: Quinta, 5: Sexta, 6: Sábado
 */
export const weeklySchedule: Record<number, ScheduledProgram[]> = {
  // ========== DOMINGO (0) ==========
  0: [
    { time: '07:00:00', videoId: 'leo-lully-001' },
    { time: '07:39:19', videoId: 'bluey-001' },
    { time: '07:46:34', videoId: 'bluey-002' },
    { time: '07:23:00', videoId: 'edu-bita-001' },
    { time: '07:30:00', videoId: 'osvegetais-001' },
    { time: '08:04:00', videoId: 'bluey-003' },
    { time: '08:12:00', videoId: 'edu-coresformas-001' },
    { time: '08:20:00', videoId: 'bluey-004' },
    { time: '08:28:00', videoId: 'artur-001' },
    { time: '09:05:00', videoId: 'bluey-005' },
    { time: '09:13:00', videoId: 'edu-animaisfazenda-001' },
    { time: '09:20:00', videoId: 'osvegetais-002', title: 'Os Vegetais - Bloco 1', startAt: 0, endAt: 1200 },
    { time: '09:40:00', videoId: 'bluey-006' },
    { time: '09:48:00', videoId: 'edu-bebaagua-001' },
    { time: '09:55:00', videoId: 'bluey-007' },
    { time: '10:03:00', videoId: 'edu-bita-002' },
    { time: '10:10:00', videoId: 'bluey-008' },
    { time: '10:18:00', videoId: 'edu-dividir-001' },
    { time: '10:25:00', videoId: 'bluey-009' },
    { time: '10:33:00', videoId: 'edu-fauna-flora-001' },
    
    // Tarde
    { time: '12:00:00', videoId: 'bluey-010' },
    { time: '12:08:00', videoId: 'edu-monica-001' },
    { time: '12:15:00', videoId: 'osvegetais-002', title: 'Os Vegetais - Bloco 2', startAt: 1200, endAt: 2400 },
    { time: '12:35:00', videoId: 'bluey-011' },
    { time: '12:43:00', videoId: 'edu-bita-003' },
    { time: '12:50:00', videoId: 'bluey-012' },
    { time: '12:58:00', videoId: 'edu-jac-001' },
    
    { time: '14:00:00', videoId: 'osvegetais-003' },
    { time: '14:36:00', videoId: 'bluey-013' },
    { time: '14:44:00', videoId: 'edu-bellinha-respeito-001' },
    { time: '14:50:00', videoId: 'bluey-014' },
    { time: '14:58:00', videoId: 'edu-bita-diferenca-001' },
    
    { time: '15:05:00', videoId: 'bluey-015' },
    { time: '15:13:00', videoId: 'edu-numeros-001' },
    { time: '15:20:00', videoId: 'bluey-016' },
    
    // Noite
    { time: '17:00:00', videoId: 'bluey-017' },
    { time: '17:08:00', videoId: 'edu-coresformas-001' },
    { time: '17:15:00', videoId: 'bluey-018' },
    { time: '17:23:00', videoId: 'edu-bebaagua-001' },
    
    { time: '18:00:00', videoId: 'osvegetais-004' },
    { time: '18:39:00', videoId: 'bluey-019' },
    { time: '18:47:00', videoId: 'edu-bita-001' },
    
    { time: '19:00:00', videoId: 'bluey-020' },
    { time: '19:08:00', videoId: 'bluey-021' },
    { time: '19:16:00', videoId: 'bluey-022' },
    { time: '19:24:00', videoId: 'bluey-023' },
  ],

  // ========== SEGUNDA-FEIRA (1) ==========
  1: [
    { time: '07:00:00', videoId: 'bluey-024' },
    { time: '07:08:00', videoId: 'edu-numeros-001' },
    { time: '07:15:00', videoId: 'bluey-025' },
    { time: '07:23:00', videoId: 'edu-bita-002' },
    { time: '07:30:00', videoId: 'osvegetais-002', title: 'Os Vegetais - Bloco 1', startAt: 0, endAt: 1200 },
    { time: '07:50:00', videoId: 'bluey-026' },
    { time: '07:58:00', videoId: 'edu-dividir-001' },
    { time: '08:05:00', videoId: 'bluey-027' },
    { time: '08:13:00', videoId: 'edu-coresformas-001' },
    { time: '08:20:00', videoId: 'bluey-028' },
    { time: '08:28:00', videoId: 'artur-001' },
    { time: '09:05:00', videoId: 'bluey-029' },
    { time: '09:13:00', videoId: 'edu-animaisfazenda-001' },
    { time: '09:20:00', videoId: 'osvegetais-002', title: 'Os Vegetais - Bloco 2', startAt: 1200, endAt: 2400 },
    { time: '09:40:00', videoId: 'bluey-030' },
    { time: '09:48:00', videoId: 'edu-bebaagua-001' },
    { time: '09:55:00', videoId: 'bluey-031' },
    { time: '10:03:00', videoId: 'edu-bita-003' },
    { time: '10:10:00', videoId: 'osvegetais-001' },
    { time: '10:44:00', videoId: 'bluey-032' },
    
    // Tarde
    { time: '12:00:00', videoId: 'bluey-033' },
    { time: '12:08:00', videoId: 'edu-monica-001' },
    { time: '12:15:00', videoId: 'osvegetais-003' },
    { time: '12:51:00', videoId: 'bluey-034' },
    { time: '12:59:00', videoId: 'edu-jac-001' },
    
    { time: '14:00:00', videoId: 'bluey-035' },
    { time: '14:08:00', videoId: 'edu-fauna-flora-001' },
    { time: '14:15:00', videoId: 'bluey-036' },
    { time: '14:23:00', videoId: 'edu-bellinha-respeito-001' },
    { time: '14:30:00', videoId: 'osvegetais-004' },
    { time: '15:09:00', videoId: 'bluey-037' },
    { time: '16:34:00', videoId: 'edu-bita-diferenca-001' },
    
    // Noite
    { time: '17:00:00', videoId: 'bluey-038' },
    { time: '17:08:00', videoId: 'edu-coresformas-001' },
    { time: '17:15:00', videoId: 'bluey-039' },
    { time: '17:23:00', videoId: 'edu-numeros-001' },
    
    { time: '18:00:00', videoId: 'osvegetais-001' },
    { time: '18:34:00', videoId: 'bluey-040' },
    { time: '18:42:00', videoId: 'edu-bita-001' },
    
    { time: '19:00:00', videoId: 'bluey-041' },
    { time: '19:08:00', videoId: 'bluey-042' },
    { time: '19:16:00', videoId: 'bluey-043' },
    { time: '19:24:00', videoId: 'bluey-044' },
  ],

  // ========== TERÇA-FEIRA (2) ==========
  2: [
    { time: '07:00:00', videoId: 'bluey-045' },
    { time: '07:08:00', videoId: 'edu-numeros-001' },
    { time: '07:15:00', videoId: 'bluey-046' },
    { time: '07:23:00', videoId: 'edu-bita-001' },
    { time: '07:30:00', videoId: 'osvegetais-003', title: 'Os Vegetais - Bloco 1', startAt: 0, endAt: 1200 },
    { time: '07:50:00', videoId: 'bluey-047' },
    { time: '07:58:00', videoId: 'edu-dividir-001' },
    { time: '08:05:00', videoId: 'bluey-048' },
    { time: '08:13:00', videoId: 'edu-coresformas-001' },
    { time: '08:20:00', videoId: 'bluey-049' },
    { time: '08:28:00', videoId: 'artur-001' },
    { time: '09:05:00', videoId: 'bluey-050' },
    { time: '09:13:00', videoId: 'edu-animaisfazenda-001' },
    { time: '09:20:00', videoId: 'osvegetais-003', title: 'Os Vegetais - Bloco 2', startAt: 1200, endAt: 2181 },
    { time: '09:36:00', videoId: 'bluey-051' },
    { time: '09:44:00', videoId: 'edu-bebaagua-001' },
    { time: '09:51:00', videoId: 'osvegetais-001' },
    { time: '10:25:00', videoId: 'bluey-001' },
    { time: '10:33:00', videoId: 'edu-bita-002' },
    
    // Tarde
    { time: '12:00:00', videoId: 'bluey-002' },
    { time: '12:08:00', videoId: 'edu-monica-001' },
    { time: '12:15:00', videoId: 'osvegetais-004', title: 'Os Vegetais - Bloco 1', startAt: 0, endAt: 1200 },
    { time: '12:35:00', videoId: 'bluey-003' },
    { time: '12:43:00', videoId: 'edu-jac-001' },
    
    { time: '14:00:00', videoId: 'bluey-004' },
    { time: '14:08:00', videoId: 'edu-fauna-flora-001' },
    { time: '14:15:00', videoId: 'bluey-005' },
    { time: '14:23:00', videoId: 'edu-bellinha-respeito-001' },
    { time: '14:30:00', videoId: 'osvegetais-004', title: 'Os Vegetais - Bloco 2', startAt: 1200, endAt: 2348 },
    { time: '14:49:00', videoId: 'bluey-006' },
    { time: '14:57:00', videoId: 'edu-bita-003' },
    
    // Noite
    { time: '17:00:00', videoId: 'bluey-007' },
    { time: '17:08:00', videoId: 'edu-coresformas-001' },
    { time: '17:15:00', videoId: 'bluey-008' },
    { time: '17:23:00', videoId: 'edu-numeros-001' },
    
    { time: '18:00:00', videoId: 'osvegetais-002', title: 'Os Vegetais - Bloco 1', startAt: 0, endAt: 1200 },
    { time: '18:20:00', videoId: 'bluey-009' },
    { time: '18:28:00', videoId: 'edu-bita-001' },
    
    { time: '19:00:00', videoId: 'bluey-010' },
    { time: '19:08:00', videoId: 'bluey-011' },
    { time: '19:16:00', videoId: 'bluey-012' },
    { time: '19:24:00', videoId: 'bluey-013' },
  ],

  // ========== QUARTA-FEIRA (3) ==========
  3: [
    { time: '07:00:00', videoId: 'bluey-014' },
    { time: '07:08:00', videoId: 'edu-numeros-001' },
    { time: '07:15:00', videoId: 'bluey-015' },
    { time: '07:23:00', videoId: 'edu-bita-002' },
    { time: '07:30:00', videoId: 'osvegetais-001' },
    { time: '08:04:00', videoId: 'bluey-016' },
    { time: '08:12:00', videoId: 'edu-dividir-001' },
    { time: '08:19:00', videoId: 'bluey-017' },
    { time: '08:27:00', videoId: 'artur-001' },
    { time: '09:04:00', videoId: 'bluey-018' },
    { time: '09:12:00', videoId: 'edu-animaisfazenda-001' },
    { time: '09:19:00', videoId: 'osvegetais-002', title: 'Os Vegetais - Bloco 1', startAt: 0, endAt: 1200 },
    { time: '09:39:00', videoId: 'bluey-019' },
    { time: '09:47:00', videoId: 'edu-bebaagua-001' },
    { time: '09:54:00', videoId: 'osvegetais-002', title: 'Os Vegetais - Bloco 2', startAt: 1200, endAt: 2400 },
    { time: '10:14:00', videoId: 'bluey-020' },
    { time: '10:22:00', videoId: 'edu-coresformas-001' },
    { time: '10:29:00', videoId: 'bluey-021' },
    
    // Tarde
    { time: '12:00:00', videoId: 'bluey-022' },
    { time: '12:08:00', videoId: 'edu-monica-001' },
    { time: '12:15:00', videoId: 'osvegetais-003' },
    { time: '12:51:00', videoId: 'bluey-023' },
    { time: '12:59:00', videoId: 'edu-jac-001' },
    
    { time: '14:00:00', videoId: 'bluey-024' },
    { time: '14:08:00', videoId: 'edu-fauna-flora-001' },
    { time: '14:15:00', videoId: 'bluey-025' },
    { time: '14:23:00', videoId: 'edu-bellinha-respeito-001' },
    { time: '14:30:00', videoId: 'osvegetais-004' },
    { time: '15:09:00', videoId: 'bluey-026' },
    { time: '16:20:00', videoId: 'edu-bita-003' },
    
    // Noite
    { time: '17:00:00', videoId: 'bluey-027' },
    { time: '17:08:00', videoId: 'edu-coresformas-001' },
    { time: '17:15:00', videoId: 'bluey-028' },
    { time: '17:23:00', videoId: 'edu-numeros-001' },
    
    { time: '18:00:00', videoId: 'osvegetais-002', title: 'Os Vegetais - Bloco 3', startAt: 2400, endAt: 3600 },
    { time: '18:20:00', videoId: 'bluey-029' },
    { time: '18:28:00', videoId: 'edu-bita-001' },
    
    { time: '19:00:00', videoId: 'bluey-030' },
    { time: '19:08:00', videoId: 'bluey-031' },
    { time: '19:16:00', videoId: 'bluey-032' },
    { time: '19:24:00', videoId: 'bluey-033' },
  ],

  // ========== QUINTA-FEIRA (4) ==========
  4: [
    { time: '07:00:00', videoId: 'bluey-034' },
    { time: '07:08:00', videoId: 'edu-numeros-001' },
    { time: '07:15:00', videoId: 'bluey-035' },
    { time: '07:23:00', videoId: 'edu-bita-001' },
    { time: '07:30:00', videoId: 'osvegetais-004', title: 'Os Vegetais - Bloco 1', startAt: 0, endAt: 1200 },
    { time: '07:50:00', videoId: 'bluey-036' },
    { time: '07:58:00', videoId: 'edu-dividir-001' },
    { time: '08:05:00', videoId: 'bluey-037' },
    { time: '08:13:00', videoId: 'edu-coresformas-001' },
    { time: '08:20:00', videoId: 'bluey-038' },
    { time: '08:28:00', videoId: 'artur-001' },
    { time: '09:05:00', videoId: 'bluey-039' },
    { time: '09:13:00', videoId: 'edu-animaisfazenda-001' },
    { time: '09:20:00', videoId: 'osvegetais-004', title: 'Os Vegetais - Bloco 2', startAt: 1200, endAt: 2348 },
    { time: '09:39:00', videoId: 'bluey-040' },
    { time: '09:47:00', videoId: 'edu-bebaagua-001' },
    { time: '09:54:00', videoId: 'osvegetais-001' },
    { time: '10:28:00', videoId: 'bluey-041' },
    { time: '10:36:00', videoId: 'edu-bita-002' },
    
    // Tarde
    { time: '12:00:00', videoId: 'bluey-042' },
    { time: '12:08:00', videoId: 'edu-monica-001' },
    { time: '12:15:00', videoId: 'osvegetais-003' },
    { time: '12:51:00', videoId: 'bluey-043' },
    { time: '12:59:00', videoId: 'edu-jac-001' },
    
    { time: '14:00:00', videoId: 'bluey-044' },
    { time: '14:08:00', videoId: 'edu-fauna-flora-001' },
    { time: '14:15:00', videoId: 'bluey-045' },
    { time: '14:23:00', videoId: 'edu-bellinha-respeito-001' },
    { time: '14:30:00', videoId: 'osvegetais-002', title: 'Os Vegetais - Bloco 1', startAt: 0, endAt: 1200 },
    { time: '14:50:00', videoId: 'bluey-046' },
    { time: '14:58:00', videoId: 'edu-bita-003' },
    
    // Noite
    { time: '17:00:00', videoId: 'bluey-047' },
    { time: '17:08:00', videoId: 'edu-coresformas-001' },
    { time: '17:15:00', videoId: 'bluey-048' },
    { time: '17:23:00', videoId: 'edu-numeros-001' },
    
    { time: '18:00:00', videoId: 'osvegetais-002', title: 'Os Vegetais - Bloco 2', startAt: 1200, endAt: 2400 },
    { time: '18:20:00', videoId: 'bluey-049' },
    { time: '18:28:00', videoId: 'edu-bita-001' },
    
    { time: '19:00:00', videoId: 'bluey-050' },
    { time: '19:08:00', videoId: 'bluey-051' },
    { time: '19:16:00', videoId: 'bluey-001' },
    { time: '19:24:00', videoId: 'bluey-002' },
  ],

  // ========== SEXTA-FEIRA (5) ==========
  5: [
    { time: '07:00:00', videoId: 'bluey-003' },
    { time: '07:08:00', videoId: 'edu-numeros-001' },
    { time: '07:15:00', videoId: 'bluey-004' },
    { time: '07:23:00', videoId: 'edu-bita-002' },
    { time: '07:30:00', videoId: 'osvegetais-001' },
    { time: '08:04:00', videoId: 'bluey-005' },
    { time: '08:12:00', videoId: 'edu-dividir-001' },
    { time: '08:19:00', videoId: 'bluey-006' },
    { time: '08:27:00', videoId: 'artur-001' },
    { time: '09:04:00', videoId: 'bluey-007' },
    { time: '09:12:00', videoId: 'edu-animaisfazenda-001' },
    { time: '09:19:00', videoId: 'osvegetais-003', title: 'Os Vegetais - Bloco 1', startAt: 0, endAt: 1200 },
    { time: '09:39:00', videoId: 'bluey-008' },
    { time: '09:47:00', videoId: 'edu-bebaagua-001' },
    { time: '09:54:00', videoId: 'osvegetais-003', title: 'Os Vegetais - Bloco 2', startAt: 1200, endAt: 2181 },
    { time: '10:10:00', videoId: 'bluey-009' },
    { time: '10:18:00', videoId: 'edu-coresformas-001' },
    { time: '10:25:00', videoId: 'bluey-010' },
    
    // Tarde
    { time: '12:00:00', videoId: 'bluey-011' },
    { time: '12:08:00', videoId: 'edu-monica-001' },
    { time: '12:15:00', videoId: 'osvegetais-004' },
    { time: '12:54:00', videoId: 'bluey-012' },
    { time: '13:02:00', videoId: 'edu-jac-001' },
    
    { time: '14:00:00', videoId: 'bluey-013' },
    { time: '14:08:00', videoId: 'edu-fauna-flora-001' },
    { time: '14:15:00', videoId: 'bluey-014' },
    { time: '14:23:00', videoId: 'edu-bellinha-respeito-001' },
    { time: '14:30:00', videoId: 'osvegetais-002', title: 'Os Vegetais - Bloco 1', startAt: 0, endAt: 1200 },
    { time: '14:50:00', videoId: 'bluey-015' },
    { time: '14:58:00', videoId: 'edu-bita-003' },
    
    // Noite
    { time: '17:00:00', videoId: 'bluey-016' },
    { time: '17:08:00', videoId: 'edu-coresformas-001' },
    { time: '17:15:00', videoId: 'bluey-017' },
    { time: '17:23:00', videoId: 'edu-numeros-001' },
    
    { time: '18:00:00', videoId: 'osvegetais-002', title: 'Os Vegetais - Bloco 2', startAt: 1200, endAt: 2400 },
    { time: '18:20:00', videoId: 'bluey-018' },
    { time: '18:28:00', videoId: 'edu-bita-001' },
    
    { time: '19:00:00', videoId: 'bluey-019' },
    { time: '19:08:00', videoId: 'bluey-020' },
    { time: '19:16:00', videoId: 'bluey-021' },
    { time: '19:24:00', videoId: 'bluey-022' },
  ],

  // ========== SÁBADO (6) ==========
  6: [
    { time: '07:00:00', videoId: 'bluey-023' },
    { time: '07:08:00', videoId: 'edu-numeros-001' },
    { time: '07:15:00', videoId: 'bluey-024' },
    { time: '07:23:00', videoId: 'edu-bita-001' },
    { time: '07:30:00', videoId: 'osvegetais-002', title: 'Os Vegetais - Completo (Bloco 1)', startAt: 0, endAt: 1200 },
    { time: '07:50:00', videoId: 'bluey-025' },
    { time: '07:58:00', videoId: 'edu-dividir-001' },
    { time: '08:05:00', videoId: 'bluey-026' },
    { time: '08:13:00', videoId: 'edu-coresformas-001' },
    { time: '08:20:00', videoId: 'bluey-027' },
    { time: '08:28:00', videoId: 'artur-001' },
    { time: '09:05:00', videoId: 'bluey-028' },
    { time: '09:13:00', videoId: 'edu-animaisfazenda-001' },
    { time: '09:20:00', videoId: 'osvegetais-002', title: 'Os Vegetais - Completo (Bloco 2)', startAt: 1200, endAt: 2400 },
    { time: '09:40:00', videoId: 'bluey-029' },
    { time: '09:48:00', videoId: 'edu-bebaagua-001' },
    { time: '09:55:00', videoId: 'osvegetais-001' },
    { time: '10:29:00', videoId: 'bluey-030' },
    { time: '10:37:00', videoId: 'edu-bita-002' },
    
    // Tarde
    { time: '12:00:00', videoId: 'bluey-031' },
    { time: '12:08:00', videoId: 'edu-monica-001' },
    { time: '12:15:00', videoId: 'osvegetais-003' },
    { time: '12:51:00', videoId: 'bluey-032' },
    { time: '12:59:00', videoId: 'edu-jac-001' },
    
    { time: '14:00:00', videoId: 'bluey-033' },
    { time: '14:08:00', videoId: 'edu-fauna-flora-001' },
    { time: '14:15:00', videoId: 'bluey-034' },
    { time: '14:23:00', videoId: 'edu-bellinha-respeito-001' },
    { time: '14:30:00', videoId: 'osvegetais-004' },
    { time: '15:09:00', videoId: 'bluey-035' },
    { time: '16:20:00', videoId: 'edu-bita-003' },
    
    // Noite
    { time: '17:00:00', videoId: 'bluey-036' },
    { time: '17:08:00', videoId: 'edu-coresformas-001' },
    { time: '17:15:00', videoId: 'bluey-037' },
    { time: '17:23:00', videoId: 'edu-numeros-001' },
    
    { time: '18:00:00', videoId: 'osvegetais-002', title: 'Os Vegetais - Completo (Bloco 3)', startAt: 2400, endAt: 3600 },
    { time: '18:20:00', videoId: 'bluey-038' },
    { time: '18:28:00', videoId: 'edu-bita-001' },
    
    { time: '19:00:00', videoId: 'bluey-039' },
    { time: '19:08:00', videoId: 'bluey-040' },
    { time: '19:16:00', videoId: 'bluey-041' },
    { time: '19:24:00', videoId: 'bluey-042' },
  ],
};

/**
 * Função auxiliar para obter a programação do dia atual
 */
export function getTodaySchedule(): ScheduledProgram[] {
  const today = new Date().getDay();
  return weeklySchedule[today] || [];
}

/**
 * Função auxiliar para obter o próximo programa agendado
 */
export function getNextProgram(now: Date = new Date()): ScheduledProgram | null {
  const dayOfWeek = now.getDay();
  const scheduleForToday = weeklySchedule[dayOfWeek];

  if (!scheduleForToday) {
    return null;
  }

  const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  for (const program of scheduleForToday) {
    const [h, m, s] = program.time.split(':').map(Number);
    const programTimeInSeconds = h * 3600 + m * 60 + s;

    if (programTimeInSeconds > currentTimeInSeconds) {
      return program;
    }
  }

  return null;
}

