# Admin Recovery and Lockout Stabilization

## Root Cause

The admin account `admin@infinity.com` was caught in the account lockout flow after repeated failed logins.
The prior implementation used a blocked state that could remain sticky if the account never completed a successful login, which made the lockout appear permanent in production.

## Recovery Procedure

### Immediate MongoDB Repair

Run this in MongoDB Compass, Atlas Data Explorer, or the Mongo shell:

```js
db.users.updateOne(
  { email: "admin@infinity.com" },
  {
    $set: {
      isBlocked: false,
      failedLoginAttempts: 0,
      lockUntil: null,
      isVerified: true,
      role: "admin"
    }
  }
);
```

### Scripted Recovery

From the backend folder:

```bash
npm run unblock-admin
```

This script:

- connects with `process.env.MONGO_URI`
- updates only `admin@infinity.com`
- clears `failedLoginAttempts`
- clears `lockUntil`
- restores `isBlocked: false`
- preserves `role: "admin"`
- preserves `isVerified: true`

## Rollback Instructions

If recovery must be reverted for any reason, re-run the admin lockout conditions through the login flow rather than editing unrelated auth records.
Do not change passwords or JWT configuration during recovery.

## Security Notes

- Lockout protection remains enabled.
- JWT verification remains unchanged.
- OTP verification remains enabled.
- Admin-only middleware remains enforced.
- The recovery script is maintenance-only and should not be exposed as a public endpoint.

## Troubleshooting

- If the script reports missing `MONGO_URI`, verify the backend environment variables before running it.
- If login still fails after recovery, confirm the stored password hash for `admin@infinity.com` and check whether the frontend is sending the correct credentials.
- If OTP delivery fails, inspect SMTP credentials and mail provider limits.

## Operational Notes

- Temporary lockouts now expire after 30 minutes.
- Expired locks are auto-cleared on the next login attempt.
- Structured auth logs are emitted for failed logins, lockouts, lock resets, OTP failures, and successful logins.
