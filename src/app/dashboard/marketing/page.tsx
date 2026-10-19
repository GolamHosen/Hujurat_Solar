"use client";

import { useState } from "react";
import {
  Sparkles,
  Newspaper,
  Search,
  Mail,
  Wrench,
  Copy,
  Check,
  Loader2,
  Bot,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";

type ToolType = "blog" | "seo_meta" | "email" | "service_description";

interface Tool {
  id: ToolType;
  label: string;
  icon: typeof Sparkles;
  description: string;
  placeholder: string;
  color: string;
  bgColor: string;
}

const TOOLS: Tool[] = [
  {
    id: "blog",
    label: "Blog Post Generator",
    icon: Newspaper,
    description: "Generate full SEO-optimized blog articles about solar energy topics for the Australian market.",
    placeholder: "e.g. Write a comprehensive guide about the best solar panels for Western Sydney homes in 2025, including government rebates and ROI calculations",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  {
    id: "seo_meta",
    label: "SEO Meta Generator",
    icon: Search,
    description: "Generate optimized meta titles & descriptions for any page on your site.",
    placeholder: "e.g. Generate SEO meta for our residential solar installation service page targeting Sydney homeowners",
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
  },
  {
    id: "email",
    label: "Email Campaign Writer",
    icon: Mail,
    description: "Create professional marketing emails to send to your leads and customers.",
    placeholder: "e.g. Write a promotional email about our spring solar sale with 20% off installations, mention the NSW battery rebate ending soon",
    color: "text-violet-600",
    bgColor: "bg-violet-50 border-violet-200",
  },
  {
    id: "service_description",
    label: "Service Description Writer",
    icon: Wrench,
    description: "Generate compelling descriptions for your solar services and products.",
    placeholder: "e.g. Write a description for our commercial solar installation service, highlighting large-scale systems for warehouses and office buildings",
    color: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-200",
  },
];

export default function MarketingPage() {
  const [activeTool, setActiveTool] = useState<ToolType>("blog");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [expandedTool, setExpandedTool] = useState<ToolType | null>("blog");

  const currentTool = TOOLS.find((t) => t.id === activeTool)!;

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeTool, prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function selectTool(toolId: ToolType) {
    setActiveTool(toolId);
    setExpandedTool(toolId);
    setResult("");
    setError("");
    setPrompt("");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 font-display text-2xl font-extrabold text-slate-950">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            AI Marketing Hub
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Generate professional marketing content for Hujurat Solar using OpenAI
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
          <Bot className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700">AI Powered</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* LEFT: Tool Selector */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Select AI Tool</p>
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            const isExpanded = expandedTool === tool.id;

            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => selectTool(tool.id)}
                className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                  isActive
                    ? `${tool.bgColor} shadow-md ring-1 ring-current/10`
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        isActive ? `${tool.bgColor}` : "bg-slate-100"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? tool.color : "text-slate-400"}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isActive ? "text-slate-950" : "text-slate-700"}`}>
                        {tool.label}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                {isExpanded && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{tool.description}</p>
                )}
              </button>
            );
          })}

          {/* Quick Tips */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-900">
              <Zap className="h-3.5 w-3.5 text-indigo-500" />
              Pro Tips
            </h4>
            <ul className="mt-2.5 space-y-1.5 text-[11px] leading-relaxed text-indigo-700/80">
              <li>• Be specific about topics, suburbs, and target audience</li>
              <li>• Mention specific products (Fronius, SunGrow, LONGi, etc.)</li>
              <li>• Include keywords you want to rank for</li>
              <li>• Reference current government rebates for better content</li>
            </ul>
          </div>
        </div>

        {/* RIGHT: Generation Panel */}
        <div className="space-y-5">
          {/* Input Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <currentTool.icon className={`h-5 w-5 ${currentTool.color}`} />
              <h2 className="font-display text-base font-bold text-slate-950">{currentTool.label}</h2>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Describe what you want to generate <span className="text-red-500">*</span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder={currentTool.placeholder}
                className="w-full rounded-xl border border-slate-300 p-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                Powered by OpenAI GPT-4o Mini • Results are AI-generated, review before publishing
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-slate-950">Generated Content</h3>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="prose-hujurat max-w-none whitespace-pre-wrap rounded-xl bg-slate-50 p-5 text-sm leading-relaxed text-slate-800">
                {result}
              </div>

              {/* Quick Actions */}
              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setPrompt(`Improve and expand on this: ${result.slice(0, 200)}...`);
                    setResult("");
                  }}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  ✨ Refine & Improve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPrompt(`Make this more concise and punchy: ${result.slice(0, 200)}...`);
                    setResult("");
                  }}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  📝 Make Shorter
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPrompt("");
                    setResult("");
                  }}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  🔄 Start Fresh
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100">
                <Sparkles className="h-7 w-7 text-indigo-500" />
              </div>
              <p className="mt-4 font-display text-base font-bold text-slate-700">Ready to generate</p>
              <p className="mt-1.5 text-sm text-slate-500">
                Describe what you need and click Generate to create AI-powered marketing content
              </p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
              </div>
              <p className="mt-4 font-display text-base font-bold text-slate-700">AI is writing...</p>
              <p className="mt-1.5 text-sm text-slate-500">
                Generating high-quality content tailored for Hujurat Solar. This may take 10-30 seconds.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
