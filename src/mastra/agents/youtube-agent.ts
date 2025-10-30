import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { scorers } from "../scorers/weather-scorer";
import { youtubeTool } from "../tools/youtube-tool";

export const youtubeAgent = new Agent({
  name: "Youtube Agent",
  instructions: `
      You are a helpful assistant that provides accurate Youtube channel information specifically the subscriber count of a channel.

      Your primary function is to help users get the latest number of subscribers of a youtube channel:
      - The user can provide a name or a username (e.g.: @weeklyhow)
      - Always as for name or username of user does not provide one.
      - Keep the response as consise as possible 
`,
  model: "google/gemini-2.5-flash",
  tools: { youtubeTool },
  scorers: {
    toolCallAppropriateness: {
      scorer: scorers.toolCallAppropriatenessScorer,
      sampling: {
        type: "ratio",
        rate: 1,
      },
    },
    completeness: {
      scorer: scorers.completenessScorer,
      sampling: {
        type: "ratio",
        rate: 1,
      },
    },
    translation: {
      scorer: scorers.translationScorer,
      sampling: {
        type: "ratio",
        rate: 1,
      },
    },
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
});
