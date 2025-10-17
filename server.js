const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Store rooms in memory
const rooms = {};

// Clean up old rooms every 5 minutes
setInterval(() => {
    const now = Date.now();
    Object.keys(rooms).forEach(code => {
        if (now - rooms[code].lastUpdate > 30 * 60 * 1000) { // 30 minutes
            delete rooms[code];
        }
    });
}, 5 * 60 * 1000);

// Create or update room
app.post('/room/:code', (req, res) => {
    const { code } = req.params;
    const roomData = req.body;
    
    rooms[code] = {
        ...roomData,
        lastUpdate: Date.now()
    };
    
    res.json({ success: true });
});

// Get room data
app.get('/room/:code', (req, res) => {
    const { code } = req.params;
    
    if (!rooms[code]) {
        return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json(rooms[code]);
});

// Check if room exists
app.get('/room/:code/exists', (req, res) => {
    const { code } = req.params;
    res.json({ exists: !!rooms[code] });
});

// Health check
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        rooms: Object.keys(rooms).length,
        message: 'Set Card Game Server' 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});