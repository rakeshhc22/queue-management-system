const Queue = require("../models/Queue");
const Token = require("../models/Token");
const { v4: uuidv4 } = require("uuid");

// Create a new queue
exports.createQueue = async (req, res) => {
  try {
    const { name, description, managerId } = req.body;
    const newQueue = new Queue({ name, description, manager: managerId, tokens: [] });
    await newQueue.save();
    res.status(201).json({ message: "Queue created", queue: newQueue });
  } catch (err) {
    res.status(500).json({ message: "Error creating queue", error: err.message });
  }
};

// Get all queues
exports.getAllQueues = async (req, res) => {
  try {
    const queues = await Queue.find().populate("tokens");
    res.status(200).json(queues);
  } catch (err) {
    res.status(500).json({ message: "Error fetching queues", error: err.message });
  }
};

// Add token to queue
exports.addTokenToQueue = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const queueId = req.params.id;

    if (!name || !phone) {
      return res.status(400).json({ message: "Both name and phone are required" });
    }

    const queue = await Queue.findById(queueId);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const tokenCount = await Token.countDocuments({});
    const newToken = new Token({
      name,
      phone,
      tokenNumber: tokenCount + 1,
      status: "waiting",
    });

    await newToken.save();

    queue.tokens = queue.tokens || [];
    queue.tokens.push(newToken._id);
    await queue.save();

    res.status(201).json({ message: "Token added", token: newToken });
  } catch (err) {
    console.error("❌ Error in addTokenToQueue:", err);
    res.status(500).json({ message: "Error adding token", error: err.message });
  }
};

// Move token up in queue
exports.moveTokenUp = async (req, res) => {
  try {
    const { id, tokenId } = req.params;
    const queue = await Queue.findById(id);
    if (!queue) return res.status(404).json({ message: "Queue not found" });

    const index = queue.tokens.findIndex((tid) => tid.toString() === tokenId);
    if (index > 0) {
      [queue.tokens[index - 1], queue.tokens[index]] = [queue.tokens[index], queue.tokens[index - 1]];
      await queue.save();
    }

    res.status(200).json({ message: "Token moved up" });
  } catch (err) {
    res.status(500).json({ message: "Error moving token up", error: err.message });
  }
};

// Move token down in queue
exports.moveTokenDown = async (req, res) => {
  try {
    const { id, tokenId } = req.params;
    const queue = await Queue.findById(id);
    if (!queue) return res.status(404).json({ message: "Queue not found" });

    const index = queue.tokens.findIndex((tid) => tid.toString() === tokenId);
    if (index !== -1 && index < queue.tokens.length - 1) {
      [queue.tokens[index], queue.tokens[index + 1]] = [queue.tokens[index + 1], queue.tokens[index]];
      await queue.save();
    }

    res.status(200).json({ message: "Token moved down" });
  } catch (err) {
    res.status(500).json({ message: "Error moving token down", error: err.message });
  }
};

// Assign top token for service
exports.assignTopToken = async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue || queue.tokens.length === 0) {
      return res.status(404).json({ message: "Queue empty or not found" });
    }

    const topTokenId = queue.tokens[0];
    await Token.findByIdAndUpdate(topTokenId, { status: "serving" });

    res.status(200).json({ message: "Top token assigned for service", tokenId: topTokenId });
  } catch (err) {
    res.status(500).json({ message: "Error assigning token", error: err.message });
  }
};

// Serve next token
exports.serveNextToken = async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue || queue.tokens.length === 0) {
      return res.status(404).json({ message: "Queue empty or not found" });
    }

    const nextTokenId = queue.tokens.shift(); // remove from front of queue
    await queue.save();

    await Token.findByIdAndUpdate(nextTokenId, {
      status: "served",
      servedAt: new Date(), // ✅ Add this
    });

    res.status(200).json({ message: "Next token served", tokenId: nextTokenId });
  } catch (err) {
    res.status(500).json({ message: "Error serving token", error: err.message });
  }
};

// Cancel token via DELETE
exports.cancelTokenById = async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    const tokenId = req.params.tokenId;

    if (!queue || !queue.tokens.includes(tokenId)) {
      return res.status(404).json({ message: "Token not found in queue" });
    }

    queue.tokens = queue.tokens.filter((id) => id.toString() !== tokenId);
    await queue.save();

    await Token.findByIdAndUpdate(tokenId, { status: "canceled" });

    res.status(200).json({ message: "Token canceled", tokenId });
  } catch (err) {
    res.status(500).json({ message: "Error canceling token", error: err.message });
  }
};

// Reorder token (optional)
exports.reorderToken = async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    const { tokenId, newIndex } = req.body;

    const index = queue.tokens.findIndex((id) => id.toString() === tokenId);
    if (index === -1 || newIndex < 0 || newIndex >= queue.tokens.length) {
      return res.status(400).json({ message: "Invalid token ID or index" });
    }

    const [movedToken] = queue.tokens.splice(index, 1);
    queue.tokens.splice(newIndex, 0, movedToken);

    await queue.save();
    res.status(200).json({ message: "Token reordered" });
  } catch (err) {
    res.status(500).json({ message: "Error reordering token", error: err.message });
  }
};
// Get queue by ID with sorted tokens
// Get queue by ID with manually ordered tokens
exports.getQueueById = async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) return res.status(404).json({ message: "Queue not found" });

    // Step 1: Fetch all non-canceled tokens in queue
    const tokensMap = await Token.find({
      _id: { $in: queue.tokens },
      status: { $ne: "canceled" },
    }).then((docs) => {
      const map = new Map();
      docs.forEach((doc) => map.set(doc._id.toString(), doc));
      return map;
    });

    // Step 2: Preserve manual order from queue.tokens array
    const tokens = queue.tokens
      .map((id) => tokensMap.get(id.toString()))
      .filter(Boolean); // remove any missing tokens

    res.status(200).json({ queue, tokens });
  } catch (err) {
    console.error("Error fetching queue by ID:", err);
    res.status(500).json({ message: "Error fetching queue", error: err.message });
  }
};
