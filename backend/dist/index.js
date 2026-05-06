import app from "./app";
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
  🚀 Scholar Sphere Backend is active
  📡 Server running at http://localhost:${PORT}
  🛠️  Mode: ${process.env.NODE_ENV || "development"}
  `);
});
//# sourceMappingURL=index.js.map