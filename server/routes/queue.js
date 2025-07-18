const express = require("express");
const router = express.Router();
const queueController = require("../controllers/queueController");

// Queue routes
router.post("/create", queueController.createQueue);
router.get("/", queueController.getAllQueues);
router.get("/:id", queueController.getQueueById);

// Token routes within a queue
router.post("/:id/token", queueController.addTokenToQueue); // add a token
router.post("/:id/token/:tokenId/move-up", queueController.moveTokenUp); // move token up
router.post("/:id/token/:tokenId/move-down", queueController.moveTokenDown); // move token down
router.post("/:id/assign", queueController.assignTopToken); // assign top token
router.delete("/:id/token/:tokenId", queueController.cancelTokenById); // cancel token
router.post("/:id/serve", queueController.serveNextToken);

module.exports = router;
