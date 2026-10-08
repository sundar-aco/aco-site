/*
 * ACO website settings — the only file you need to edit.
 *
 * WAITLIST_ENDPOINT: the web address that receives waitlist sign-ups.
 *   Leave it empty ("") until the ACO app is live. While it is empty, the
 *   form opens the visitor's email app instead (a "mailto:" link).
 *   Later, set it to the app's address, for example:
 *   "https://app.yugatime.space/api/waitlist"
 *   The form sends a POST request with JSON: { name, email, use, source, page, submittedAt }.
 *
 * CONTACT_EMAIL: the public contact address shown in the footer and used
 *   for the email fallback. Empty = shows "[email]" as a placeholder.
 *
 * Nothing secret belongs in this file — everyone can read it.
 */
window.ACO_CONFIG = {
  WAITLIST_ENDPOINT: "",
  CONTACT_EMAIL: ""
};
