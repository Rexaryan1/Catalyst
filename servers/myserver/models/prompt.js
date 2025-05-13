const mongoose = require('mongoose');
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const promptSchema = new mongoose.Schema({
  promptId: mongoose.Schema.ObjectId,
  prompt: String,
  reply: String
},{
    statics:{
        async promptJson(msg){
            const response = await groq.chat.completions.create({
                messages: [
                    {
                      role: "user",
                      content: msg,
                    },
                  ],
                model: process.env.ModelName,
                response_format: { type: "json_object" },
              });
              return JSON.parse(response?.choices[0]?.message?.content);
        }
    }
});

const Prompt = mongoose.model('prompts', promptSchema);
module.exports = Prompt