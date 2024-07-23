module.exports = {
  apps: [
    {
      name: "the-bombay-forum",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
