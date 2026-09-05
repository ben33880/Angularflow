// HTTP API service removed - MQTT is now the only communication protocol
// See mqtt.service.ts for complete MQTT implementation

// This file is kept for backward compatibility reference only

export interface LegacyApiEndpoints {
  // GET /api/pool/status - replaced by MQTT: flowio/pool/status
  // POST /api/pool/filtration - replaced by MQTT: flowio/cmd/pool/filtration
  // POST /api/pool/chlorine - replaced by MQTT: flowio/cmd/pool/chlorine
  // POST /api/pool/ph - replaced by MQTT: flowio/cmd/pool/ph
  // GET /api/device/config - replaced by MQTT subscription
  // POST /api/device/config - replaced by MQTT: flowio/cmd/config/update
  // GET /api/logs - replaced by MQTT: flowio/logs/+
  // GET /api/alarms - replaced by MQTT: flowio/alarms/active
  // POST /api/alarms/:id/ack - replaced by MQTT: flowio/cmd/alarm/ack
  // GET /api/health - replaced by MQTT: flowio/system/status
}

// All components now use MqttService exclusively
