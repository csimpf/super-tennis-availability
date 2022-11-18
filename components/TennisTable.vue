<script>
const API_URL =
  "https://west-epping-tennis.herokuapp.com/index.php";
const DAY_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export default {
  name: "tennisTable",
  data() {
    return {
      msg: null,
      debug: null,
    };
  },
  mounted() {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    document.getElementById("startDate").value = today.toJSON().slice(0, 10);
    document.getElementById("endDate").value = nextWeek.toJSON().slice(0, 10);
    this.getData(today.toJSON().slice(0, 10), nextWeek.toJSON().slice(0, 10));
  },

  methods: {
    mapCategory(num) {
      switch (num) {
        case 1e3:
          return "BOOKING";
        case 2e3:
          return "COACHING";
        case 7e3:
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
    getData(startDate, endDate) {
      fetch(API_URL + "?startDate=" + startDate + "&endDate=" + endDate)
        .then((rsp) => rsp.json().then((json) => (this.msg = json)))
        .catch((e) => window.alert(e));
    },
    onSubmit(e) {
      e.preventDefault();
      this.getData(e.target.startDate.value, e.target.endDate.value);
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
    <h1>Tennis Availability 🎾</h1>
    <form id="dateRange" @submit="onSubmit">
      <label for="startDate"> Start Date: </label>
      <input id="startDate" type="date" />
      <label for="endDate"> End Date: </label>
      <input id="endDate" type="date" />
      <input type="submit" value="Submit" />
    </form>
    <a href="https://play.tennis.com.au/WestEppingParkTennisCourts/court-hire/book-by-date">Book by Date</a>
    - 
    <a href="https://play.tennis.com.au/WestEppingParkTennisCourts/court-hire/book-by-court">Book by Court</a>
    <div v-if="!msg">Loading...</div>
    
    <div class="courts" v-for="resource in resourcesArray" :key="resource.Name">
      <h2>{{ resource.Name }}</h2>
      <table v-for="day in resource.Days" :key="day.Date">
        <tr>
          <th>{{ displayDate(day.Date) }}</th>
        </tr>
        <tr v-for="sess in day.Sessions" :key="sess.ID + '' + sess.StartTime">
          <td
            :class="[
              mapCategory(sess.Category),
              sess.Recurrence && 'recurrence',
            ]"
            :style="{ height: ((sess.Interval * 2) / 60) * 13.5 - 1 + 'px' }"
          >
            {{
              Math.floor(sess.StartTime / 60) * 100 +
              ((sess.StartTime / 60) % 1) * 60
            }}
            | {{ mapCategory(sess.Category) }} | {{ sess.Interval / 60 }} h
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
.main {
  overflow: auto;
  white-space: nowrap;
  animation-duration: 2sec;
}

table {
  font-size: 0.5em;

  border-collapse: collapse;
  border-radius: 4px;
  background-color: lightgrey;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: inline-block;
  vertical-align: top;
}

table td {
  border: 1px solid darkgrey;
  padding: 0;
  background-color: lightgrey;
}

td:hover {
  filter: brightness(95%);
}

.recurrence {
  background-color: rgb(208, 197, 194);
}
.FREE {
  background-color: lightgreen;
}
</style>
