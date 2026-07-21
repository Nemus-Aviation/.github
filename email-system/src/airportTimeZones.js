/**
 * Airport code → IANA timezone lookup.
 *
 * Used to render flight times in the airport's local zone when the caller does
 * not pass an explicit `timeZone`. Both ICAO (e.g. "KTEB") and IATA (e.g.
 * "TEB") codes are accepted, case-insensitively.
 *
 * This is a curated list of airports Nemus Aviation is likely to serve — major
 * US commercial and business-aviation fields plus common international
 * destinations. It is intentionally not exhaustive: `lookupTimeZone` returns
 * `undefined` for unknown codes, and callers can always override by passing
 * `timeZone` / `departureTimeZone` / `arrivalTimeZone` directly.
 *
 * To add an airport, add both its ICAO and IATA codes pointing at the IANA
 * zone name (see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
 */
export const AIRPORT_TIMEZONES = Object.freeze({
  // --- US Eastern (America/New_York) ---------------------------------------
  KATL: 'America/New_York', ATL: 'America/New_York',
  KBOS: 'America/New_York', BOS: 'America/New_York',
  KBWI: 'America/New_York', BWI: 'America/New_York',
  KBDL: 'America/New_York', BDL: 'America/New_York',
  KBTV: 'America/New_York', BTV: 'America/New_York',
  KBUF: 'America/New_York', BUF: 'America/New_York',
  KCLT: 'America/New_York', CLT: 'America/New_York',
  KCLE: 'America/New_York', CLE: 'America/New_York',
  KCMH: 'America/New_York', CMH: 'America/New_York',
  KDCA: 'America/New_York', DCA: 'America/New_York',
  KDTW: 'America/New_York', DTW: 'America/New_York',
  KEWR: 'America/New_York', EWR: 'America/New_York',
  KFLL: 'America/New_York', FLL: 'America/New_York',
  KFXE: 'America/New_York', FXE: 'America/New_York',
  KHPN: 'America/New_York', HPN: 'America/New_York',
  KIAD: 'America/New_York', IAD: 'America/New_York',
  KIND: 'America/New_York', IND: 'America/New_York',
  KISP: 'America/New_York', ISP: 'America/New_York',
  KJAX: 'America/New_York', JAX: 'America/New_York',
  KJFK: 'America/New_York', JFK: 'America/New_York',
  KLGA: 'America/New_York', LGA: 'America/New_York',
  KMCO: 'America/New_York', MCO: 'America/New_York',
  KMIA: 'America/New_York', MIA: 'America/New_York',
  KMMU: 'America/New_York', MMU: 'America/New_York',
  KOPF: 'America/New_York', OPF: 'America/New_York',
  KPBI: 'America/New_York', PBI: 'America/New_York',
  KPHL: 'America/New_York', PHL: 'America/New_York',
  KPIT: 'America/New_York', PIT: 'America/New_York',
  KPVD: 'America/New_York', PVD: 'America/New_York',
  KRDU: 'America/New_York', RDU: 'America/New_York',
  KRIC: 'America/New_York', RIC: 'America/New_York',
  KROC: 'America/New_York', ROC: 'America/New_York',
  KSAV: 'America/New_York', SAV: 'America/New_York',
  KTEB: 'America/New_York', TEB: 'America/New_York',
  KTPA: 'America/New_York', TPA: 'America/New_York',

  // --- US Central (America/Chicago) ----------------------------------------
  KADS: 'America/Chicago', ADS: 'America/Chicago',
  KAUS: 'America/Chicago', AUS: 'America/Chicago',
  KBNA: 'America/Chicago', BNA: 'America/Chicago',
  KDAL: 'America/Chicago', DAL: 'America/Chicago',
  KDFW: 'America/Chicago', DFW: 'America/Chicago',
  KDSM: 'America/Chicago', DSM: 'America/Chicago',
  KHOU: 'America/Chicago', HOU: 'America/Chicago',
  KIAH: 'America/Chicago', IAH: 'America/Chicago',
  KMCI: 'America/Chicago', MCI: 'America/Chicago',
  KMDW: 'America/Chicago', MDW: 'America/Chicago',
  KMEM: 'America/Chicago', MEM: 'America/Chicago',
  KMKE: 'America/Chicago', MKE: 'America/Chicago',
  KMSP: 'America/Chicago', MSP: 'America/Chicago',
  KMSY: 'America/Chicago', MSY: 'America/Chicago',
  KOKC: 'America/Chicago', OKC: 'America/Chicago',
  KOMA: 'America/Chicago', OMA: 'America/Chicago',
  KORD: 'America/Chicago', ORD: 'America/Chicago',
  KSAT: 'America/Chicago', SAT: 'America/Chicago',
  KSTL: 'America/Chicago', STL: 'America/Chicago',
  KSUS: 'America/Chicago', SUS: 'America/Chicago',
  KTUL: 'America/Chicago', TUL: 'America/Chicago',

  // --- US Mountain (America/Denver) ----------------------------------------
  KABQ: 'America/Denver', ABQ: 'America/Denver',
  KAPA: 'America/Denver', APA: 'America/Denver',
  KASE: 'America/Denver', ASE: 'America/Denver',
  KBIL: 'America/Denver', BIL: 'America/Denver',
  KBJC: 'America/Denver', BJC: 'America/Denver',
  KBZN: 'America/Denver', BZN: 'America/Denver',
  KCOS: 'America/Denver', COS: 'America/Denver',
  KDEN: 'America/Denver', DEN: 'America/Denver',
  KEGE: 'America/Denver', EGE: 'America/Denver',
  KJAC: 'America/Denver', JAC: 'America/Denver',

  // --- US Mountain, no DST (America/Phoenix) -------------------------------
  KPHX: 'America/Phoenix', PHX: 'America/Phoenix',
  KSDL: 'America/Phoenix', SDL: 'America/Phoenix',
  KTUS: 'America/Phoenix', TUS: 'America/Phoenix',

  // --- US Pacific (America/Los_Angeles) ------------------------------------
  KBUR: 'America/Los_Angeles', BUR: 'America/Los_Angeles',
  KCRQ: 'America/Los_Angeles', CRQ: 'America/Los_Angeles',
  KLAS: 'America/Los_Angeles', LAS: 'America/Los_Angeles',
  KLAX: 'America/Los_Angeles', LAX: 'America/Los_Angeles',
  KLGB: 'America/Los_Angeles', LGB: 'America/Los_Angeles',
  KOAK: 'America/Los_Angeles', OAK: 'America/Los_Angeles',
  KONT: 'America/Los_Angeles', ONT: 'America/Los_Angeles',
  KPDX: 'America/Los_Angeles', PDX: 'America/Los_Angeles',
  KPSP: 'America/Los_Angeles', PSP: 'America/Los_Angeles',
  KRNO: 'America/Los_Angeles', RNO: 'America/Los_Angeles',
  KSAN: 'America/Los_Angeles', SAN: 'America/Los_Angeles',
  KSBA: 'America/Los_Angeles', SBA: 'America/Los_Angeles',
  KSEA: 'America/Los_Angeles', SEA: 'America/Los_Angeles',
  KSFO: 'America/Los_Angeles', SFO: 'America/Los_Angeles',
  KSJC: 'America/Los_Angeles', SJC: 'America/Los_Angeles',
  KSMF: 'America/Los_Angeles', SMF: 'America/Los_Angeles',
  KSNA: 'America/Los_Angeles', SNA: 'America/Los_Angeles',
  KTRK: 'America/Los_Angeles', TRK: 'America/Los_Angeles',
  KVNY: 'America/Los_Angeles', VNY: 'America/Los_Angeles',

  // --- US Alaska & Hawaii --------------------------------------------------
  PANC: 'America/Anchorage', ANC: 'America/Anchorage',
  PAFA: 'America/Anchorage', FAI: 'America/Anchorage',
  PHNL: 'Pacific/Honolulu', HNL: 'Pacific/Honolulu',
  PHOG: 'Pacific/Honolulu', OGG: 'Pacific/Honolulu',
  PHKO: 'Pacific/Honolulu', KOA: 'Pacific/Honolulu',
  PHLI: 'Pacific/Honolulu', LIH: 'Pacific/Honolulu',

  // --- Canada --------------------------------------------------------------
  CYYZ: 'America/Toronto', YYZ: 'America/Toronto',
  CYTZ: 'America/Toronto', YTZ: 'America/Toronto',
  CYUL: 'America/Toronto', YUL: 'America/Toronto',
  CYOW: 'America/Toronto', YOW: 'America/Toronto',
  CYVR: 'America/Vancouver', YVR: 'America/Vancouver',
  CYYC: 'America/Edmonton', YYC: 'America/Edmonton',

  // --- Mexico, Caribbean & Bermuda -----------------------------------------
  MMMX: 'America/Mexico_City', MEX: 'America/Mexico_City',
  MMUN: 'America/Cancun', CUN: 'America/Cancun',
  MMSD: 'America/Mazatlan', SJD: 'America/Mazatlan',
  MYNN: 'America/Nassau', NAS: 'America/Nassau',
  TXKF: 'Atlantic/Bermuda', BDA: 'Atlantic/Bermuda',

  // --- Europe & Middle East (common business-jet destinations) -------------
  EGLL: 'Europe/London', LHR: 'Europe/London',
  EGGW: 'Europe/London', LTN: 'Europe/London',
  EGLF: 'Europe/London', FAB: 'Europe/London',
  LFPG: 'Europe/Paris', CDG: 'Europe/Paris',
  LFPB: 'Europe/Paris', LBG: 'Europe/Paris',
  LFMN: 'Europe/Paris', NCE: 'Europe/Paris',
  LSGG: 'Europe/Zurich', GVA: 'Europe/Zurich',
  LSZH: 'Europe/Zurich', ZRH: 'Europe/Zurich',
  OMDB: 'Asia/Dubai', DXB: 'Asia/Dubai',
});

/**
 * Look up the IANA timezone for an airport code (ICAO or IATA).
 * @param {string} code
 * @returns {string|undefined} The IANA zone name, or undefined if unknown.
 */
export function lookupTimeZone(code) {
  if (!code || typeof code !== 'string') return undefined;
  return AIRPORT_TIMEZONES[code.trim().toUpperCase()];
}
