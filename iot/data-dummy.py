import random
import json
import time
import paho.mqtt.client as mqtt
import ssl
import logging
import pkg_resources
import datetime
import uuid

# Get the installed version of Paho MQTT
paho_mqtt_version = pkg_resources.get_distribution("paho-mqtt").version

# Configure logging for detailed monitoring
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# IoT Core
iot_endpoint = "XXX"  # IoT Core Endpoint
iot_port = 8883  # IoT Core Port
iot_topic = "api/integration"

# IoT Core Cert Path
cert = "XXX"  # Path to Device Cert
priv = "XXX"  # Path to Private Key
ca = "XXX"  # Path to Root CA

# MQTT Connection Callback Function
def on_connect(client, userdata, flags, reason_code, properties=None):
    if flags.session_present:
        logging.info("Session present.")
    if reason_code == 0:
        logging.info("Connected to IoT Core!")
    else:
        logging.error(f"Connection failed with reason code {reason_code}")

# MQTT Publish Callback Function
def on_publish(client, userdata, mid, reason_codes=None, properties=None):
    logging.info(f"Message {mid} published successfully.")
    if reason_codes:
        logging.info(f"Publish reason codes: {reason_codes}")

# MQTT Disconnect Callback Function
def on_disconnect(client, userdata, flags, reason_code, properties=None):
    if reason_code == 0:
        logging.info("Disconnected successfully.")
    else:
        logging.warning(f"Disconnected with reason code: {reason_code}")

# Dummy Data Generator
def generate_dummy_data():
    data = {
        'id': str(uuid.uuid4())[:8],
        'timestamp': datetime.datetime.now().isoformat(),
        'timestamp': datetime,
        'temperature': round(random.uniform(20.0, 40.0), 2),
        'humidity': round(random.uniform(30.0, 90.0), 2),
        'gas_concentration': round(random.uniform(0.0, 1.0), 2),
        'fire_intensity': round(random.uniform(0.0, 100.0), 2)
    }
    return data

# Initialize MQTT client with Callback API Version 2
mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

# Attach callback functions
mqtt_client.on_connect = on_connect
mqtt_client.on_publish = on_publish
mqtt_client.on_disconnect = on_disconnect

# Set up TLS/SSL authentication
mqtt_client.tls_set(
    ca_certs=ca,
    certfile=cert,
    keyfile=priv,
    tls_version=ssl.PROTOCOL_TLSv1_2  # Ensure TLSv1.2 for better performance and security
)

# Enable auto-reconnect in case of disconnection
mqtt_client.reconnect_delay_set(min_delay=1, max_delay=60)

# Connect to IoT Core
try:
    mqtt_client.connect(iot_endpoint, iot_port, keepalive=30)
except Exception as e:
    logging.error(f"Failed to connect to IoT Core: {e}")
    exit(1)

# Start the loop
mqtt_client.loop_start()

# Publish data to IoT Core in a loop
try:
    while True:
        # Generate dummy sensor data
        data = generate_dummy_data()

        # Convert the data to JSON format
        payload = json.dumps(data)

        # Publish the data with QoS 1 for guaranteed delivery at least once
        result = mqtt_client.publish(iot_topic, payload, qos=1)

        # Log the result and check if the message was successfully queued
        if result.rc == mqtt.MQTT_ERR_SUCCESS:
            result.wait_for_publish()
            logging.info(f"Published data: {payload}")
        else:
            logging.error(f"Failed to publish message. Result code: {result.rc}")

        # Wait for 5 seconds before publishing the next message
        time.sleep(5)

except KeyboardInterrupt:
    logging.info("Stopped publishing.")
finally:
    # Ensure all in-flight messages are sent before disconnecting
    logging.info("Waiting for in-flight messages to be sent...")
    mqtt_client.loop_stop()
    mqtt_client.disconnect()
    logging.info("Disconnected from IoT Core.")