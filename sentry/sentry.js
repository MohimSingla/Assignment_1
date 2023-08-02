const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://3b55aafdc6804d0b948ae2478917bccb@o201295.ingest.sentry.io/4505602112356352",
});

module.exports = { Sentry };