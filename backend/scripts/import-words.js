const https = require('https');
const mongoose = require('mongoose');

// connect to MongoDB
const connectDB = async () => {
  try {
    // here we can just use `export DATABASE_URL=<database-connection-string>` because I was too lazy to add a separate .env
    await mongoose.connect(
      process.env.DATABASE_URL || "mongodb://localhost:27017/dictionary",
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// word schema (MATCH THE BACKEND SCHEMA)
const wordSchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true, index: true },
  createdAt: { type: Date, default: Date.now },
});

const Word = mongoose.model("Word", wordSchema);

// download words from GitHub
const downloadWords = () => {
  return new Promise((resolve, reject) => {
    const url =
      "https://raw.githubusercontent.com/meetDeveloper/freeDictionaryAPI/refs/heads/master/meta/wordList/english.txt";

    console.log("Downloading words from:", url);

    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          return;
        }

        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          console.log("Download completed");
          resolve(data);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

// import words to database
const importWords = async (wordsData) => {
  try {
    // initial treatment
    const words = wordsData
      .split("\n")
      .map((word) => word.trim())
      .map((word) => word.replace(/\d+/g, ""))
      .filter((word) => word.length > 1)
      .map((word) => ({ word: word.toLowerCase() }));

    console.log(`Found ${words.length} words to import`);

    await Word.deleteMany({});
    console.log("Cleared existing words");

    // import words in batches using upsert to handle duplicates
    const batchSize = 1000;
    let upserted = 0;

    for (let i = 0; i < words.length; i += batchSize) {
      const batch = words.slice(i, i + batchSize);
      
      // create bulk operations with upsert
      const bulkOps = batch.map((wordDoc) => ({
        updateOne: {
          filter: { word: wordDoc.word },
          update: { $set: wordDoc },
          upsert: true,
        },
      }));

      const result = await Word.bulkWrite(bulkOps, { ordered: false });
      upserted += result.upsertedCount;
      
      console.log(`Processed ${i + batch.length}/${words.length} words. ${upserted} inserted in the db`);
    }

    console.log(`Successfully processed ${words.length} words)`);
    return upserted;
  } catch (error) {
    console.error("Error importing words:", error);
    throw error;
  }
};

const main = async () => {
  try {
    await connectDB();

    const wordsData = await downloadWords();
    const importedCount = await importWords(wordsData);

    console.log(`Import completed: ${importedCount} words imported`);

    // verify import
    const totalWords = await Word.countDocuments();
    console.log(`Total words in database: ${totalWords}`);
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};


// be careful to not import this script anywhere 
// else because it will run on the import statement
main();

