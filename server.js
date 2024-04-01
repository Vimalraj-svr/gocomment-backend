import express from 'express';
import cors from 'cors';
import { G4F } from 'g4f';
import './dotEnvConfig.js';

const g4f = new G4F();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("App is working fine");
});

app.post('/getcomments', async (req, res) => {
  const { snippet } = req.body;
  const options = {
      model: "gpt-4",
      debug: true,
      retry: {
          times: 3,
          condition: (text) => {
              const words = text.split(" ");
              return words.length > 10;
          }
      },
      output: (text) => {
          return text;
      }
  };
  const format = `{
      "comments": "generated comments"
  }`;
  const messages = [
      { role: "system", content: `Act as an Code Analyser.` },
      { role: "user", content: `Generate good and Explanatory Comments for the give code snippet\n${snippet}, Just give me only the object with comment as keys with their respective contents only in this format ${format}` },
  ];
  console.log("Comments messages ----->",messages);
  try {
      let text = await g4f.chatCompletion(messages, options);
      if (text.includes("```")) {
          text = text.replaceAll("```", '');
          text = text.replace("json", '');
      }
      const responseObject = JSON.parse(text);
      const responseString = JSON.stringify(responseObject);
      res.status(200).json({ response: responseString});
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/getvulnerabilities', async (req, res) => {
  const { snippet } = req.body;
  const options = {
      model: "gpt-4",
      debug: true,
      retry: {
          times: 3,
          condition: (text) => {
              const words = text.split(" ");
              return words.length > 10;
          }
      },
      output: (text) => {
          return text;
      }
  };
  const format = `{
      "vulnerabilities": ["Array of vulnerabilities"]
  }`;
  const messages = [
      { role: "system", content: `Act as an Code Analyser.` },
      { role: "user", content: `Generate good and Explanatory vulnerability in the give code snippet\n${snippet}, Just give me only the object with vulnerability as key with their respective vulnerabilities as array only in this format ${format}` },
  ];
  console.log("Vulnerabilities messages----->",messages);
  try {
      let text = await g4f.chatCompletion(messages, options);
      if (text.includes("```")) {
          text = text.replaceAll("```", '');
          text = text.replace("json", '');
      }
      const responseObject = JSON.parse(text);
      const responseString = JSON.stringify(responseObject);
      res.status(200).json({ response: responseString});
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
