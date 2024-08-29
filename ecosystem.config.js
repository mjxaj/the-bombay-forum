module.exports = {
    apps: [
      {
        name: 'the-bombay-forum',
        script: 'npm',
        args: 'run dev',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  