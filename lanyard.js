var statusIcon = document.getElementById("statusIcon");
var statusContent = document.getElementById("statusContent");

const lanyard = new WebSocket("wss://api.lanyard.rest/socket");

var api = {};
var received = false;

lanyard.onopen = function () {
  lanyard.send(
    JSON.stringify({
      op: 2,
      d: {
        subscribe_to_id: "518810657043382272",
      },
    })
  );
};

setInterval(() => {
  if (received) {
    lanyard.send(
      JSON.stringify({
        op: 3,
      })
    );
  }
}, 30000);

lanyard.onmessage = function (event) {
  received = true;
  api = JSON.parse(event.data);

  if (api.t === "INIT_STATE" || api.t === "PRESENCE_UPDATE") {
    update_presence();
  }
};

function update_presence() {
  if (statusIcon != null) {
    update_status(api.d.discord_status);
  }

  if (api.d.discord_status === "dnd") {
    statusContent.innerHTML = `<p class="w-3 h-3 bg-red-500 rounded-full inline-flex ml-1 mr-1"></p> Online`;

  } else if (api.d.discord_status === "idle") {
    statusContent.innerHTML = `<p class="w-3 h-3 bg-yellow-500 rounded-full inline-flex ml-1 mr-1"></p> Online`;

  } else if (api.d.discord_status === "online") {
    statusContent.innerHTML = `<p class="w-3 h-3 bg-green-500 rounded-full inline-flex ml-1 mr-1"></p> Online`;

  } else if (api.d.discord_status === "offline") {
    statusContent.innerHTML = `<p class="w-3 h-3 bg-gray-500 rounded-full inline-flex ml-1 mr-1"></p> Offline`;

  } else {
    statusContent.innerHTML = `<p class="w-3 h-3 bg-gray-500 rounded-full inline-flex ml-1 mr-1"></p> Loading`;

  }
}