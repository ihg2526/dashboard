const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR)
    },
    filename: function (req, file, cb) {
        // Sanitize filename: remove spaces/special chars or keep it simple
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper to read DB
const readDB = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading DB:", err);
        return { teams: [], fixtures: [], metadata: {}, forms: [] };
    }
};

// Helper to write DB
const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 4));
    } catch (err) {
        console.error("Error writing DB:", err);
    }
};

// --- Endpoints ---

// 1. Metadata
app.get('/api/metadata', (req, res) => {
    const db = readDB();
    res.json(db.metadata);
});

// 2. Teams
app.get('/api/teams', (req, res) => {
    const db = readDB();
    res.json(db.teams);
});

// 3. Fixtures
app.get('/api/fixtures', (req, res) => {
    const db = readDB();
    res.json(db.fixtures);
});

app.post('/api/fixtures', (req, res) => {
    const db = readDB();
    const newResults = req.body; // Expecting array

    if (!Array.isArray(newResults)) {
        return res.status(400).json({ error: "Body must be an array of fixtures" });
    }

    // Assign IDs
    const currentMaxId = db.fixtures.length > 0 ? Math.max(...db.fixtures.map(f => f.id)) : 0;

    const resultsToAdd = newResults.map((result, index) => ({
        ...result,
        id: currentMaxId + 1 + index,
        status: 'Final'
    }));

    db.fixtures.push(...resultsToAdd);
    writeDB(db);

    res.status(201).json(resultsToAdd);
});

// 4. Standings (Manual)
app.get('/api/standings', (req, res) => {
    const db = readDB();
    res.json(db.standings || []);
});

app.post('/api/standings', (req, res) => {
    const db = readDB();
    const newStanding = req.body; // Expecting { sport, gender, entries: [{teamId, points}] }

    // Basic validation
    if (!newStanding.sport || !newStanding.gender || !Array.isArray(newStanding.entries)) {
        return res.status(400).json({ error: "Invalid standings format" });
    }

    // Check if entry exists, update if so, else push
    const index = db.standings ? db.standings.findIndex(s => s.sport === newStanding.sport && s.gender === newStanding.gender) : -1;

    if (index !== -1) {
        db.standings[index] = newStanding;
    } else {
        if (!db.standings) db.standings = [];
        db.standings.push(newStanding);
    }

    writeDB(db);
    res.json(newStanding);
});

// 5. Initial Data
app.get('/api/initial-data', (req, res) => {
    const db = readDB();
    res.json({
        teams: db.teams,
        fixtures: db.fixtures,
        sports: db.metadata.sports,
        genders: db.metadata.genders,
        standings: db.standings || [],
        forms: db.forms || []
    });
});

// 6. Forms
app.get('/api/forms', (req, res) => {
    const db = readDB();
    res.json(db.forms || []);
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { name } = req.body;
        if (!name) {
            // Clean up file if no name provided? 
            // fs.unlinkSync(req.file.path); 
            // actually, better to keep it simple for now, or require name.
            return res.status(400).json({ error: 'Form name represents is required' });
        }

        const db = readDB();
        if (!db.forms) db.forms = [];

        const newForm = {
            id: Date.now(), // simple ID
            name: name,
            fileName: req.file.filename,
            originalName: req.file.originalname,
            path: `/uploads/${req.file.filename}`, // Relative path for frontend
            uploadedAt: new Date().toISOString()
        };

        db.forms.push(newForm);
        writeDB(db);

        res.status(201).json(newForm);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

app.delete('/api/forms/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);

    if (!db.forms) return res.status(404).json({ error: 'Form not found' });

    const formIndex = db.forms.findIndex(f => f.id === id);
    if (formIndex === -1) {
        return res.status(404).json({ error: 'Form not found' });
    }

    const form = db.forms[formIndex];

    // Attempt to delete file from disk
    const filePath = path.join(UPLOADS_DIR, form.fileName);
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error("Error deleting file:", err);
            // Continue to delete from DB even if file delete fails (orphaned file)
        }
    }

    db.forms.splice(formIndex, 1);
    writeDB(db);

    res.json({ message: 'Form deleted successfully' });
});

// 7. Publish to Static (For deployment)
app.post('/api/publish', async (req, res) => {
    try {
        console.log("Publishing data...");
        const db = readDB();

        // 1. Normalize Data
        // Fix image paths: "../assets/..." -> "/assets/..."
        if (db.teams) {
            db.teams = db.teams.map(team => ({
                ...team,
                image: team.image.startsWith('..') ? team.image.replace('..', '') : team.image
            }));
        }

        // 2. Write to src/staticDb.json
        // Go up one level from backend, then into src
        const staticDbPath = path.join(__dirname, '..', 'src', 'staticDb.json');
        fs.writeFileSync(staticDbPath, JSON.stringify(db, null, 4));
        console.log("Updated staticDb.json");

        // 3. Sync Uploads
        // Copy backend/uploads -> public/uploads
        const publicUploadsDir = path.join(__dirname, '..', 'public', 'uploads');

        if (!fs.existsSync(publicUploadsDir)) {
            fs.mkdirSync(publicUploadsDir, { recursive: true });
        }

        if (fs.existsSync(UPLOADS_DIR)) {
            const files = fs.readdirSync(UPLOADS_DIR);
            for (const file of files) {
                const srcPath = path.join(UPLOADS_DIR, file);
                const destPath = path.join(publicUploadsDir, file);
                fs.copyFileSync(srcPath, destPath);
            }
            console.log(`Synced ${files.length} files to public/uploads`);
        }

        res.json({ message: 'Data published successfully! Ready for deployment.' });
    } catch (error) {
        console.error("Publish error:", error);
        res.status(500).json({ error: 'Failed to publish data' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
