<script>
//   "https://west-epping-tennis.herokuapp.com/index.php";
const API_URL =
  "https://play.tennis.com.au/v0/BookACourtVenue/WestEppingParkTennisCourts/GetVenueSessions";
const DAY_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const BOOKING_URL =
  "https://play.tennis.com.au/WestEppingParkTennisCourts/court-hire/book-by-date#";
export default {
  name: "tennisTable",
  data() {
    return {
      msg: null,
      debug: null,
      isDirty: false,
    };
  },
  mounted() {
    document.title = "Tennis Availability";
    if (this.$route.query.from && this.$route.query.to) {
      this.getData(this.$route.query.from, this.$route.query.to);
      document.getElementById("startDate").value = this.$route.query.from;
      document.getElementById("endDate").value = this.$route.query.to;
    } else {
      this.initialise();
    }
  },

  methods: {
    mapCategory(num) {
      switch (num) {
        case 1000:
          return "BOOKING";
        case 2000:
          return "COACHING";
        case 7000:
          return "MAINTENANCE";
        case 0:
          return "FREE";
        default:
          return num;
      }
    },
    displayDate(date) {
      const temp = new Date(date);
      return DAY_OF_WEEK[temp.getDay()] + " " + temp.toLocaleDateString();
    },
    initialise() {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      document.getElementById("startDate").value = today.toJSON().slice(0, 10);
      document.getElementById("endDate").value = nextWeek.toJSON().slice(0, 10);
      this.getData(today.toJSON().slice(0, 10), nextWeek.toJSON().slice(0, 10));
    },
    getData(startDate, endDate) {
      fetch(API_URL + "?startDate=" + startDate + "&endDate=" + endDate)
        .then((rsp) =>
          rsp.json().then((json) => {
            this.msg = json;
            this.isDirty = false;
          })
        )
        .catch((e) => window.alert(e));
    },
    onSubmit(e) {
      e.preventDefault();
      if (this.isDirty & (e.submitter.value == "Submit")) {
        this.msg = null;
        this.getData(e.target.startDate.value, e.target.endDate.value);
        this.$router.push({
          path: "/",
          query: { from: e.target.startDate.value, to: e.target.endDate.value },
        });
      } else if (e.submitter.value == "Reset") {
        this.initialise();
      } else {
        console.log("No change in the form, prevented submit");
      }
    },
    onChange(e) {
      this.isDirty = true;
    },
    generateBookingURL(date) {
      return BOOKING_URL + "?date=" + date.slice(0, 10);
    },
  },

  computed: {
    computedMessage() {
      return this.msg;
    },
    resourcesArray() {
      return this.msg?.Resources;
    },
  },
};
</script>

<template>
  <div class="main">
    <h1>Tennis Availability</h1>
    <form id="dateRange" @submit="onSubmit" @change="onChange">
      <label for="startDate"> Start Date: </label>
      <input id="startDate" type="date" />
      <label for="endDate"> End Date: </label>
      <input id="endDate" type="date" />
      <input type="submit" value="Submit" />
      <input type="submit" value="Reset" />
    </form>
    <div v-if="!msg">Loading...</div>

    <div class="courts" v-for="resource in resourcesArray" :key="resource.Name">
      <h2>{{ resource.Name }}</h2>
      <div class="booking-table">
        <table v-for="day in resource.Days" :key="day.Date">
          <a :href="generateBookingURL(day.Date)">
            <tr>
              <th>{{ displayDate(day.Date) }}</th>
            </tr>
            <tr
              v-for="sess in day.Sessions"
              :key="sess.ID + '' + sess.StartTime"
            >
              <td
                :class="[
                  mapCategory(sess.Category),
                  sess.Recurrence && 'recurrence',
                ]"
                :style="{
                  height: ((sess.Interval * 2) / 60) * 17.5 - 1 + 'px',
                }"
                :title="mapCategory(sess.Category)"
              >
                {{
                  Math.floor(sess.StartTime / 60) * 100 +
                  ((sess.StartTime / 60) % 1) * 60
                }}
                {{ sess.Interval / 60 }} h
              </td>
            </tr>
          </a>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  overflow: auto;
  white-space: nowrap;
  animation-duration: 2sec;
}

a {
  text-decoration: none;
  color: unset;
}

@media only screen and (max-width: 600px) {
  form {
    display: flex;
    flex-direction: column;
  }
}

input {
  margin: 8px 8px;
  padding: 8px 8px;
  border-style: outset;
  border-width: 0;
  border-radius: 8px;
}

.booking-table {
  overflow-x: auto;
}

table {
  font-size: 0.75em;
  border-collapse: collapse;
  border-radius: 4px;
  background-color: #e09f3e;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: inline-block;
  vertical-align: top;
}

table td {
  border: 1px solid rgb(116, 109, 97);
  padding: 0 4px;
  background-color: #9d5252;
  user-select: none;
  vertical-align: middle;
}

td:hover {
  filter: brightness(115%);
}

.recurrence {
  background-color: #9d5252;
}
.FREE {
  background-color: #66a237;
}
</style>
