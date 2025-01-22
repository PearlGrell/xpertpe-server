import { createServer } from 'node:http';
import app from './app';
import { settings } from './config/settings';

const PORT: number = settings.server.port || 3000;

const server = createServer(app);

server.listen(PORT, () => {
    console.log(`App Server is running on http://localhost:${PORT}`);
});