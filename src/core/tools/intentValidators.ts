import type { ToolUse } from "../../shared/tools"

export function requireIntentAndMutation(tool: ToolUse): string | null {
	const p = (tool as any).params || {}
	const intent = p.intent_id ?? p.intentId
	const mutation = p.mutation_class ?? p.mutationClass
	if (!intent && !mutation) return "Missing required parameters: intent_id, mutation_class"
	if (!intent) return "Missing required parameter: intent_id"
	if (!mutation) return "Missing required parameter: mutation_class"
	return null
}
