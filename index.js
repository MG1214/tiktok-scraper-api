const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/search", async (req, res) => {
  const keyword = req.query.keyword || "skincare";
  const limit = req.query.limit || 5;

  try {
    const response = await axios.get(`https://api.tikwm.com/feed/search`, {
      params: { query: keyword, count: limit }
    });

    const items = response.data.data || [];

    const results = items.map(item => ({
      title: item.title,
      videoUrl: `https://www.tiktok.com/@${item.author.unique_id}/video/${item.id}`,
      views: item.play_count,
      likes: item.digg_count,
      shares: item.share_count,
      comments: item.comment_count,
      author: item.author.nickname,
      uploadDate: new Date(item.create_time * 1000).toLocaleDateString()
    }));

    res.json(results);
  } catch (err) {
    console.error("Scraper Error:", err.message);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
