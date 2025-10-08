"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import mixpanel from "mixpanel-browser";
import { ThumbsUpIcon, ThumbsDownIcon, SendIcon, XIcon, FlagIcon } from "lucide-react";

const experimentId = "you-admin-helper-bot";
type Variant = "cloud bot (A)" | "on prem bot (B)" | "control (C)";
const fallbackVariant: Variant = "control (C)";

// Cloud bot responses - knows about cloud/scalable solutions
const cloudBotResponses = [
  "For that integration, I'd recommend using our Snowflake connector with auto-scaling enabled. It handles millions of rows effortlessly.",
  "Great question! youAdmin integrates seamlessly with AWS Lambda for serverless data pipelines. Very cost-effective at scale.",
  "You'll want to leverage our BigQuery integration - it's optimized for petabyte-scale analytics with sub-second query times.",
  "Consider using our Databricks connector for that use case. The distributed computing really shines with large datasets.",
  "Our Azure Synapse integration is perfect for that. It auto-scales based on workload and provides excellent cost optimization.",
  "I'd suggest implementing this via our Kubernetes operator - gives you infinite horizontal scalability.",
  "For real-time sync, our Kafka integration is battle-tested at enterprise scale. Handles millions of events per second.",
  "The cloud-native approach here is to use our S3 data lake connector with automatic partitioning and indexing.",
  "Our GCP Cloud Functions integration makes this trivial - just set it and forget it, scales automatically.",
  "Definitely go with our Redshift connector for this. Columnar storage means lightning-fast aggregations on huge datasets.",
  "youAdmin's Terraform provider makes infrastructure-as-code deployment a breeze. Full GitOps workflow support.",
  "Use our Airflow integration for orchestration - it's cloud-agnostic and scales beautifully in managed environments.",
  "Our Fivetran-style CDC connectors keep everything in sync with zero configuration. Cloud data warehouses love it.",
  "I recommend our dbt Cloud integration - transforms your data directly in your warehouse with version control.",
  "The Looker API connector we provide gives you instant BI on any cloud data platform you're using.",
  "For multi-cloud deployments, our Pulumi integration handles all the complexity. Infrastructure provisioning is automatic.",
  "Stream data changes using our cloud-native Change Data Capture to Kinesis - millisecond latency at any scale.",
  "Our Athena connector lets you query directly from S3 without moving data. Very cost-effective for infrequent queries.",
];

// On-prem bot responses - knows about local/scrappy solutions
const onPremBotResponses = [
  "For that, I'd write a Python script with psycopg2. Run it on a cron job - simple and effective.",
  "You can set up a local PostgreSQL instance and use our CSV import tool. Works great on a single server.",
  "Just write a bash script that calls our REST API every hour. Pipe the results to a local SQLite database.",
  "I'd recommend a Node.js script hitting our endpoints and writing to local files. Very straightforward.",
  "Set up a local MySQL database and use our command-line sync tool. Runs fine on commodity hardware.",
  "You could build a quick Flask app that polls our API and stores data locally. Deploy it on-prem easily.",
  "A simple Ruby script with the 'rest-client' gem works perfectly. Schedule it with cron and log to local disk.",
  "Use our SFTP sync feature to dump files to your local network drive. Then process them with Excel or Python.",
  "I'd write a PowerShell script for that. It can call our API and write results to your on-prem SQL Server.",
  "Just set up a local Redis instance as a cache layer. A small Python worker can keep it synced with youAdmin.",
  "You can use our webhook feature to push updates to a local Express server. Saves data to local MongoDB.",
  "A basic Perl script with LWP::UserAgent will do the trick. Output to CSV files on your local file share.",
  "Deploy a small Docker container on-prem running our sync daemon. Writes to whatever database you point it at.",
  "Use our command-line tools with a shell script wrapper. Schedule it with cron and it'll run forever on bare metal.",
  "A Java application using our SDK can run on your local Tomcat server. Persists data to your on-prem Oracle DB.",
  "Just use curl in a bash script to hit our endpoints. Parse the JSON with jq and insert into local Postgres.",
  "I'd set up a local RabbitMQ queue and write a small consumer that talks to youAdmin's API. Very reliable.",
  "You can use rsync to pull our data exports to your local NAS, then process them with awk and sed.",
];

// Control bot responses - asks more questions, unhelpful
const controlBotResponses = [
  "That's an interesting question. Could you tell me more about your specific use case?",
  "Hmm, good point. What exactly are you trying to accomplish with that integration?",
  "I see. Can you elaborate on what systems you're currently using?",
  "Interesting! What's your current tech stack look like?",
  "That depends - what's your data volume? How many users are we talking about?",
  "Good question. First, can you tell me about your existing infrastructure?",
  "I'd need to know more. Are you on cloud or on-premise currently?",
  "That could work. What other tools are you integrating with?",
  "Let me understand better - what's driving this requirement?",
  "Before I answer, can you describe your current workflow?",
  "That's possible. What's your budget for this integration?",
  "Hmm. What compliance requirements do you need to meet?",
  "I see what you mean. What's your timeline for implementation?",
  "Could you clarify what you mean by that?",
  "That's a broad question. Can you be more specific about the integration points?",
  "Interesting use case. What's your team's technical expertise level?",
  "I'd need more context. What problem are you trying to solve?",
  "That varies. What's your data retention policy?",
];

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

export interface ChatbotModalProps {
  onClose?: () => void;
}

export function ChatbotModal(props: ChatbotModalProps) {
  const { onClose } = props;
  const [variant, setVariant] = React.useState<Variant | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [hasVoted, setHasVoted] = React.useState(false);

  React.useEffect(() => {
    mixpanel.flags
      .get_variant_value(experimentId, fallbackVariant)
      .then((returnedVariant: unknown) => {
        let v = returnedVariant as Variant;
        if (!v || typeof v !== "string") v = fallbackVariant;
        console.log("[MIXPANEL]: GOT FLAG", v);
        setVariant(v);

        // Initial greeting based on variant
        const greetings = {
          "cloud bot (A)": "Hi! I'm your cloud-native integration specialist. Ask me about our scalable cloud connectors!",
          "on prem bot (B)": "Hey there! I'm here to help with practical, on-premise integration solutions. What can I help you script up?",
          "control (C)": "Hello! I'm here to help with youAdmin integrations. What would you like to know?",
        };

        setMessages([{ role: "bot", content: greetings[v] }]);
      });
  }, []);

  const getRandomResponse = () => {
    if (!variant) return "Loading...";

    if (variant === "cloud bot (A)") {
      return cloudBotResponses[Math.floor(Math.random() * cloudBotResponses.length)];
    } else if (variant === "on prem bot (B)") {
      return onPremBotResponses[Math.floor(Math.random() * onPremBotResponses.length)];
    } else {
      return controlBotResponses[Math.floor(Math.random() * controlBotResponses.length)];
    }
  };

  const handleSend = () => {
    if (!inputValue.trim() || !variant) return;

    const userMessage: ChatMessage = { role: "user", content: inputValue };
    const botMessage: ChatMessage = { role: "bot", content: getRandomResponse() };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputValue("");

    mixpanel.track("Admin Chatbot Message Sent", {
      variant,
      message_length: inputValue.length,
      total_messages: messages.length + 1,
    });
  };

  const handleVote = (vote: "up" | "down") => {
    if (hasVoted) return;

    setHasVoted(true);
    mixpanel.track(vote === "up" ? "Admin Chatbot Thumbs Up" : "Admin Chatbot Thumbs Down", {
      variant,
      total_messages: messages.length,
    });
  };

  const handleClose = () => {
    mixpanel.track("Admin Chatbot Closed", {
      variant,
      total_messages: messages.length,
      has_voted: hasVoted,
    });
    onClose?.();
  };

  if (!variant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={handleClose} />

      {/* Chat Window */}
      <div className="relative z-10 bg-white rounded-lg shadow-2xl w-96 h-[600px] flex flex-col border-2 border-blue-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlagIcon className="h-5 w-5" />
            <h3 className="font-semibold">youAdmin Helper</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-white hover:bg-white/20"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200 text-slate-900"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Voting Buttons */}
        <div className="border-t border-slate-200 p-3 bg-slate-50">
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs text-slate-600">Was this helpful?</span>
            <Button
              size="sm"
              variant={hasVoted ? "default" : "outline"}
              onClick={() => handleVote("up")}
              disabled={hasVoted}
              className={hasVoted ? "bg-green-600" : ""}
            >
              <ThumbsUpIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleVote("down")}
              disabled={hasVoted}
            >
              <ThumbsDownIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 p-4 bg-white rounded-b-lg">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about integrations..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
          <a
            href="https://mixpanel.com/project/3276012/view/3782804/app/feature-flags/1c4fa66b-c9d4-4f22-aba4-a4563e0c1328"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-blue-600 mt-2 block text-center transition-colors"
          >
            ⚙️ View flag in Mixpanel
          </a>
        </div>
      </div>
    </div>
  );
}
