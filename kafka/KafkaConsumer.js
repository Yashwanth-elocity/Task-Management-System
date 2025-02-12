const { Kafka } = require("kafkajs");
const Task = require("../models/task.model");

const kafka = new Kafka({
  clientId: "task-management",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "task-consumer-group" });

// Function to retry DB operation with exponential backoff
const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    console.log(`🔄 Retry attempt: ${4 - retries} after ${delay}ms`);
    await new Promise((res) => setTimeout(res, delay));
    return retry(fn, retries - 1, delay * 2); // Exponential backoff
  }
};

const consumeTasks = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "task-added", fromBeginning: true });
  console.log("🚀 Kafka Consumer Running...");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        console.log(`📥 Received Task Event: ${message.value.toString()}`);

        const { taskData } = JSON.parse(message.value.toString());
        const saveTask = async () => {
          const task = new Task({
            title: taskData.title,
            ...(taskData?.description && { description: taskData.description }),
            ...(taskData?.status && { status: taskData.status }),
            ...(taskData?.dueDate && { dueDate: taskData.dueDate }),
          });

          return await task.save();
        };
        const savedTask = await retry(saveTask);
        console.log(`✅ Task saved to DB: ${savedTask._id}`);
      } catch (error) {
        console.error("❌ Kafka Consumer Error:", error.message);
      }
    },
  });
};
module.exports = { consumeTasks };
