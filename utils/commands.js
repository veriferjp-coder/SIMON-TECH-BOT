// Command setup and management
function setupCommands(socket, config) {
  console.log('✅ Commands initialized');
  console.log(`📝 Prefix: ${config.botPrefix}`);
  console.log('🎯 Available commands:');
  console.log(`  - ${config.botPrefix}ping`);
  console.log(`  - ${config.botPrefix}menu`);
  console.log(`  - ${config.botPrefix}help`);
  console.log(`  - ${config.botPrefix}status`);
}

module.exports = { setupCommands };
