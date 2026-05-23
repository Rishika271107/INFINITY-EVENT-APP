// config/config.js
// Centralized environment configuration and validation

const path = require('path');
const dotenv = require('dotenv-flow');
const Joi = require('joi');

// Load .env files based on NODE_ENV (development, production, test)
dotenv.config({
  node_env: process.env.NODE_ENV || 'development',
  default_node_env: 'development',
  path: path.resolve(__dirname, '..')
});

// Define validation schema for required environment variables
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(5000),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().min(10).required(),
  RAZORPAY_KEY_ID: Joi.string().required(),
  RAZORPAY_KEY_SECRET: Joi.string().required(),
  EMAIL_USER: Joi.string().email().required(),
  EMAIL_PASS: Joi.string().required(),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:5173')
}).unknown(); // allow extra vars

const { error, value: env } = envSchema.validate(process.env);
if (error) {
  // Logging will be set up later; for now use console.error and exit
  console.error('❌ Invalid environment configuration:', error.message);
  process.exit(1);
}

module.exports = env;
