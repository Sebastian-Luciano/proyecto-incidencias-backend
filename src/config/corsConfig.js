const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

export default corsOptions;