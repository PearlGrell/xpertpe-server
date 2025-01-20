import app from './app';
import { settings } from './config/settings';

const PORT: number = settings.server.port || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});