const { Kafka } = require("kafkajs");

// Initialize Kafka client
const kafka = new Kafka({
  clientId: "task-management",
  brokers: ["localhost:9092"], // Kafka broker address
});

let producer; // Lazy initialization: No producer instance at startup

// Function to get or create the Kafka producer
const getProducer = async () => {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    console.log("🚀 Kafka Producer Connected");
  }
  return producer;
};

// Function to send task-related events
const sendTaskEvent = async (eventType, taskData) => {
  try {
    const producerInstance = await getProducer(); // Ensure producer is initialized
    await producerInstance.send({
      topic: "task-added", // Kafka topic
      messages: [
        {
          value: JSON.stringify({ eventType, taskData }), // Task data and event type
        },
      ],
    });
    console.log(`📤 Kafka Event Sent: ${eventType}`);
  } catch (error) {
    console.error("❌ Kafka Producer Error:", error);
  }
};

module.exports = { sendTaskEvent };
