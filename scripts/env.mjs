import dotenv from "dotenv";

dotenv.config();

const {
  TIDB_USER,
  TIDB_PASSWORD,
  TIDB_HOST,
  TIDB_PORT,
  TIDB_DB_NAME = "mhn_db",
  DATABASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET,
  NEXTAUTH_URL,
} = process.env;
// Notice: When using TiDb Cloud Serverless Tier, you **MUST** set the following flags to enable tls connection.
const SSL_FLAGS = "pool_timeout=60&sslaccept=accept_invalid_certs";

if (TIDB_USER && TIDB_HOST && TIDB_PORT) {
  console.log(
    `mysql://${TIDB_USER}:${TIDB_PASSWORD}@${TIDB_HOST}:${TIDB_PORT}/${TIDB_DB_NAME}?${SSL_FLAGS}`,
  );
} else {
  console.log(`${DATABASE_URL}?${SSL_FLAGS}`);
}
