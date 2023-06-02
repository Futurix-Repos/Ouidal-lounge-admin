var Service = require("node-windows").Service
const path = require("path")
const script = path.join(__dirname, "server.js")

// Create a new service object
var svc = new Service({
  name: "3008-ADMIN",
  description: "Frontend admin",
  script,
  nodeOptions: ["--harmony", "--max_old_space_size=4096"],
})

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on("install", function () {
  svc.start()
})

svc.install()
