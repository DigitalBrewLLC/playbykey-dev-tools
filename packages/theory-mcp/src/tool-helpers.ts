export type ToolContent = {
  content: Array<{ type: 'text'; text: string }>;
  structuredContent?: Record<string, unknown>;
};

export function errorContent(message: string): ToolContent {
  return { content: [{ type: 'text', text: message }] };
}

export function okContent(
  summary: string,
  data: Record<string, unknown>
): ToolContent {
  return {
    content: [{ type: 'text', text: `${summary}\n\n${JSON.stringify(data)}` }],
    structuredContent: data,
  };
}
