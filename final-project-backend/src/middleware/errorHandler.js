import * as Sentry from '@sentry/node';

export const sentryErrorHandler = Sentry.Handlers.errorHandler();

export const generalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
};
