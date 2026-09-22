// Side-effect import, not `import dotenv from "dotenv"; dotenv.config();`.
// ES module imports are all evaluated before any other top-level code in
// this file, regardless of source order — so `app.js` (which transitively
// constructs the R2 S3Client at module-load time in config/r2.ts) would
// otherwise load before a later `dotenv.config()` call ever ran, baking in
// undefined credentials. This form runs dotenv's side effect as part of
// import evaluation itself, so it's guaranteed to run first.
import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";


await connectDB();

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});