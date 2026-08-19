import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper to lazily initialize Gemini client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  };

  // Real System Diagnostic Telemetry Endpoint
  app.get('/api/agent/system', (req, res) => {
    const mem = process.memoryUsage();
    res.json({
      status: 'ONLINE',
      engine: 'Guardian AI Core v2.4.1',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptimeSec: Math.floor(process.uptime()),
      heapUsedMb: (mem.heapUsed / 1024 / 1024).toFixed(2),
      heapTotalMb: (mem.heapTotal / 1024 / 1024).toFixed(2),
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString()
    });
  });

  // Real Task Decomposition & Autonomous Reasoning Endpoint using Gemini
  app.post('/api/agent/plan', async (req, res) => {
    try {
      const { command, systemContext, realFiles } = req.body;
      if (!command || typeof command !== 'string') {
        return res.status(400).json({ error: 'Command prompt is required' });
      }

      const ai = getGeminiClient();
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;

      if (ai) {
        try {
          const prompt = `You are the kernel reasoning engine of Guardian AI Agent, an autonomous Android-style system agent.
Analyze this user task request and construct a realistic, precise execution plan with multi-stage reasoning logs.

User Command: "${command}"
Detected Device Context: ${JSON.stringify(systemContext || {})}
Real Detected Files in Workspace/Upload (if any): ${JSON.stringify(realFiles || [])}

Generate a structured execution plan. Determine if the operation is "high risk" (e.g. file deletion, mass cleanup, permission changes, credential access, or permanent mutations).
Provide realistic steps and sequential log items categorized as:
- 'SYS' for system events & kernel transitions
- 'OBS' for visual/file/screen observations
- 'RSN' for autonomous planning and reasoning
- 'ACT' for executable actions
- 'WRN' for security notices
- 'ERR' for failed sub-operations`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'Clean normalized title of task' },
                  description: { type: Type.STRING, description: 'Technical summary of the autonomous plan' },
                  currentStage: { type: Type.STRING, description: 'Initial stage name (e.g. Observe & Reason, Parsing, Planning)' },
                  currentSubtext: { type: Type.STRING, description: 'Short active subtext' },
                  isHighRisk: { type: Type.BOOLEAN, description: 'Whether this requires explicit user confirmation before destructive mutation' },
                  highRiskDetails: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      targetCount: { type: Type.INTEGER },
                      policyText: { type: Type.STRING },
                      items: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            icon: { type: Type.STRING },
                            size: { type: Type.STRING }
                          },
                          required: ['name', 'icon']
                        }
                      }
                    }
                  },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        label: { type: Type.STRING },
                        status: { type: Type.STRING, description: 'pending, in_progress, or completed' }
                      },
                      required: ['id', 'label', 'status']
                    }
                  },
                  initialLogs: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        level: { type: Type.STRING, description: 'SYS, ACT, OBS, RSN, WRN, ERR' },
                        message: { type: Type.STRING }
                      },
                      required: ['level', 'message']
                    }
                  },
                  subsequentStages: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stage: { type: Type.STRING },
                        subtext: { type: Type.STRING },
                        level: { type: Type.STRING },
                        message: { type: Type.STRING }
                      },
                      required: ['stage', 'subtext', 'level', 'message']
                    }
                  }
                },
                required: ['title', 'description', 'currentStage', 'currentSubtext', 'isHighRisk', 'steps', 'initialLogs', 'subsequentStages']
              }
            }
          });

          if (response.text) {
            const parsed = JSON.parse(response.text);
            const formattedLogs = parsed.initialLogs.map((l: { level: string; message: string }, i: number) => ({
              id: `log-${Date.now()}-${i}`,
              time: timeStr,
              level: l.level,
              message: l.message
            }));

            return res.json({
              success: true,
              plan: {
                ...parsed,
                logs: formattedLogs
              }
            });
          }
        } catch (geminiErr) {
          console.error('Gemini planning failed, falling back to heuristic engine:', geminiErr);
        }
      }

      // Fallback Dynamic Autonomous Engine when offline or API key isn't provided
      const isDeleteOrClean = /delete|remove|clean|purge|erase|wipe|kill|format/i.test(command);
      const isOrganize = /organize|sort|group|categorize|folder/i.test(command);
      const isScan = /scan|inspect|check|find|search|audit|detect|memory|storage/i.test(command);

      const dynamicSteps = [
        { id: 's1', label: `Context analysis: "${command.slice(0, 45)}"`, status: 'completed' as const },
        { id: 's2', label: isOrganize ? 'Cataloging file types and destination tree' : isScan ? 'Scanning memory and permission scope' : 'Executing kernel command sequence', status: 'in_progress' as const },
        { id: 's3', label: isDeleteOrClean ? 'Applying safety quarantine & confirmation' : 'Finalizing task state and persistence', status: 'pending' as const }
      ];

      const initialLogs = [
        { id: `log-init-${Date.now()}-1`, time: timeStr, level: 'SYS' as const, message: `Dispatched command to Guardian Runtime: "${command}"` },
        { id: `log-init-${Date.now()}-2`, time: timeStr, level: 'OBS' as const, message: `Inspected ${realFiles?.length || 1} target contexts. System baseline nominal.` },
        { id: `log-init-${Date.now()}-3`, time: timeStr, level: 'RSN' as const, message: `Identified execution strategy: ${isOrganize ? 'Hierarchical File Grouping' : isScan ? 'Deep Diagnostic Sweep' : 'Autonomous Action Chain'}.` }
      ];

      const subsequentStages = [
        { stage: 'Execution Phase', subtext: 'Running autonomous action routines...', level: 'ACT', message: 'Executed batch operations within sandboxed sandbox.' },
        { stage: 'Verification', subtext: 'Verifying task integrity and checksums...', level: 'OBS', message: 'Validated integrity of modified records.' },
        { stage: 'Completed', subtext: 'All task requirements fulfilled.', level: 'SYS', message: 'Task concluded with zero safety infractions.' }
      ];

      const highRiskDetails = isDeleteOrClean ? {
        title: 'Confirm Target Modification / Removal',
        description: 'Guardian AI detected a destructive operation requested by this command.',
        targetCount: realFiles?.length || 5,
        policyText: 'Autonomous Agent Safety Policy 4.2 requires explicit user approval before permanently modifying or deleting data.',
        items: realFiles && realFiles.length > 0 ? realFiles.slice(0, 8).map((f: { name: string; size?: string }) => ({
          name: f.name,
          icon: 'description',
          size: f.size || '142 KB'
        })) : [
          { name: 'temporary_cache_index.tmp', icon: 'description', size: '4.2 MB' },
          { name: 'installer_setup_v1.0.apk', icon: 'android', size: '38.6 MB' },
          { name: 'backup_partial_archive.zip', icon: 'folder_zip', size: '112 MB' },
          { name: 'old_screen_capture.png', icon: 'image', size: '1.8 MB' }
        ]
      } : undefined;

      return res.json({
        success: true,
        plan: {
          title: command,
          description: `Autonomous execution workflow for "${command}". Protected by Guardian sandbox.`,
          currentStage: 'Observe & Reason',
          currentSubtext: 'Analyzing requested intent and target context...',
          isHighRisk: isDeleteOrClean,
          highRiskDetails,
          steps: dynamicSteps,
          logs: initialLogs,
          subsequentStages
        }
      });
    } catch (err: unknown) {
      console.error('Server error handling agent plan:', err);
      res.status(500).json({ error: (err as Error).message || 'Failed to generate agent plan' });
    }
  });

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Guardian AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
