import app from './app';

/**
 * Start Express server.
 */
const server = app.listen(process.env.PORT, () => {
  console.log('App is running at http://localhost:%d in %s mode', process.env.PORT, app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

export default server;
