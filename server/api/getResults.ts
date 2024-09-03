const API_URL =
  "https://play.tennis.com.au/v0/BookACourtVenue/WestEppingParkTennisCourts/GetVenueSessions";

export default defineEventHandler(async (event) => {
  const data: JSON = await $fetch(
    API_URL + event.path.substring(event.path.indexOf("?"))
  );

  return { ...data };
});
