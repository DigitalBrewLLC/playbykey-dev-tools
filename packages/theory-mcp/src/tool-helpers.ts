export type ToolContent = { content: Array<{ type: 'text'; text: string }> };

export function errorContent(message: string): ToolContent {
  return { content: [{ type: 'text', text: message }] };
}

export function okContent(summary: string, data: unknown): ToolContent {
  return {
    content: [{ type: 'text', text: `${summary}\n\n${JSON.stringify(data)}` }],
  };
}
